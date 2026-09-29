import type { RoleId } from "@/modules/auth/permissions";

export interface UserWithRoles {
  _id: string;
  email: string | null;
  fullName: string | null;
  avatarUrl: string | null;
  roles: RoleId[];
  createdAt: string;
}
