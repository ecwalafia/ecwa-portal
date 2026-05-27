export const MAX_DB_FILE_SIZE = 2 * 1024 * 1024;

export function formatFileSize(size) {
  return size >= 1024 * 1024
    ? (size / 1024 / 1024).toFixed(1) + " MB"
    : (size / 1024).toFixed(1) + " KB";
}

export function warnLargeDbFile(file) {
  alert(`"${file.name}" is ${formatFileSize(file.size)}. Maximum is 2 MB.\n\nPlease compress it first before uploading.`);
}
