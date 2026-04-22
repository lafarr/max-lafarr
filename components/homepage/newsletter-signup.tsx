'use client';

import type React from "react";

import { useState } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { createSub } from '@/lib/actions';

export function NewsletterSignup(): React.JSX.Element {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (email.trim() === '') { return; }
    setIsSubmitting(true);
    try {
      await createSub(email);
      setEmail('');
      toast.success("You're in", {
        description: "You'll be the first to know about new music and shows.",
      });
    } catch {
      toast.error('Something went wrong', {
        description: 'Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <motion.form
      onSubmit={(e) => { handleSubmit(e).catch(() => undefined); }}
      className="mx-auto flex max-w-2xl flex-col gap-3 sm:flex-row sm:items-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      <input
        type="email"
        value={email}
        onChange={(e) => { setEmail(e.target.value); }}
        placeholder="your@email.com"
        required
        className="h-14 flex-1 rounded-full border border-white/8 bg-white/[0.03] px-6 text-sm tracking-[0.08em] text-white outline-none transition-all duration-300 placeholder:text-zinc-600 focus:border-white/20 focus:shadow-[0_0_30px_-10px_hsl(38,55%,55%,0.15)]"
      />
      <motion.button
        type="submit"
        disabled={isSubmitting}
        className="h-14 rounded-full border border-white bg-white px-8 text-[0.68rem] font-medium uppercase tracking-[0.32em] text-black transition-all duration-300 hover:shadow-[0_20px_50px_-20px_rgba(255,255,255,0.25)] disabled:opacity-50"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isSubmitting ? 'JOINING...' : 'JOIN'}
      </motion.button>
    </motion.form>
  );
}
