import { FILE_SIZES, FILE_SIZE_CONSTANTS } from "../types/file-types";

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = FILE_SIZE_CONSTANTS.KILOBYTE;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2));

  return `${size} ${FILE_SIZES[i]}`;
}

export function createDownloadLink(blob: Blob, fileName: string): void {
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  window.URL.revokeObjectURL(link.href);
  document.body.removeChild(link);
}
