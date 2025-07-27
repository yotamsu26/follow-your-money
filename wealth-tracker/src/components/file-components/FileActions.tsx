interface FileActionsProps {
  onDownload: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function FileActions({
  onDownload,
  onEdit,
  onDelete,
}: FileActionsProps) {
  return (
    <div className="flex space-x-1 ml-2">
      <button
        onClick={onDownload}
        className="text-blue-600 hover:text-blue-800 px-1"
        title="Download"
      >
        ↓
      </button>
      <button
        onClick={onEdit}
        className="text-green-600 hover:text-green-800 px-1"
        title="Rename"
      >
        ✎
      </button>
      <button
        onClick={onDelete}
        className="text-red-600 hover:text-red-800 px-1"
        title="Delete"
      >
        ×
      </button>
    </div>
  );
}
