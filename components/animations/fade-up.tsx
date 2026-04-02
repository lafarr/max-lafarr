'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface FadeUpProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function FadeUp({ children, delay = 0, className }: FadeUpProps) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: shouldReduce ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay, ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number] }}
      viewport={{ once: true, margin: '-40px' }}
    >
      {children}
    </motion.div>
  );
}
