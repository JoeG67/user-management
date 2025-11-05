import axios from "axios";
import { User } from "@/types/users";

export const api = axios.create({
  baseURL: "https://68ff8c08e02b16d1753e6ed3.mockapi.io/maia/api/v1",
  headers: { "Content-Type": "application/json" },
});

// ✅ READ (All)
export const getUsers = async (): Promise<User[]> => {
  const { data } = await api.get<User[]>("/user");
  return data;
};

// ✅ READ (Single)
export const getUser = async (id: string): Promise<User> => {
  const { data } = await api.get<User>(`/user/${id}`);
  return data;
};

// ✅ CREATE
export const createUser = async (
  user: Omit<User, "id" | "createdAt">
): Promise<User> => {
  const { data } = await api.post<User>("/user", user);
  return data;
};

// ✅ UPDATE
export const updateUser = async (
  id: string,
  user: Partial<User>
): Promise<User> => {
  const { data } = await api.put<User>(`/user/${id}`, user);
  return data;
};

// ✅ DELETE
export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/user/${id}`);
};
