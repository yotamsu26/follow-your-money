interface FileUploadProps {
  moneyLocationId: string;
  isUploading: boolean;
  onFilesUploaded: () => void;
}

export function FileUpload({
  moneyLocationId,
  isUploading,
  onFilesUploaded,
}: FileUploadProps) {
  async function uploadNewFiles(selectedFiles: FileList) {
    try {
      const userData = localStorage.getItem("userData");
      if (!userData) return;

      const parsedUserData = JSON.parse(userData);
      const token = parsedUserData.token;

      const formData = new FormData();
      Array.from(selectedFiles).forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch(
        `http://localhost:3020/files/upload/${moneyLocationId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        onFilesUploaded();
      } else {
        console.error("Upload failed:", result.message);
        alert(`Upload failed: ${result.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Network error during upload. Please try again.");
    }
  }

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      uploadNewFiles(selectedFiles);
    }
    event.target.value = "";
  }

  return (
    <div className="flex items-center space-x-2">
      <input
        type="file"
        multiple
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        onChange={handleFileUpload}
        className="hidden"
        id={`file-upload-${moneyLocationId}`}
        disabled={isUploading}
      />
      <label
        htmlFor={`file-upload-${moneyLocationId}`}
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
