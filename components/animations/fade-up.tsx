'use client';

import type React from "react";

import { motion, useReducedMotion } from 'framer-motion';

type FadeUpProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function FadeUp({ children, delay = 0, className }: FadeUpProps): React.JSX.Element {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: shouldReduce === true ? 1 : 0, y: shouldReduce === true ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={
        shouldReduce === true
          ? { duration: 0 }
          : { duration: 0.65, delay, ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number] }
      }
      viewport={{ once: true, margin: '-40px' }}
    >
      {children}
    </motion.div>
  );
}
