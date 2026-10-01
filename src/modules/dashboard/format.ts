export function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ── IST (Asia/Kolkata) date-times ───────────────────────────────────────────
// Demo times are stored as timestamptz and always shown/entered in IST,
// regardless of the viewer's own time zone. IST has no daylight saving, so a
// fixed +05:30 offset is exact.

const IST = "Asia/Kolkata";
const IST_OFFSET = "+05:30";

/** e.g. "Mon, 06 Oct 2026, 5:30 pm IST" */
export function formatDateTimeIST(iso: string) {
  return `${new Date(iso).toLocaleString("en-IN", {
    timeZone: IST,
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })} IST`;
}

/** ISO timestamp → value for <input type="datetime-local"> in IST. */
export function toISTInputValue(iso: string | null): string {
  if (!iso) return "";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: IST,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(iso));
  const get = (type: string) => parts.find((p) => p.type === type)?.value;
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

/** <input type="datetime-local"> value (read as IST) → ISO timestamp. */
export function fromISTInputValue(value: string): string | null {
  if (!value) return null;
  const date = new Date(`${value}:00${IST_OFFSET}`);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}
