import type { SortDir } from "@/modules/dashboard/types";

export function SortableTh({
  label,
  sortKey,
  currentSortKey,
  currentSortDir,
  onSort,
  className = "",
}: {
  label: string;
  sortKey: string;
  currentSortKey: string;
  currentSortDir: SortDir;
  onSort: (key: string) => void;
  className?: string;
}) {
  const isActive = currentSortKey === sortKey;
  return (
    <th
      onClick={() => onSort(sortKey)}
      className={`px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none group whitespace-nowrap ${className}`}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <span
          className={`transition-opacity ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-40"}`}
        >
          {isActive && currentSortDir === "asc" ? (
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
                d="M5 15l7-7 7 7"
              />
            </svg>
          ) : (
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
          )}
        </span>
      </span>
    </th>
  );
}
