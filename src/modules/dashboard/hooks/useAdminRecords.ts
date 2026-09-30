"use client";

import { useCallback, useEffect, useState } from "react";

type BaseRecord = { _id: string };

/**
 * Loads a list from an admin collection endpoint (e.g. /api/admin/contacts)
 * and exposes local-state helpers. Single-record calls go to `${endpoint}/${id}`.
 */
export function useAdminRecords<T extends BaseRecord>(
  endpoint: string,
  onError: (message: string) => void,
) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRows = useCallback(async () => {
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error(`GET ${endpoint} failed: ${res.status}`);
    return (await res.json()) as T[];
  }, [endpoint]);

  // Initial load
  useEffect(() => {
    let cancelled = false;
    fetchRows()
      .then((data) => {
        if (!cancelled) setRows(data);
      })
      .catch((e) => {
        console.error(e);
        if (!cancelled) onError("Failed to fetch data");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [fetchRows, onError]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      setRows(await fetchRows());
    } catch (e) {
      console.error(e);
      onError("Failed to fetch data");
    } finally {
      setRefreshing(false);
    }
  }, [fetchRows, onError]);

  /** Update one record in local state (after a successful PATCH). */
  const patchLocal = useCallback((id: string, changes: Partial<T>) => {
    setRows((prev) =>
      prev.map((r) => (r._id === id ? { ...r, ...changes } : r)),
    );
  }, []);

  /** DELETE a record on the server; removes it locally on success. */
  const remove = useCallback(
    async (id: string) => {
      const res = await fetch(`${endpoint}/${id}`, { method: "DELETE" });
      if (res.ok) setRows((prev) => prev.filter((r) => r._id !== id));
      return res.ok;
    },
    [endpoint],
  );

  return { rows, setRows, loading, refreshing, refresh, patchLocal, remove };
}
