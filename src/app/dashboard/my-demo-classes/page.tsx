import { requirePagePermission } from "@/modules/auth/server/session";
import { listAssignedDemos } from "@/modules/demo-bookings/server/teacher";
import { isUpcomingDemo } from "@/modules/demo-bookings/schedule";
import { TeacherDemoCard } from "@/modules/demo-bookings/components/TeacherDemoCard";

// Demos an admin assigned to the logged-in teacher (server-rendered — no API)
export default async function MyDemoClassesPage() {
  const user = await requirePagePermission("demos:read:assigned");
  const demos = await listAssignedDemos(user.id);

  const upcoming = demos.filter((d) => isUpcomingDemo(d));
  // Most recent first for the past list
  const past = demos.filter((d) => !isUpcomingDemo(d)).reverse();

  if (demos.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center text-gray-400">
        <p className="font-medium text-gray-500">
          No demo classes assigned yet
        </p>
        <p className="text-sm mt-1">
          When an admin assigns you a demo, it will appear here with the time
          and student details.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">
          Upcoming ({upcoming.length})
        </h3>
        {upcoming.length === 0 ? (
          <p className="text-sm text-gray-400">No upcoming demos.</p>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {upcoming.map((d) => (
              <TeacherDemoCard key={d.id} demo={d} upcoming />
            ))}
          </div>
        )}
      </section>

      {past.length > 0 && (
        <section>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
            Past ({past.length})
          </h3>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 opacity-80">
            {past.map((d) => (
              <TeacherDemoCard key={d.id} demo={d} upcoming={false} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
