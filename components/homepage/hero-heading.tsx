'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';

const text = 'MAX LAFARR';

export function HeroHeading() {
  const shouldReduce = useReducedMotion();
  const ease = [0.21, 0.47, 0.32, 0.98] as [number, number, number, number];

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: shouldReduce ? 0 : 0.04, delayChildren: 0.1 },
    },
  };

  const letterVariants: Variants = {
    hidden: { opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: shouldReduce ? { duration: 0 } : { duration: 0.6, ease },
    },
  };

  return (
    <motion.h1
      className="artist-name text-6xl md:text-8xl font-normal leading-none flex flex-wrap justify-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-label={text}
    >
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          variants={letterVariants}
          className={char === ' ' ? 'w-6 md:w-10' : ''}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.h1>
  );
}
