"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "@/lib/api";
import { User } from "@/types/users";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface AddUserProps {
  onClose: () => void;
}

export default function AddUser({ onClose }: AddUserProps) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<Omit<User, "id" | "createdAt">>({
    name: "",
    email: "",
    phone: "",
    role: "User",
    status: "Active",
    avatar: "",
    bio: "",
  });

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success("User created successfully!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onClose();
      setForm({
        name: "",
        email: "",
        phone: "",
        role: "User",
        status: "Active",
        avatar: "",
        bio: "",
      });
    },
    onError: () => toast.error("Failed to create user."),
  });

  const validateForm = () => {
    if (!form.name.trim()) {
      toast.error("Name is required.");
      return false;
    }
    if (!form.email.trim()) {
      toast.error("Email is required.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    if (form.phone && !/^[0-9\s+-]+$/.test(form.phone)) {
      toast.error("Phone number can only contain digits, spaces, +, or -.");
      return false;
    }
    if (!form.role.trim()) {
      toast.error("Role is required.");
      return false;
    }
    if (!form.status.trim()) {
      toast.error("Status is required.");
      return false;
    }
    if (form.avatar && !/^https?:\/\//i.test(form.avatar)) {
      toast.error("Avatar URL must start with http:// or https://");
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    createMutation.mutate(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle>Add New User</DialogTitle>
      </DialogHeader>

      <div>
        <Label>Name</Label>
        <Input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label>Email</Label>
        <Input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
      </div>
      <div>
        <Label>Phone</Label>
        <Input
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="Optional"
        />
      </div>
      <div>
        <Label>Role</Label>
        <Input
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          required
        />
      </div>
      <div>
        <Label>Status</Label>
        <Input
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          required
        />
      </div>
      <div>
        <Label>Avatar URL</Label>
        <Input
          type="url"
          value={form.avatar}
          onChange={(e) => setForm({ ...form, avatar: e.target.value })}
          placeholder="https://example.com/avatar.png"
        />
      </div>
      <div>
        <Label>Bio</Label>
        <Input
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          placeholder="Short bio"
          required
        />
      </div>

      <DialogFooter>
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Create"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
