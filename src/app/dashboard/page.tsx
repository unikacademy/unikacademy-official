import Link from "next/link";
import { ROLE_LABELS, can } from "@/modules/auth/permissions";
import { requirePageUser } from "@/modules/auth/server/session";
import { listAssignedDemos } from "@/modules/demo-bookings/server/teacher";
import { listOwnDemos } from "@/modules/demo-bookings/server/student";
import { isUpcomingDemo } from "@/modules/demo-bookings/schedule";
import { NextDemoCard } from "@/modules/demo-bookings/components/NextDemoCard";
import { NAV_ITEMS } from "@/modules/dashboard/nav";
import { NavIcon } from "@/modules/dashboard/icons";
import {
  getOverviewCards,
  type OverviewCard,
} from "@/modules/dashboard/server/overview";

function StatCardLink({ card }: { card: OverviewCard }) {
  const icon = NAV_ITEMS.find((item) => item.href === card.href)?.icon;
  const hl = card.highlight;
  const hlActive = hl?.value != null && hl.value > 0;
  const hlClass =
    hl?.label === "unread"
      ? "bg-blue-50 text-blue-700"
      : "bg-green-50 text-green-700";

  return (
    <Link
      href={card.href}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4 hover:border-primary/30 hover:shadow-md transition"
    >
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
          {icon && <NavIcon name={icon} />}
        </div>
        <svg
          className="w-4 h-4 text-gray-300 group-hover:text-primary transition"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
      <div>
        <p className="text-2xl font-bold text-primary leading-tight">
          {card.total ?? "—"}
        </p>
        <p className="text-xs text-gray-500 font-medium">{card.label}</p>
      </div>
      {hl && (
        <span
          className={`self-start px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            hlActive ? hlClass : "bg-gray-100 text-gray-500"
          }`}
        >
          {hl.value ?? "—"} {hl.label}
        </span>
      )}
    </Link>
  );
}

export default async function DashboardOverviewPage() {
  const user = await requirePageUser();
  const canTeach = can(user, "demos:read:assigned");
  const canStudy = can(user, "demos:read:own");
  const [cards, teachingDemos, ownDemos] = await Promise.all([
    getOverviewCards(user),
    canTeach ? listAssignedDemos(user.id) : [],
    canStudy ? listOwnDemos(user.id) : [],
  ]);
  const name = user.fullName ?? user.email ?? "there";

  // Lists are sorted soonest first, so the first upcoming one is "next"
  const upcomingTeaching = teachingDemos.filter((d) => isUpcomingDemo(d));
  const upcomingOwn = ownDemos.filter((d) => isUpcomingDemo(d));
  const nextTeaching = upcomingTeaching[0];
  const nextOwn = upcomingOwn[0];
  const hasPersonal = canTeach || canStudy;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-4">
        {user.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.avatarUrl}
            alt={name}
            className="w-14 h-14 rounded-full object-cover"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-accent font-bold text-xl">
              {name[0]?.toUpperCase()}
            </span>
          </div>
        )}
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-gray-900 truncate">
            Welcome, {name}
          </h2>
          <p className="text-sm text-gray-500 truncate">
            {user.email}
            {user.roles.length > 0 &&
              ` · ${user.roles.map((r) => ROLE_LABELS[r]).join(", ")}`}
          </p>
        </div>
      </div>

      {hasPersonal && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {canStudy && (
            <NextDemoCard
              title="Your next demo"
              href="/dashboard/my-demo"
              linkLabel="My Demo"
              upcomingCount={upcomingOwn.length}
              next={
                nextOwn && {
                  scheduledAt: nextOwn.scheduledAt,
                  demoStatus: nextOwn.demoStatus,
                  course: nextOwn.course,
                  meetLink: nextOwn.meetLink,
                  withLabel: nextOwn.teacher?.fullName ?? null,
                }
              }
              emptyText="No upcoming demo linked to your account yet."
              emptyAction={{ href: "/demo", label: "Book a free demo" }}
            />
          )}
          {canTeach && (
            <NextDemoCard
              title="Your next demo class"
              href="/dashboard/my-demo-classes"
              linkLabel="My Demo Classes"
              upcomingCount={upcomingTeaching.length}
              next={
                nextTeaching && {
                  scheduledAt: nextTeaching.scheduledAt,
                  demoStatus: nextTeaching.demoStatus,
                  course: nextTeaching.course,
                  meetLink: nextTeaching.meetLink,
                  withLabel:
                    nextTeaching.student?.fullName || nextTeaching.bookedName,
                }
              }
              emptyText="No upcoming demo classes assigned to you."
            />
          )}
        </div>
      )}

      {cards.length > 0 ? (
        <section>
          <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">
            At a glance
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {cards.map((card) => (
              <StatCardLink key={card.href} card={card} />
            ))}
          </div>
        </section>
      ) : hasPersonal ? null : (
        // Nothing to show yet (e.g. a role with no pages)
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center text-gray-400">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <p className="font-medium text-gray-500">
            Your classes will appear here
          </p>
          <p className="text-sm mt-1">Check back soon!</p>
        </div>
      )}
    </div>
  );
}
