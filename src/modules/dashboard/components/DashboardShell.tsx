"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { NavItem } from "@/modules/dashboard/nav";
import { NavIcon } from "@/modules/dashboard/icons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export type ShellUser = {
  name: string;
  email: string | null;
  avatarUrl: string | null;
  roleLabels: string[];
};

function isActive(pathname: string, href: string) {
  // Overview is only active on exactly /dashboard; sections also match subpaths
  return href === "/dashboard"
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}

function Sidebar({
  navItems,
  pathname,
  onNavigate,
  onLogout,
}: {
  navItems: NavItem[];
  pathname: string;
  onNavigate: () => void;
  onLogout: () => void;
}) {
  const groups = [...new Set(navItems.map((item) => item.group))];

  return (
    <aside className="flex flex-col h-full bg-primary">
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-primary font-black text-lg">U</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">
              UNIK Academy
            </p>
            <p className="text-white/50 text-xs">Dashboard</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {groups.map((group) => (
          <div key={group} className="space-y-1">
            <p className="text-white/30 text-xs font-semibold uppercase tracking-wider px-3 mb-3">
              {group}
            </p>
            {navItems
              .filter((item) => item.group === group)
              .map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? "bg-white/10 text-white border-l-2 border-accent"
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span className={active ? "text-accent" : ""}>
                      <NavIcon name={item.icon} />
                    </span>
                    <span className="flex-1 text-left">{item.label}</span>
                  </Link>
                );
              })}
          </div>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:bg-white/5 hover:text-white transition-all"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          View Website
        </Link>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}

export function DashboardShell({
  user,
  navItems,
  children,
}: {
  user: ShellUser;
  navItems: NavItem[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const current = navItems.find((item) => isActive(pathname, item.href));

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const sidebar = (
    <Sidebar
      navItems={navItems}
      pathname={pathname}
      onNavigate={() => setSidebarOpen(false)}
      onLogout={handleLogout}
    />
  );

  return (
    <div className="dashboard-theme flex h-screen overflow-hidden bg-gray-50">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:flex-shrink-0">
        {sidebar}
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-64 z-50">
            {sidebar}
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 h-12 px-4 sm:px-6 flex items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <Breadcrumb>
              <BreadcrumbList className="text-[13px]">
                <BreadcrumbItem>
                  <BreadcrumbLink render={<Link href="/dashboard" />}>
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {current && current.href !== "/dashboard" && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{current.label}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="hidden sm:block text-right">
              <p className="text-[13px] font-medium text-gray-800 leading-tight">
                {user.name}
              </p>
              <p className="text-[11px] text-gray-500">
                {user.roleLabels.join(" · ") || "No role"}
              </p>
            </div>
            {user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-accent font-bold text-xs">
                  {user.name[0]?.toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
