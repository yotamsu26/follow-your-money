export const FILE_SIZES = ["Bytes", "KB", "MB", "GB"];

export interface FileData {
  file_id: string;
  original_name: string;
  file_size: number;
  mime_type: string;
  uploaded_at: string;
}

export const FILE_SIZE_CONSTANTS = {
  KILOBYTE: 1024,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
};

export const ALLOWED_FILE_TYPES = [
  ".pdf",
  ".jpg",
  ".jpeg",
  ".png",
  ".doc",
  ".docx",
];
