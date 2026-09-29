import type { Metadata } from "next";
import { ROLE_LABELS } from "@/modules/auth/permissions";
import { requirePageUser } from "@/modules/auth/server/session";
import { DashboardShell } from "@/modules/dashboard/components/DashboardShell";
import { navItemsFor } from "@/modules/dashboard/nav";

export const metadata: Metadata = {
  title: "Dashboard | UNIK Academy",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requirePageUser();

  return (
    <DashboardShell
      user={{
        name: user.fullName ?? user.email ?? "User",
        email: user.email,
        avatarUrl: user.avatarUrl,
        roleLabels: user.roles.map((role) => ROLE_LABELS[role]),
      }}
      navItems={navItemsFor(user)}
    >
      {children}
    </DashboardShell>
  );
}
