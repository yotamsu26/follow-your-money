import { useState } from "react";

interface FileEditFormProps {
  fileName: string;
  onSave: (newName: string) => void;
  onCancel: () => void;
}

export function FileEditForm({
  fileName,
  onSave,
  onCancel,
}: FileEditFormProps) {
  const [newFileName, setNewFileName] = useState(fileName);

  function handleSave() {
    if (!newFileName.trim()) {
      alert("Please enter a valid file name");
      return;
    }
    onSave(newFileName.trim());
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      handleSave();
    }
    if (e.key === "Escape") {
      onCancel();
    }
  }

  return (
    <div className="flex items-center space-x-1">
      <input
        type="text"
        value={newFileName}
        onChange={(e) => setNewFileName(e.target.value)}
        className="text-xs border rounded px-1 flex-1"
        onKeyDown={handleKeyDown}
        autoFocus
      />
      <button
        onClick={handleSave}
        className="text-green-600 hover:text-green-800 px-1"
        title="Save"
      >
        ✓
      </button>
      <button
        onClick={onCancel}
        className="text-red-600 hover:text-red-800 px-1"
        title="Cancel"
      >
        ✕
      </button>
    </div>
  );
}
