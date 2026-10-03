// Helpers for list bulk actions: run one request per selected row and report
// how many failed (the admin APIs are per-record).

/** PATCH `${endpoint}/${id}` with `body` for each row. Returns failures. */
export async function patchEach<T extends { _id: string }>(
  endpoint: string,
  rows: T[],
  body: Record<string, unknown>,
  onSuccess: (row: T) => void,
): Promise<number> {
  const results = await Promise.all(
    rows.map(async (row) => {
      const res = await fetch(`${endpoint}/${row._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).catch(() => null);
      if (res?.ok) onSuccess(row);
      return res?.ok ?? false;
    }),
  );
  return results.filter((ok) => !ok).length;
}

/** Delete each row with `remove` (from useAdminRecords). Returns failures. */
export async function deleteEach<T extends { _id: string }>(
  rows: T[],
  remove: (id: string) => Promise<boolean>,
): Promise<number> {
  const results = await Promise.all(rows.map((r) => remove(r._id)));
  return results.filter((ok) => !ok).length;
}

/** "Deleted 3 messages" / "2 of 3 failed to delete" */
export function bulkResultMessage(
  done: string,
  noun: string,
  total: number,
  failed: number,
): { text: string; ok: boolean } {
  if (failed) return { text: `${failed} of ${total} failed`, ok: false };
  return { text: `${done} ${total} ${noun}${total > 1 ? "s" : ""}`, ok: true };
}
