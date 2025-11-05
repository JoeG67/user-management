"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "@/lib/api";
import { User } from "@/types/users";

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (user: Omit<User, "id" | "createdAt">) => createUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
