'use client';

import type React from "react";

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export function TicketButton({ href }: { href: string }): React.JSX.Element {
  return (
    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
      <Button
        asChild
        className="h-12 rounded-full border border-white bg-white px-6 text-[0.68rem] font-medium uppercase tracking-[0.32em] text-black transition-all duration-300 hover:bg-zinc-200 hover:shadow-[0_20px_50px_-20px_rgba(255,255,255,0.25)] sm:px-8"
      >
        <a href={href} target="_blank" rel="noopener noreferrer">GET TICKETS</a>
      </Button>
    </motion.div>
  );
}
