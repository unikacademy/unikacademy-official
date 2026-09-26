"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "p";

interface Props {
  text: string;
  as?: HeadingTag;
  className?: string;
  delay?: number;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const wordVariants = {
  hidden: { opacity: 0, y: 22, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: EASE },
  },
};

export default function SplitHeading({
  text,
  as: Tag = "h2",
  className,
  delay = 0,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const words = text.split(" ");

  const MotionTag = motion[Tag] as typeof motion.h2;

  return (
    <MotionTag
      ref={ref as React.RefObject<HTMLHeadingElement>}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ delayChildren: delay }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={wordVariants}
          style={{ display: "inline-block", marginRight: "0.3em" }}
        >
          {word}
        </motion.span>
      ))}
    </MotionTag>
  );
}
