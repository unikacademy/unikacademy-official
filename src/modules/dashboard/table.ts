// Shared table cell/row classes for dashboard data tables.

export const thClass =
  "px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap";

export const tdClass = "px-5 py-4";

// Unread rows get a blue left border + tint
export const rowClass = (status: string) =>
  `transition-colors cursor-pointer ${
    status === "not_read"
      ? "border-l-2 border-l-blue-400 bg-blue-50/30 hover:bg-blue-50/50"
      : "border-l-2 border-l-transparent hover:bg-gray-50"
  }`;
