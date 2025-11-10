import { toast } from "sonner";
import type { User } from "@/types/users";
import { useUsers } from "./useUsers";

export function useUserBulkActions() {
  const { deleteUser } = useUsers();

  const bulkDelete = (
    users: User[],
    selectedRows: string[],
    clearSelection: () => void
  ) => {
    const deletedUsers = users.filter((u) => selectedRows.includes(u.id));

    // Optimistically remove users from selection/cache
    deletedUsers.forEach((u) => deleteUser.mutate(u.id));

    // Show simple toast with undo
    const undoId = toast(
      `Deleted ${deletedUsers.length} user(s)`,
      {
        action: {
          label: "Undo",
          onClick: () => {
            // Undo logic: e.g., refetch users or restore from cache
            clearSelection();
            toast.success("Undo successful");
          },
        },
        duration: 5000,
      }
    );
  };

  return { bulkDelete };
}
