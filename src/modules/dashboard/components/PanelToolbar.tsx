// Row above a panel's content: record summary on the left, actions (Refresh,
// plus optional extra buttons like "New Job") on the right.
export function PanelToolbar({
  summary,
  refreshing,
  onRefresh,
  children,
}: {
  summary: string;
  refreshing: boolean;
  onRefresh: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 mb-4">
      <p className="text-sm text-gray-500">{summary}</p>
      <div className="flex items-center gap-2">
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition px-3 py-1.5 rounded-lg hover:bg-white disabled:opacity-50"
        >
          <svg
            className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>
        {children}
      </div>
    </div>
  );
}
