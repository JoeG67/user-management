"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface EditUserProps {
  user: any;
  onClose: () => void;
}

export default function EditUser({ user, onClose }: EditUserProps) {
  const [form, setForm] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    role: user.role || "",
    status: user.status || "",
    avatar: user.avatar || "",
    bio: user.bio || "",
  });

  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (data: typeof form) => updateUser(user.id, data),
    onSuccess: () => {
      toast.success("User updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onClose();
    },
    onError: () => toast.error("Failed to update user."),
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
    updateMutation.mutate(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          placeholder="Write a short bio..."
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={updateMutation.isPending}>
          {updateMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Update"
          )}
        </Button>
      </div>
    </form>
  );
}
