'use client';

import type React from "react";

import { motion, useReducedMotion } from 'framer-motion';

type StaggerContainerProps = {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({ children, className, staggerDelay = 0.07 }: StaggerContainerProps): React.JSX.Element {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: shouldReduce === true ? 0 : staggerDelay } } }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      {children}
    </motion.div>
  );
}
