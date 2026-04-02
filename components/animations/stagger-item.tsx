'use client';

import type React from "react";

import { motion, useReducedMotion } from 'framer-motion';

type StaggerItemProps = {
  children: React.ReactNode;
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps): React.JSX.Element {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: shouldReduce === true ? 1 : 0, y: shouldReduce === true ? 0 : 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: shouldReduce === true
            ? { duration: 0 }
            : { duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
