'use client';

import type React from "react";

import { useState } from 'react';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { FaSpotify, FaInstagram, FaYoutube } from 'react-icons/fa';
import { Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { FadeUp } from '@/components/animations';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

const socialLinks = [
  {
    href: 'https://open.spotify.com/artist/48cLxcaQBLsUSBvgiOmEe4',
    label: 'Spotify',
    icon: <FaSpotify className="h-5 w-5" />,
  },
  {
    href: 'https://www.instagram.com/maxlafarrmusic/',
    label: 'Instagram',
    icon: <FaInstagram className="h-5 w-5" />,
  },
  {
    href: 'https://www.youtube.com/@maxlafarrmusic3168',
    label: 'YouTube',
    icon: <FaYoutube className="h-5 w-5" />,
  },
];

const ease = [0.21, 0.47, 0.32, 0.98] as [number, number, number, number];
const inputClassName = 'h-14 rounded-[1.25rem] border border-white/8 bg-white/[0.02] px-4 text-white placeholder:text-zinc-600 transition-all duration-300 focus-visible:border-white/20 focus-visible:ring-0 focus-visible:shadow-[0_0_30px_-10px_hsl(38,55%,55%,0.1)]';
const textareaClassName = 'min-h-40 rounded-[1.25rem] border border-white/8 bg-white/[0.02] px-4 py-4 text-white placeholder:text-zinc-600 transition-all duration-300 focus-visible:border-white/20 focus-visible:ring-0 focus-visible:shadow-[0_0_30px_-10px_hsl(38,55%,55%,0.1)]';

export default function ContactPage(): React.JSX.Element {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '', subject: '', message: '' },
  });

  function onSubmit(): void {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      form.reset();
      toast.success('Message sent', {
        description: "Thank you for your message. We'll get back to you soon.",
      });
    }, 1500);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_10%,hsl(38_55%_55%/0.06),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.03),transparent_40%)]" />
      <div className="container relative mx-auto px-4 py-24 md:py-32">
        <div className="relative">
          <div className="mb-16 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end">
            <div>
              <FadeUp>
                <p className="mb-3 text-xs uppercase tracking-[0.34em] text-amber-accent/60">Get In Touch</p>
              </FadeUp>
              <FadeUp delay={0.1}>
                <h1 className="artist-name text-5xl md:text-7xl lg:text-8xl">CONTACT</h1>
              </FadeUp>
            </div>
            <FadeUp delay={0.15}>
              <p className="max-w-xl text-sm font-light leading-7 text-zinc-500 md:text-base">
                Booking requests, collaborations, session work, or general inquiries. Reach out and start the conversation.
              </p>
            </FadeUp>
          </div>

          <div className="section-divider mb-14" />

          <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-4">
              <FadeUp delay={0.2}>
                <div>
                  <p className="mb-4 text-xs uppercase tracking-[0.34em] text-zinc-600">Booking & Inquiries</p>
                  <p className="text-sm font-light leading-7 text-zinc-500">
                    Want to book Max LaFarr for a show, collaboration, or session work? Send the details and we&apos;ll get back to you.
                  </p>
                </div>
              </FadeUp>

              <FadeUp delay={0.3}>
                <div className="space-y-3 pt-4">
                  <p className="mb-4 text-xs uppercase tracking-[0.34em] text-zinc-600">Connect</p>
                  <div className="flex items-center gap-3 rounded-[1rem] border border-white/8 bg-white/[0.02] px-4 py-3 text-sm transition-colors duration-300 hover:border-white/12">
                    <Mail className="h-4 w-4 text-amber-accent/50" />
                    <span className="font-light text-zinc-400">maxlafarrmusic@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-[1rem] border border-white/8 bg-white/[0.02] px-4 py-3 text-sm transition-colors duration-300 hover:border-white/12">
                    <MapPin className="h-4 w-4 text-amber-accent/50" />
                    <span className="font-light text-zinc-400">Queensbury, NY</span>
                  </div>
                </div>
              </FadeUp>

              <FadeUp delay={0.4}>
                <div className="pt-4">
                  <p className="mb-4 text-xs uppercase tracking-[0.34em] text-zinc-600">Follow</p>
                  <div className="flex flex-wrap gap-3">
                    {socialLinks.map((s) => (
                      <Link
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        className="flex size-11 items-center justify-center rounded-full border border-white/8 text-zinc-600 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:text-white"
                      >
                        {s.icon}
                        <span className="sr-only">{s.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </FadeUp>
            </div>

            <div className="lg:col-span-8">
              <FadeUp delay={0.3}>
                <div className="rounded-[1.8rem] border border-white/8 bg-white/[0.02] p-6 transition-colors duration-500 hover:border-white/12 md:p-8">
                  <div className="mb-8 border-b border-white/8 pb-6">
                    <p className="text-xs uppercase tracking-[0.34em] text-amber-accent/50">Send A Message</p>
                    <p className="mt-3 text-sm leading-7 text-zinc-500">
                      Share the context, timeline, and anything else useful. The more detail, the better the response.
                    </p>
                  </div>

                  <Form {...form}>
                    <form onSubmit={(event) => { void form.handleSubmit(onSubmit)(event).catch(() => undefined); }} className="space-y-8">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.4, ease }}
                        >
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="mb-2 block text-xs uppercase tracking-[0.28em] text-zinc-600">Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your name" {...field} className={inputClassName} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.5, ease }}
                        >
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="mb-2 block text-xs uppercase tracking-[0.28em] text-zinc-600">Email</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="your@email.com" {...field} className={inputClassName} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </motion.div>
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6, ease }}
                      >
                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="mb-2 block text-xs uppercase tracking-[0.28em] text-zinc-600">Subject</FormLabel>
                              <FormControl>
                                <Input placeholder="What&apos;s this about?" {...field} className={inputClassName} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.7, ease }}
                      >
                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="mb-2 block text-xs uppercase tracking-[0.28em] text-zinc-600">Message</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Tell me what you have in mind..."
                                  {...field}
                                  rows={6}
                                  className={textareaClassName}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8, ease }}
                        className="flex flex-col gap-4 border-t border-white/8 pt-6 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <p className="text-xs uppercase tracking-[0.28em] text-zinc-600">Response times may vary during tour weeks.</p>
                        <Button
                          type="submit"
                          className="h-12 rounded-full border border-white bg-white px-8 text-[0.68rem] font-medium uppercase tracking-[0.32em] text-black transition-all duration-300 hover:bg-zinc-200 hover:shadow-[0_20px_50px_-20px_rgba(255,255,255,0.25)]"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
                        </Button>
                      </motion.div>
                    </form>
                  </Form>
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
