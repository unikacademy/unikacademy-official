"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function ProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isNavigatingRef = useRef(false);

  useEffect(() => {
    const originalPushState = history.pushState.bind(history);
    const originalReplaceState = history.replaceState.bind(history);

    const start = () => {
      if (startTimerRef.current) clearTimeout(startTimerRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
      isNavigatingRef.current = true;

      // Defer setState — Next.js calls pushState from useInsertionEffect during
      // rendering, and React forbids setState inside that context.
      startTimerRef.current = setTimeout(() => {
        setVisible(true);
        setWidth(0);

        let current = 0;
        intervalRef.current = setInterval(() => {
          current += Math.random() * 20 + 5;
          if (current >= 80) {
            current = 80;
            if (intervalRef.current) clearInterval(intervalRef.current);
          }
          setWidth(current);
        }, 200);
      }, 0);
    };

    history.pushState = (...args) => { start(); return originalPushState(...args); };
    history.replaceState = (...args) => { start(); return originalReplaceState(...args); };

    return () => {
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
      if (startTimerRef.current) clearTimeout(startTimerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isNavigatingRef.current) return;
    isNavigatingRef.current = false;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setWidth(100);
    hideTimerRef.current = setTimeout(() => {
      setVisible(false);
      setWidth(0);
    }, 400);
  }, [pathname, searchParams]);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 z-[9999] h-[3px] pointer-events-none"
      style={{
        width: `${width}%`,
        background: "linear-gradient(90deg, #c0a84f, #d4bc72)",
        transition: width === 100 ? "width 0.2s ease-out" : "width 0.25s ease",
        boxShadow: "0 0 8px rgba(192, 168, 79, 0.5)",
      }}
    />
  );
}

export default function NavigationProgress() {
  return (
    <Suspense>
      <ProgressBar />
    </Suspense>
  );
}
