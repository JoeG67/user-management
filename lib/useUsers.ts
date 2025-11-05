"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { api } from "./api";
import { User } from "@/types/users";
export function useUsers() {
  const qc = useQueryClient();

  const usersQuery = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await api.get("/users");
      return res.data;
    },
  });

  const createUser = useMutation({
    mutationFn: async (data: Omit<User, "id" | "createdAt">) => {
      const res = await api.post("/users", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("User created");
      qc.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => toast.error("Failed to create user"),
  });

  const updateUser = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<User> }) => {
      const res = await api.put(`/users/${id}`, updates);
      return res.data;
    },
    onMutate: async ({ id, updates }) => {
      await qc.cancelQueries({ queryKey: ["users"] });
      const prev = qc.getQueryData<User[]>(["users"]);
      qc.setQueryData<User[]>(["users"], (old) =>
        old?.map((u) => (u.id === id ? { ...u, ...updates } : u))
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      qc.setQueryData(["users"], ctx?.prev);
      toast.error("Update failed — rolled back");
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });

  const deleteUser = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/users/${id}`);
      return res.data;
    },
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ["users"] });
      const prev = qc.getQueryData<User[]>(["users"]);
      qc.setQueryData<User[]>(["users"], (old) => old?.filter((u) => u.id !== id));
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      qc.setQueryData(["users"], ctx?.prev);
      toast.error("Delete failed — rolled back");
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });

  return { usersQuery, createUser, updateUser, deleteUser };
}
