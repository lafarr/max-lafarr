'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: shouldReduce ? 0 : 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
