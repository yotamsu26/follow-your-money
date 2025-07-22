import { useState, useEffect } from "react";
import { FileUpload } from "./FileUpload";
import { FileItem } from "./FileItem";
import { wrapFetch } from "../../api/api-calls";

interface FileData {
  file_id: string;
  original_name: string;
  file_size: number;
  mime_type: string;
  uploaded_at: string;
}

interface FilesListProps {
  moneyLocationId: string;
}

export function FilesList({ moneyLocationId }: FilesListProps) {
  const [files, setFiles] = useState<FileData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (moneyLocationId) fetchFiles();
  }, [moneyLocationId]);

  async function fetchFiles() {
    try {
      setIsLoading(true);
      const userData = localStorage.getItem("userData");
      if (!userData) return;

      const parsedUserData = JSON.parse(userData);
      const token = parsedUserData.token;

      const response = await wrapFetch(
        `http://localhost:3020/files/${moneyLocationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        setFiles(result.data);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
    }

    setIsLoading(false);
  }

  async function handleFilesUploaded() {
    setIsUploading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await fetchFiles();
    } catch (error) {
      console.error("Error refreshing file list:", error);
    }
    setIsUploading(false);
  }

  return (
    <div className="border-t pt-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">Files:</span>
        <FileUpload
          moneyLocationId={moneyLocationId}
          isUploading={isUploading}
          onFilesUploaded={handleFilesUploaded}
        />
      </div>

      {isLoading ? (
        <div className="text-xs text-gray-500 mt-1">Loading files...</div>
      ) : files.length > 0 ? (
        <div className="space-y-1">
          {files.map((file) => (
            <FileItem
              key={file.file_id}
              file={file}
              onFileUpdated={fetchFiles}
            />
          ))}
        </div>
      ) : (
        <div className="text-xs text-gray-500 mt-1">No files uploaded</div>
      )}
    </div>
  );
}
