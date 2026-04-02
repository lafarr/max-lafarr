'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export function TicketButton({ href }: { href: string }) {
  return (
    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
      <Button asChild className="bg-white text-black hover:bg-gray-200 px-6 sm:px-8">
        <a href={href}>GET TICKETS</a>
      </Button>
    </motion.div>
  );
}
