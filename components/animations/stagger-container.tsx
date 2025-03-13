'use client';

import type React from "react";

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

type StaggerContainerProps = {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({ children, className, staggerDelay = 0.07 }: StaggerContainerProps): React.JSX.Element {
  const shouldReduce = useReducedMotion();
  const [hasEnteredViewport, setHasEnteredViewport] = useState(false);

  return (
    <motion.div
      className={className}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: shouldReduce === true ? 0 : staggerDelay } } }}
      initial="hidden"
      animate={hasEnteredViewport ? 'visible' : 'hidden'}
      onViewportEnter={() => { setHasEnteredViewport(true); }}
      viewport={{ once: true, margin: '-60px' }}
    >
      {children}
    </motion.div>
  );
}
