import type { BookingType } from "@/modules/demo-bookings/types";

export function BookingTypeBadge({ type }: { type?: BookingType }) {
  const isCorporate = type === "corporate";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
        isCorporate
          ? "bg-[#c0a84f]/15 text-[#8a742f]"
          : "bg-gray-100 text-gray-500"
      }`}
    >
      {isCorporate ? "Corporate" : "Individual"}
    </span>
  );
}
