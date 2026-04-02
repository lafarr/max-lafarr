'use client';

import { motion } from 'framer-motion';

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({ children, className, staggerDelay = 0.07 }: StaggerContainerProps) {
  return (
    <motion.div
      className={className}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: staggerDelay } } }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      {children}
    </motion.div>
  );
}
