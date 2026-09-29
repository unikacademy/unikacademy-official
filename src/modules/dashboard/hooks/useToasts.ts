"use client";

import { useCallback, useRef, useState } from "react";
import type { Toast } from "@/modules/dashboard/types";

// Auto-dismissing toasts. Render with <ToastContainer toasts={toasts} />.
export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const showToast = useCallback(
    (message: string, type: Toast["type"] = "success") => {
      const id = ++nextId.current;
      setToasts((t) => [...t, { id, message, type }]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
    },
    [],
  );

  return { toasts, showToast };
}
