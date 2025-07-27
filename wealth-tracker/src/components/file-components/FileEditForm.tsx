import { useState } from "react";
import { Button } from "../basic-components/Button";
import { Input } from "../basic-components/Input";

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
      <Input
        type="text"
        value={newFileName}
        onChange={(e) => setNewFileName(e.target.value)}
        inputSize="sm"
        className="text-xs flex-1"
        onKeyDown={handleKeyDown}
        autoFocus
      />
      <Button
        onClick={handleSave}
        variant="outline"
        size="sm"
        className="text-green-600 hover:text-green-800 border-green-300 hover:bg-green-50"
        title="Save"
      >
        ✓
      </Button>
      <Button
        onClick={onCancel}
        variant="outline"
        size="sm"
        className="text-red-600 hover:text-red-800 border-red-300 hover:bg-red-50"
        title="Cancel"
      >
        ✕
      </Button>
    </div>
  );
}
