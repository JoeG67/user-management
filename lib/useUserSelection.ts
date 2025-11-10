import { useState } from "react";

export function useUserSelection(userIds: string[]) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const toggleRow = (id: string) =>
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const toggleSelectAll = () => {
    if (selectedRows.length === userIds.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(userIds);
    }
  };

  const clearSelection = () => setSelectedRows([]);

  return { selectedRows, toggleRow, toggleSelectAll, clearSelection, setSelectedRows };
}
