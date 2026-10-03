import Link from "next/link";
import { PageHeader } from "@/modules/dashboard/components/PageHeader";
import { requirePagePermission } from "@/modules/auth/server/session";
import { listOwnDemos } from "@/modules/demo-bookings/server/student";
import { isUpcomingDemo } from "@/modules/demo-bookings/schedule";
import { StudentDemoCard } from "@/modules/demo-bookings/components/StudentDemoCard";

// The logged-in student's demo bookings (linked by an admin) — server-rendered
export default async function MyDemoPage() {
  const user = await requirePagePermission("demos:read:own");
  const demos = await listOwnDemos(user.id);

  const upcoming = demos.filter((d) => isUpcomingDemo(d));
  const past = demos.filter((d) => !isUpcomingDemo(d)).reverse();

  if (demos.length === 0) {
    return (
      <>
        <PageHeader title="My Demo" />
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
          <p className="font-medium text-gray-700">
            No demo linked to your account yet
          </p>
          <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
            Already booked a demo? Our team will link it to your account and
            you&apos;ll see the time and your teacher here. Haven&apos;t booked
            one yet?
          </p>
          <Link
            href="/demo"
            className="inline-block mt-5 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition"
          >
            Book a free demo
          </Link>
        </div>
      </>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader title="My Demo" />
      <section>
        <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">
          Upcoming ({upcoming.length})
        </h3>
        {upcoming.length === 0 ? (
          <p className="text-sm text-gray-400">
            No upcoming demos.{" "}
            <Link
              href="/demo"
              className="text-primary font-semibold hover:underline"
            >
              Book another
            </Link>
          </p>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {upcoming.map((d) => (
              <StudentDemoCard key={d.id} demo={d} upcoming />
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
              <StudentDemoCard key={d.id} demo={d} upcoming={false} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
