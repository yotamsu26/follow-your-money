import { useState } from "react";
import { useApiClient } from "../../contexts/ApiContext";
import { API_ENDPOINTS } from "../../utils/routes";
import { FileData } from "../../types/file-types";
import { FileEditForm } from "./FileEditForm";
import { FileActions } from "./FileActions";
import { formatFileSize, createDownloadLink } from "../../utils/file-utils";

interface FileItemProps {
  file: FileData;
  onFileUpdated: () => void;
}

export function FileItem({ file, onFileUpdated }: FileItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const apiClient = useApiClient();

  function startEdit() {
    setIsEditing(true);
  }

  function cancelEdit() {
    setIsEditing(false);
  }

  async function handleSave(newName: string) {
    try {
      const response = await apiClient.put(
        API_ENDPOINTS.FILES.RENAME(file.file_id),
        { newName }
      );

      if (response.success) {
        setIsEditing(false);
        onFileUpdated();
      } else {
        console.error("Failed to rename file:", response.error);
        alert(`Failed to rename file: ${response.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error renaming file:", error);
      alert("Network error while renaming file. Please try again.");
    }
  }

  async function handleDownload() {
    try {
      const response = await apiClient.downloadFile(
        API_ENDPOINTS.FILES.DOWNLOAD(file.file_id)
      );
      const blob = await response.blob();

      if (blob.size === 0) {
        alert("File appears to be empty or corrupted.");
        return;
      }

      createDownloadLink(blob, file.original_name);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Download failed. Please try again.");
    }
  }

  async function handleDelete() {
    try {
      const response = await apiClient.delete(
        API_ENDPOINTS.FILES.BY_ID(file.file_id)
      );
      if (response.success) {
        onFileUpdated();
      }
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  }

  return (
    <div className="flex items-center justify-between bg-gray-50 px-2 py-1 rounded text-xs">
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <FileEditForm
            fileName={file.original_name}
            onSave={handleSave}
            onCancel={cancelEdit}
          />
        ) : (
          <span
            className="text-gray-700 truncate block cursor-pointer"
            onClick={startEdit}
            title="Click to rename"
          >
            {file.original_name}
          </span>
        )}
        <span className="text-gray-500">{formatFileSize(file.file_size)}</span>
      </div>
      {!isEditing && (
        <FileActions
          onDownload={handleDownload}
          onEdit={startEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
