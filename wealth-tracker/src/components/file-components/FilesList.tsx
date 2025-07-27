import { useState, useEffect } from "react";
import { FileUpload } from "./FileUpload";
import { FileItem } from "./FileItem";
import { useApiClient } from "../../contexts/ApiContext";
import { API_ENDPOINTS } from "../../utils/routes";
import { FileData } from "../../types/file-types";

interface FilesListProps {
  moneyLocationId: string;
}

export function FilesList({ moneyLocationId }: FilesListProps) {
  const [files, setFiles] = useState<FileData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const apiClient = useApiClient();

  useEffect(() => {
    if (moneyLocationId) {
      fetchFiles();
    }
  }, [moneyLocationId]);

  async function fetchFiles() {
    try {
      setIsLoading(true);
      const response = await apiClient.get(
        API_ENDPOINTS.FILES.BY_LOCATION(moneyLocationId)
      );

      if (response.success) {
        setFiles(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
    }
    setIsLoading(false);
  }

  async function handleFilesUploaded() {
    setIsUploading(true);
    try {
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
