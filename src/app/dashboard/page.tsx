import { requirePageUser } from "@/modules/auth/server/session";

// Placeholder — becomes the role-aware overview in RBAC phase 2, step 4.
export default async function DashboardOverviewPage() {
  const user = await requirePageUser();
  const name = user.fullName ?? user.email ?? "there";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900">Welcome, {name}</h2>
      <p className="text-sm text-gray-500 mt-1">
        Use the menu to open the sections available to you.
      </p>
    </div>
  );
}
