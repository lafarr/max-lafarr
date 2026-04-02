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
      toast.success('You\'re in', {
        description: 'You\'ll be the first to know about new music and shows.',
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
      className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
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
        className="flex-1 bg-transparent border-b border-white/20 focus:border-white text-white placeholder:text-zinc-600 px-0 py-3 text-sm tracking-wide outline-none transition-colors"
      />
      <motion.button
        type="submit"
        disabled={isSubmitting}
        className="bg-white text-black px-8 py-3 text-xs font-medium tracking-[0.2em] uppercase hover:bg-zinc-200 transition-colors disabled:opacity-50"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isSubmitting ? 'JOINING...' : 'JOIN'}
      </motion.button>
    </motion.form>
  );
}
