'use client';

import type React from "react";

import { motion, useReducedMotion } from 'framer-motion';

type SlideInProps = {
  children: React.ReactNode;
  direction: 'left' | 'right';
  delay?: number;
  className?: string;
}

export function SlideIn({ children, direction, delay = 0, className }: SlideInProps): React.JSX.Element {
  const shouldReduce = useReducedMotion();
  const x = direction === 'left' ? -60 : 60;

  return (
    <motion.div
      className={className}
      initial={{ opacity: shouldReduce === true ? 1 : 0, x: shouldReduce === true ? 0 : x }}
      animate={{ opacity: 1, x: 0 }}
      transition={
        shouldReduce === true
          ? { duration: 0 }
          : { duration: 0.75, delay, ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number] }
      }
    >
      {children}
    </motion.div>
  );
}
