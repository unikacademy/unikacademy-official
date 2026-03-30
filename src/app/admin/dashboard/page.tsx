'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// ─── Types ───────────────────────────────────────────────────────────────────

type ContactStatus = 'not_read' | 'read' | 'replied';
type AppStatus = 'not_read' | 'read' | 'shortlisted' | 'rejected';
type ActiveSection = 'contacts' | 'demo-bookings' | 'applications';

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: ContactStatus;
  createdAt: string;
}

interface DemoBooking {
  _id: string;
  name: string;
  email?: string;
  phone: string;
  course: string;
  message?: string;
  status: ContactStatus;
  createdAt: string;
}

interface Application {
  _id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  message?: string;
  status: AppStatus;
  createdAt: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

const CONTACT_STATUSES: { value: ContactStatus; label: string; color: string }[] = [
  { value: 'not_read', label: 'Not Read', color: 'text-blue-500' },
  { value: 'read',     label: 'Read',     color: 'text-gray-400' },
  { value: 'replied',  label: 'Replied',  color: 'text-green-500' },
];

const APP_STATUSES: { value: AppStatus; label: string; color: string }[] = [
  { value: 'not_read',    label: 'Not Read',    color: 'text-blue-500' },
  { value: 'read',        label: 'Read',        color: 'text-gray-400' },
  { value: 'shortlisted', label: 'Shortlisted', color: 'text-purple-500' },
  { value: 'rejected',    label: 'Rejected',    color: 'text-red-500' },
];

const STATUS_STYLE: Record<string, string> = {
  not_read:    'bg-blue-50 text-blue-700',
  read:        'bg-gray-100 text-gray-600',
  replied:     'bg-green-50 text-green-700',
  shortlisted: 'bg-purple-50 text-purple-700',
  rejected:    'bg-red-50 text-red-600',
};

const STATUS_DOT: Record<string, string> = {
  not_read:    'bg-blue-500',
  read:        'bg-gray-400',
  replied:     'bg-green-500',
  shortlisted: 'bg-purple-500',
  rejected:    'bg-red-500',
};

const STATUS_LABEL: Record<string, string> = {
  not_read: 'Not Read', read: 'Read', replied: 'Replied',
  shortlisted: 'Shortlisted', rejected: 'Rejected',
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLE[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status]}`} />
      {STATUS_LABEL[status]}
    </span>
  );
}

// ─── Confirm Delete Modal ─────────────────────────────────────────────────────

function ConfirmModal({
  name,
  onConfirm,
  onCancel,
}: {
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900 text-center mb-1">Delete Record</h3>
        <p className="text-sm text-gray-500 text-center mb-6">
          Are you sure you want to delete <span className="font-semibold text-gray-700">{name}</span>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-sm font-medium text-white hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Action Dropdown ──────────────────────────────────────────────────────────

function ActionDropdown({
  id,
  name,
  currentStatus,
  statuses,
  endpoint,
  onStatusChange,
  onDelete,
}: {
  id: string;
  name: string;
  currentStatus: string;
  statuses: { value: string; label: string; color: string }[];
  endpoint: string;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string, name: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);

  // Close on outside click or scroll — use 'click' not 'mousedown'
  // so menu item onClick fires before the close handler.
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    document.addEventListener('click', close);
    document.addEventListener('scroll', close, true);
    return () => {
      document.removeEventListener('click', close);
      document.removeEventListener('scroll', close, true);
    };
  }, [open]);

  const toggle = (e: React.MouseEvent) => {
    // Stop this click from immediately triggering the document close listener
    e.stopPropagation();
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 6, left: rect.right - 176 });
    }
    setOpen((o) => !o);
  };

  const handleStatus = async (e: React.MouseEvent, status: string) => {
    e.stopPropagation(); // prevent document close from stealing this click
    setOpen(false);
    setLoading(status);
    try {
      const res = await fetch(`${endpoint}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) onStatusChange(id, status);
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(false);
    onDelete(id, name);
  };

  return (
    <>
      <button
        ref={btnRef}
        onClick={toggle}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition cursor-pointer"
      >
        {loading ? (
          <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : 'Actions'}
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          style={{ position: 'fixed', top: menuPos.top, left: menuPos.left, zIndex: 9999 }}
          className="w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1"
        >
          <p className="px-3 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Set Status</p>
          {statuses.map((s) => {
            const isActive = currentStatus === s.value;
            return (
              <button
                key={s.value}
                onClick={(e) => handleStatus(e, s.value)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-gray-50 transition cursor-pointer ${
                  isActive ? 'font-semibold text-primary' : 'text-gray-700'
                }`}
              >
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${s.color.replace('text-', 'bg-')}`} />
                {s.label}
                {isActive && (
                  <svg className="w-3.5 h-3.5 ml-auto text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
          <div className="border-t border-gray-100 my-1" />
          <button
            onClick={handleDelete}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      )}
    </>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
      <div className="w-12 h-12 mb-3 opacity-40">{icon}</div>
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [demoBookings, setDemoBookings] = useState<DemoBooking[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<ActiveSection>('contacts');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string; type: ActiveSection } | null>(null);

  useEffect(() => {
    if (!localStorage.getItem('adminAuth')) {
      router.push('/admin/login');
      return;
    }
    fetchAll();
  }, [router]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [cRes, dRes, aRes] = await Promise.all([
        fetch('/api/admin/contacts'),
        fetch('/api/admin/demo-bookings'),
        fetch('/api/admin/applications'),
      ]);
      if (cRes.ok) setContacts(await cRes.json());
      if (dRes.ok) setDemoBookings(await dRes.json());
      if (aRes.ok) setApplications(await aRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => { localStorage.removeItem('adminAuth'); router.push('/admin/login'); };

  const updateStatus = useCallback((type: ActiveSection, id: string, status: string) => {
    if (type === 'contacts')      setContacts((p) => p.map((r) => r._id === id ? { ...r, status: status as ContactStatus } : r));
    if (type === 'demo-bookings') setDemoBookings((p) => p.map((r) => r._id === id ? { ...r, status: status as ContactStatus } : r));
    if (type === 'applications')  setApplications((p) => p.map((r) => r._id === id ? { ...r, status: status as AppStatus } : r));
  }, []);

  const requestDelete = (id: string, name: string, type: ActiveSection) => setDeleteTarget({ id, name, type });

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { id, type } = deleteTarget;
    const endpointMap: Record<ActiveSection, string> = {
      contacts: '/api/admin/contacts',
      'demo-bookings': '/api/admin/demo-bookings',
      applications: '/api/admin/applications',
    };
    const res = await fetch(`${endpointMap[type]}/${id}`, { method: 'DELETE' });
    if (res.ok) {
      if (type === 'contacts')      setContacts((p) => p.filter((r) => r._id !== id));
      if (type === 'demo-bookings') setDemoBookings((p) => p.filter((r) => r._id !== id));
      if (type === 'applications')  setApplications((p) => p.filter((r) => r._id !== id));
    }
    setDeleteTarget(null);
  };

  const navItems = [
    {
      key: 'contacts' as ActiveSection,
      label: 'Contact Messages',
      count: contacts.length,
      pending: contacts.filter((c) => c.status === 'not_read').length,
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    },
    {
      key: 'demo-bookings' as ActiveSection,
      label: 'Demo Bookings',
      count: demoBookings.length,
      pending: demoBookings.filter((d) => d.status === 'not_read').length,
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    },
    {
      key: 'applications' as ActiveSection,
      label: 'Job Applications',
      count: applications.length,
      pending: applications.filter((a) => a.status === 'not_read').length,
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    },
  ];

  const currentNav = navItems.find((n) => n.key === activeSection)!;

  const Sidebar = () => (
    <aside className="flex flex-col h-full bg-primary">
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-primary font-black text-lg">U</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">UNIK Academy</p>
            <p className="text-white/50 text-xs">Admin Panel</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="text-white/30 text-xs font-semibold uppercase tracking-wider px-3 mb-3">Management</p>
        {navItems.map((item) => {
          const isActive = activeSection === item.key;
          return (
            <button
              key={item.key}
              onClick={() => { setActiveSection(item.key); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive ? 'bg-white/10 text-white border-l-2 border-accent' : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className={isActive ? 'text-accent' : ''}>{item.icon}</span>
              <span className="flex-1 text-left">{item.label}</span>
              <div className="flex items-center gap-1">
                {item.pending > 0 && (
                  <span className="text-xs px-1.5 py-0.5 rounded-full font-semibold bg-blue-500 text-white">{item.pending}</span>
                )}
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${isActive ? 'bg-accent text-primary' : 'bg-white/10 text-white/60'}`}>
                  {item.count}
                </span>
              </div>
            </button>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <Link href="/" target="_blank" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:bg-white/5 hover:text-white transition-all">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          View Website
        </Link>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Logout
        </button>
      </div>
    </aside>
  );

  const thClass = 'px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider';
  const tdClass = 'px-5 py-4';

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Delete confirmation modal */}
      {deleteTarget && (
        <ConfirmModal
          name={deleteTarget.name}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:flex-shrink-0"><Sidebar /></div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 z-50"><Sidebar /></div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition" onClick={() => setSidebarOpen(true)}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div>
              <h1 className="text-lg font-bold text-primary">{currentNav.label}</h1>
              <p className="text-xs text-gray-500">{currentNav.count} total{currentNav.pending > 0 && ` · ${currentNav.pending} unread`}</p>
            </div>
          </div>
          <button onClick={fetchAll} className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition px-3 py-1.5 rounded-lg hover:bg-gray-100">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Refresh
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <svg className="animate-spin w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          ) : activeSection === 'contacts' ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {contacts.length === 0 ? (
                <EmptyState label="No contact messages yet" icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>} />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="bg-gray-50 border-b border-gray-100">
                      <th className={thClass}>Name</th><th className={thClass}>Email</th><th className={thClass}>Phone</th>
                      <th className={thClass}>Message</th><th className={thClass}>Status</th><th className={thClass}>Date</th><th className={thClass}>Actions</th>
                    </tr></thead>
                    <tbody className="divide-y divide-gray-50">
                      {contacts.map((c) => (
                        <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                          <td className={`${tdClass} font-medium text-gray-900 whitespace-nowrap`}>{c.name}</td>
                          <td className={tdClass}><a href={`mailto:${c.email}`} className="text-accent hover:underline">{c.email}</a></td>
                          <td className={`${tdClass} text-gray-600 whitespace-nowrap`}>{c.phone || '—'}</td>
                          <td className={`${tdClass} text-gray-600 max-w-xs truncate`}>{c.message}</td>
                          <td className={tdClass}><StatusBadge status={c.status} /></td>
                          <td className={`${tdClass} text-gray-500 whitespace-nowrap`}>{formatDate(c.createdAt)}</td>
                          <td className={tdClass}>
                            <ActionDropdown
                              id={c._id} name={c.name} currentStatus={c.status}
                              statuses={CONTACT_STATUSES} endpoint="/api/admin/contacts"
                              onStatusChange={(id, s) => updateStatus('contacts', id, s)}
                              onDelete={(id, name) => requestDelete(id, name, 'contacts')}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : activeSection === 'demo-bookings' ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {demoBookings.length === 0 ? (
                <EmptyState label="No demo bookings yet" icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="bg-gray-50 border-b border-gray-100">
                      <th className={thClass}>Name</th><th className={thClass}>Phone</th><th className={thClass}>Email</th>
                      <th className={thClass}>Course</th><th className={thClass}>Message</th><th className={thClass}>Status</th>
                      <th className={thClass}>Date</th><th className={thClass}>Actions</th>
                    </tr></thead>
                    <tbody className="divide-y divide-gray-50">
                      {demoBookings.map((d) => (
                        <tr key={d._id} className="hover:bg-gray-50 transition-colors">
                          <td className={`${tdClass} font-medium text-gray-900 whitespace-nowrap`}>{d.name}</td>
                          <td className={`${tdClass} text-gray-600 whitespace-nowrap`}>{d.phone}</td>
                          <td className={tdClass}>{d.email ? <a href={`mailto:${d.email}`} className="text-accent hover:underline">{d.email}</a> : '—'}</td>
                          <td className={tdClass}>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary whitespace-nowrap">{d.course}</span>
                          </td>
                          <td className={`${tdClass} text-gray-600 max-w-xs truncate`}>{d.message || '—'}</td>
                          <td className={tdClass}><StatusBadge status={d.status} /></td>
                          <td className={`${tdClass} text-gray-500 whitespace-nowrap`}>{formatDate(d.createdAt)}</td>
                          <td className={tdClass}>
                            <ActionDropdown
                              id={d._id} name={d.name} currentStatus={d.status}
                              statuses={CONTACT_STATUSES} endpoint="/api/admin/demo-bookings"
                              onStatusChange={(id, s) => updateStatus('demo-bookings', id, s)}
                              onDelete={(id, name) => requestDelete(id, name, 'demo-bookings')}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {applications.length === 0 ? (
                <EmptyState label="No job applications yet" icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>} />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="bg-gray-50 border-b border-gray-100">
                      <th className={thClass}>Name</th><th className={thClass}>Email</th><th className={thClass}>Phone</th>
                      <th className={thClass}>Position</th><th className={thClass}>Message</th><th className={thClass}>Status</th>
                      <th className={thClass}>Date</th><th className={thClass}>Actions</th>
                    </tr></thead>
                    <tbody className="divide-y divide-gray-50">
                      {applications.map((a) => (
                        <tr key={a._id} className="hover:bg-gray-50 transition-colors">
                          <td className={`${tdClass} font-medium text-gray-900 whitespace-nowrap`}>{a.name}</td>
                          <td className={tdClass}><a href={`mailto:${a.email}`} className="text-accent hover:underline">{a.email}</a></td>
                          <td className={`${tdClass} text-gray-600 whitespace-nowrap`}>{a.phone}</td>
                          <td className={tdClass}>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">{a.position}</span>
                          </td>
                          <td className={`${tdClass} text-gray-600 max-w-xs truncate`}>{a.message || '—'}</td>
                          <td className={tdClass}><StatusBadge status={a.status} /></td>
                          <td className={`${tdClass} text-gray-500 whitespace-nowrap`}>{formatDate(a.createdAt)}</td>
                          <td className={tdClass}>
                            <ActionDropdown
                              id={a._id} name={a.name} currentStatus={a.status}
                              statuses={APP_STATUSES} endpoint="/api/admin/applications"
                              onStatusChange={(id, s) => updateStatus('applications', id, s)}
                              onDelete={(id, name) => requestDelete(id, name, 'applications')}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
