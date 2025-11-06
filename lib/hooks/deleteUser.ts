"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "@/lib/api";
import { toast } from "sonner";

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const confirmDelete = window.confirm("Are you sure you want to delete this user?");
      if (!confirmDelete) {
        throw new Error("User deletion cancelled");
      }

      return deleteUser(id);
    },
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      if (error.message === "User deletion cancelled") {
        toast.info("User deletion cancelled");
      } else {
        toast.error(`Failed to delete user: ${error.message}`);
      }
    },
  });
}
