"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import React from "react";

interface Props {
  children: React.ReactNode;
  stagger?: number;
  className?: string;
  once?: boolean;
}

const containerVariants = (stagger: number) => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger } },
});

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE },
  },
};

export default function StaggerReveal({
  children,
  stagger = 0.1,
  className,
  once = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={containerVariants(stagger)}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {React.Children.map(children, (child, i) => (
        <motion.div key={i} variants={itemVariants} style={{ height: "100%" }}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
