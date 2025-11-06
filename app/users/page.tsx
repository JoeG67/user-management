"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/lib/api";
import AddUser from "@/components/addUser";
import EditUser from "@/components/editUser";
import {Dialog, DialogTrigger, DialogTitle, DialogContent} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, AlertTriangle, Trash2, Edit2 } from "lucide-react";
import { useDeleteUser } from "@/lib/hooks/deleteUser";
import Image from "next/image";
import { User } from "@/types/users";

export default function UsersPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data: users,isLoading, isError, error} = useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const deleteUserMutation = useDeleteUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-destructive">
        <AlertTriangle className="w-6 h-6 mb-2" />
        <p className="text-sm font-medium">
          Failed to load users: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          User Management
        </h1>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogTitle>Add User</DialogTitle>
            <AddUser onClose={() => setAddOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr className="text-left">
              <th className="px-4 py-3 font-medium">Avatar</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium">Bio</th>
              <th className="px-4 py-3 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr
                key={user.id}
                className="border-b last:border-none hover:bg-muted/30 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center">
                    <Image
                      width={40}
                      height={40}
                      src={
                        user.avatar && user.avatar.startsWith("http")
                          ? user.avatar
                          : "/placeholder-avatar.png"
                      }
                      alt={user.name}
                      className="rounded-full object-cover w-10 h-10 border"
                    />
                  </div>
                </td>
                <td className="px-4 py-3 font-medium">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.phone || "-"}</td>
                <td className="px-4 py-3">{user.role || "-"}</td>
                <td className="px-4 py-3">{user.status || "-"}</td>
                <td className="px-4 py-3">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "-"}
                </td>
                <td className="px-4 py-3 max-w-xs truncate">
                  {user.bio || "-"}
                </td>
                <td className="px-4 py-3 flex justify-center gap-2">
                  <Dialog
                    open={editOpen && selectedUser?.id === user.id}
                    onOpenChange={(open) => {
                      setEditOpen(open);
                      if (!open) setSelectedUser(null);
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setSelectedUser(user)}
                        className="hover:bg-primary/10"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                      <DialogTitle>Edit User</DialogTitle>
                      {selectedUser && (
                        <EditUser
                          user={selectedUser}
                          onClose={() => setEditOpen(false)}
                        />
                      )}
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteUserMutation.mutate(user.id)}
                    disabled={deleteUserMutation.isPending}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    {deleteUserMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
