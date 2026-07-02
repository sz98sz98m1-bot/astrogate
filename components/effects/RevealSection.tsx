"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface RevealSectionProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/** Fades/slides content in once it scrolls into view. Client boundary kept small and
 * separate from server pages so pages like app/page.tsx can stay Server Components. */
export default function RevealSection({ children, delay = 0, className }: RevealSectionProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
