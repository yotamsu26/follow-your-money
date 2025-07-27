import { useApiClient } from "../../contexts/ApiContext";
import { API_ENDPOINTS } from "../../utils/routes";
import {
  FILE_SIZE_CONSTANTS,
  ALLOWED_FILE_TYPES,
} from "../../types/file-types";

interface FileUploadProps {
  moneyLocationId: string;
  isUploading: boolean;
  onFilesUploaded: () => void;
}

function validateFiles(files: FileList): string | null {
  for (const file of Array.from(files)) {
    if (file.size > FILE_SIZE_CONSTANTS.MAX_FILE_SIZE) {
      return `File "${file.name}" is too large. Maximum size is 10MB.`;
    }

    const fileExtension = file.name
      .toLowerCase()
      .substring(file.name.lastIndexOf("."));
    if (!ALLOWED_FILE_TYPES.includes(fileExtension as string)) {
      return `File type "${fileExtension}" is not allowed.`;
    }
  }

  return null;
}

export function FileUpload({
  moneyLocationId,
  isUploading,
  onFilesUploaded,
}: FileUploadProps) {
  const apiClient = useApiClient();

  async function uploadFiles(selectedFiles: FileList) {
    const validationError = validateFiles(selectedFiles);
    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      const formData = new FormData();
      Array.from(selectedFiles).forEach((file) => {
        formData.append("files", file);
      });

      const response = await apiClient.post(
        API_ENDPOINTS.FILES.UPLOAD(moneyLocationId),
        formData
      );

      if (response.success) {
        onFilesUploaded();
      } else {
        console.error("Upload failed:", response.error);
        alert(`Upload failed: ${response.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Network error during upload. Please try again.");
    }
  }

  function handleFileSelection(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      uploadFiles(selectedFiles);
    }
    // Reset input to allow selecting the same files again
    event.target.value = "";
  }

  const uploadId = `file-upload-${moneyLocationId}`;
  const acceptedTypes = ALLOWED_FILE_TYPES.join(",");

  return (
    <div className="flex items-center space-x-2">
      <input
        type="file"
        multiple
        accept={acceptedTypes}
        onChange={handleFileSelection}
        className="hidden"
        id={uploadId}
        disabled={isUploading}
      />
      <label
        htmlFor={uploadId}
        className={`text-xs px-2 py-1 rounded cursor-pointer transition-colors ${
          isUploading
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-blue-100 text-blue-700 hover:bg-blue-200"
        }`}
      >
        {isUploading ? "Uploading..." : "+ Add Files"}
      </label>
    </div>
  );
}
