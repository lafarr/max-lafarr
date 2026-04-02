'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

interface ParallaxHeroProps {
  children: React.ReactNode;
  className?: string;
}

export function ParallaxHero({ children, className }: ParallaxHeroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', shouldReduce ? '0%' : '35%']);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className ?? ''}`}>
      <motion.div style={{ y }} className="absolute inset-0 will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}
