export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "Admin" | "User" | "Guest";
  status: "Active" | "Inactive";
  createdAt: string;
  bio: string;
  avatar?: string;
}
