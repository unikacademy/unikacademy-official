"use client";

import { useRef, useState, useEffect } from "react";
import { useInView } from "framer-motion";

interface Props {
  target: string;
  className?: string;
  duration?: number;
}

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

export default function CountUp({ target, className, duration = 1500 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState("0");
  const hasAnimated = useRef(false);

  // Parse: "500+" → { num: 500, suffix: "+", decimals: 0 }
  const match = target.match(/^([\d.]+)(.*)$/);
  const numericStr = match?.[1] ?? "0";
  const suffix = match?.[2] ?? "";
  const targetNum = parseFloat(numericStr);
  const decimals = numericStr.includes(".")
    ? numericStr.split(".")[1].length
    : 0;

  useEffect(() => {
    if (!inView || hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuart(progress);
      const current = eased * targetNum;
      setDisplay(
        decimals > 0
          ? current.toFixed(decimals)
          : Math.round(current).toLocaleString("en-IN"),
      );
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [inView, targetNum, decimals, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}
