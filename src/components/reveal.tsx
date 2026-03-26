"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type AnimationVariant = "fade-up" | "fade-left" | "fade-right" | "scale";

const variants: Record<AnimationVariant, { initial: any; animate: any }> = {
  "fade-up": {
    initial: { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
  },
  "fade-left": {
    initial: { opacity: 0, x: -32 },
    animate: { opacity: 1, x: 0 },
  },
  "fade-right": {
    initial: { opacity: 0, x: 32 },
    animate: { opacity: 1, x: 0 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
  },
};

export function Reveal({
  children,
  delay = 0,
  variant = "fade-up",
  className,
}: {
  children: ReactNode;
  delay?: number;
  variant?: AnimationVariant;
  className?: string;
}) {
  const v = variants[variant];
  return (
    <motion.div
      initial={v.initial}
      whileInView={v.animate}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
