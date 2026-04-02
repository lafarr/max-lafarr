'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface SlideInProps {
  children: React.ReactNode;
  direction: 'left' | 'right';
  delay?: number;
  className?: string;
}

export function SlideIn({ children, direction, delay = 0, className }: SlideInProps) {
  const shouldReduce = useReducedMotion();
  const x = direction === 'left' ? -60 : 60;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: shouldReduce ? 0 : x }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.75, delay, ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number] }}
    >
      {children}
    </motion.div>
  );
}
