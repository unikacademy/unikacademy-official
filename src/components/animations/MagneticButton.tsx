"use client";

import { useRef } from "react";
import { motion, useSpring } from "framer-motion";

interface Props {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export default function MagneticButton({
  children,
  className,
  strength = 20,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const springX = useSpring(0, { stiffness: 500, damping: 28 });
  const springY = useSpring(0, { stiffness: 500, damping: 28 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = Math.max(-strength, Math.min(strength, (e.clientX - cx) * 0.4));
    const dy = Math.max(-strength, Math.min(strength, (e.clientY - cy) * 0.4));
    springX.set(dx);
    springY.set(dy);
  }

  function handleMouseLeave() {
    springX.set(0);
    springY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: springX, y: springY, display: "inline-block" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}
