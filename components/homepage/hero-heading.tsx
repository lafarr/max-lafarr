'use client';

import type React from "react";

import { motion, useReducedMotion, type Variants } from 'framer-motion';

const text = 'MAX LAFARR';

export function HeroHeading(): React.JSX.Element {
  const shouldReduce = useReducedMotion();
  const ease = [0.21, 0.47, 0.32, 0.98] as [number, number, number, number];

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: shouldReduce === true ? 0 : 0.05, delayChildren: 0.2 },
    },
  };

  const letterVariants: Variants = {
    hidden: { opacity: shouldReduce === true ? 1 : 0, y: shouldReduce === true ? 0 : 80, rotateX: shouldReduce === true ? 0 : 45 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: shouldReduce === true ? { duration: 0 } : { duration: 0.8, ease },
    },
  };

  return (
    <div className="perspective-[1000px]">
      <motion.h1
        className="artist-name flex flex-wrap justify-center text-center text-6xl font-normal leading-[0.84] tracking-[-0.035em] text-white drop-shadow-[0_20px_50px_rgba(0,0,0,0.75)] sm:text-8xl md:text-9xl lg:text-[10rem]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        aria-label={text}
      >
        {text.split('').map((char, i) => (
          <motion.span
            key={i}
            variants={letterVariants}
            className={char === ' ' ? 'w-4 sm:w-8 md:w-12 lg:w-16' : 'inline-block'}
            style={{ transformOrigin: 'bottom center' }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </motion.h1>
    </div>
  );
}
