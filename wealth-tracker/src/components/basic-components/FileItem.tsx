import { useState } from "react";
import { wrapFetch } from "../../api/api-calls";

interface FileData {
  file_id: string;
  original_name: string;
  file_size: number;
  mime_type: string;
  uploaded_at: string;
}

interface FileItemProps {
  file: FileData;
  onFileUpdated: () => void;
}

export function FileItem({ file, onFileUpdated }: FileItemProps) {
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [newFileName, setNewFileName] = useState("");

  function startEdit(fileId: string, currentName: string) {
    setEditingFileId(fileId);
    setNewFileName(currentName);
  }

  function cancelEdit() {
    setEditingFileId(null);
    setNewFileName("");
  }

  function createNewLink(blob: Blob, fileName: string) {
    const newLink = document.createElement("a");
    newLink.href = window.URL.createObjectURL(blob);
    newLink.download = fileName;
    document.body.appendChild(newLink);
    newLink.click();
    window.URL.revokeObjectURL(newLink.href);
    document.body.removeChild(newLink);
  }

  async function downloadFile(fileId: string, fileName: string) {
    try {
      const userData = localStorage.getItem("userData");
      if (!userData) {
        alert("Authentication error. Please log in again.");
        return;
      }

      const parsedUserData = JSON.parse(userData);
      const token = parsedUserData.token;

      const response = await wrapFetch(
        `http://localhost:3020/files/download/${fileId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();

        if (blob.size === 0) {
          alert("File appears to be empty or corrupted.");
          return;
        }

        createNewLink(blob, fileName);
      } else {
        const errorData = await response.json();
        alert(`Download failed: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Network error during download. Please try again.");
    }
  }

  async function deleteFile(fileId: string) {
    try {
      const userData = localStorage.getItem("userData");
      if (!userData) return;

      const parsedUserData = JSON.parse(userData);
      const token = parsedUserData.token;

      const response = await wrapFetch(
        `http://localhost:3020/files/${fileId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        onFileUpdated();
      }
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  }

  async function saveEdit(fileId: string) {
    try {
      if (!newFileName.trim()) {
        alert("Please enter a valid file name");
        return;
      }

      const userData = localStorage.getItem("userData");
      if (!userData) {
        alert("Authentication error. Please log in again.");
        return;
      }

      const parsedUserData = JSON.parse(userData);
      const token = parsedUserData.token;

      const response = await wrapFetch(
        `http://localhost:3020/files/rename/${fileId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ newName: newFileName.trim() }),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setEditingFileId(null);
        setNewFileName("");
        onFileUpdated();
      } else {
        console.error("Failed to rename file:", result.message);
        alert(`Failed to rename file: ${result.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error renaming file:", error);
      alert("Network error while renaming file. Please try again.");
    }
  }

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  return (
    <div className="flex items-center justify-between bg-gray-50 px-2 py-1 rounded text-xs">
      <div className="flex-1 min-w-0">
        {editingFileId === file.file_id ? (
          <div className="flex items-center space-x-1">
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              className="text-xs border rounded px-1 flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter") saveEdit(file.file_id);
                if (e.key === "Escape") cancelEdit();
              }}
              autoFocus
            />
            <button
              onClick={() => saveEdit(file.file_id)}
              className="text-green-600 hover:text-green-800 px-1"
              title="Save"
            >
              ✓
            </button>
            <button
              onClick={cancelEdit}
              className="text-red-600 hover:text-red-800 px-1"
              title="Cancel"
            >
              ✕
            </button>
          </div>
        ) : (
          <span
            className="text-gray-700 truncate block cursor-pointer"
            onClick={() => startEdit(file.file_id, file.original_name)}
            title="Click to rename"
          >
            {file.original_name}
          </span>
        )}
        <span className="text-gray-500">{formatFileSize(file.file_size)}</span>
      </div>
      {editingFileId !== file.file_id && (
        <div className="flex space-x-1 ml-2">
          <button
            onClick={() => downloadFile(file.file_id, file.original_name)}
            className="text-blue-600 hover:text-blue-800 px-1"
            title="Download"
          >
            ↓
          </button>
          <button
            onClick={() => startEdit(file.file_id, file.original_name)}
            className="text-green-600 hover:text-green-800 px-1"
            title="Rename"
          >
            ✎
          </button>
          <button
            onClick={() => deleteFile(file.file_id)}
            className="text-red-600 hover:text-red-800 px-1"
            title="Delete"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
