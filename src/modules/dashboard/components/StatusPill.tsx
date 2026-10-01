import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ERPNext-style status indicator: light tinted background, coloured text.
export type PillTone =
  "gray" | "blue" | "green" | "red" | "orange" | "yellow" | "purple" | "indigo";

const TONE_CLASS: Record<PillTone, string> = {
  gray: "bg-gray-100 text-gray-600",
  blue: "bg-blue-50 text-blue-700",
  green: "bg-green-50 text-green-700",
  red: "bg-red-50 text-red-600",
  orange: "bg-orange-50 text-orange-700",
  yellow: "bg-yellow-50 text-yellow-700",
  purple: "bg-purple-50 text-purple-700",
  indigo: "bg-indigo-50 text-indigo-700",
};

export function StatusPill({
  tone,
  children,
  className,
}: {
  tone: PillTone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "h-5 rounded-full px-2 text-[11px] font-medium",
        TONE_CLASS[tone],
        className,
      )}
    >
      {children}
    </Badge>
  );
}
