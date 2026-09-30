"use client";

import { useEffect, useRef, useState } from "react";

export function ActionDropdown({
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

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    document.addEventListener("click", close);
    document.addEventListener("scroll", close, true);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("scroll", close, true);
    };
  }, [open]);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 6, left: rect.right - 176 });
    }
    setOpen((o) => !o);
  };

  const handleStatus = async (e: React.MouseEvent, status: string) => {
    e.stopPropagation();
    setOpen(false);
    setLoading(status);
    try {
      const res = await fetch(`${endpoint}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
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
          <svg
            className="animate-spin w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : (
          "Actions"
        )}
        <svg
          className="w-3 h-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            top: menuPos.top,
            left: menuPos.left,
            zIndex: 9999,
          }}
          className="w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1"
        >
          <p className="px-3 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            Set Status
          </p>
          {statuses.map((s) => {
            const isActive = currentStatus === s.value;
            return (
              <button
                key={s.value}
                onClick={(e) => handleStatus(e, s.value)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-gray-50 transition cursor-pointer ${
                  isActive ? "font-semibold text-primary" : "text-gray-700"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${s.color.replace("text-", "bg-")}`}
                />
                {s.label}
                {isActive && (
                  <svg
                    className="w-3.5 h-3.5 ml-auto text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
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
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete
          </button>
        </div>
      )}
    </>
  );
}
