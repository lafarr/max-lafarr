'use client';

import type React from "react";

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { SlideIn, FadeUp, StaggerContainer, StaggerItem } from '@/components/animations';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

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
    <main className="min-h-screen bg-black text-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <SlideIn direction="left">
            <h1 className="artist-name text-4xl md:text-6xl font-normal mb-4 text-center">CONTACT</h1>
          </SlideIn>
          <FadeUp delay={0.2}>
            <p className="text-zinc-400 text-center mb-12 font-light tracking-wide">
              Have a question or want to book Max LaFarr for a show?<br />
              Send a message and we&apos;ll get back to you.
            </p>
          </FadeUp>

          <FadeUp delay={0.3}>
            <Form {...form}>
              <form onSubmit={(event) => { void form.handleSubmit(onSubmit)(event).catch(() => undefined); }} className="space-y-6">
                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6" staggerDelay={0.06}>
                  <StaggerItem>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-400 text-xs uppercase tracking-widest">Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your name"
                              {...field}
                              className="bg-zinc-900 border-zinc-800 text-white focus:border-white transition-colors rounded-none border-0 border-b-2 px-0 focus-visible:ring-0"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </StaggerItem>

                  <StaggerItem>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-400 text-xs uppercase tracking-widest">Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Your email"
                              {...field}
                              className="bg-zinc-900 border-zinc-800 text-white focus:border-white transition-colors rounded-none border-0 border-b-2 px-0 focus-visible:ring-0"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </StaggerItem>
                </StaggerContainer>

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-400 text-xs uppercase tracking-widest">Subject</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Subject of your message"
                          {...field}
                          className="bg-zinc-900 border-zinc-800 text-white focus:border-white transition-colors rounded-none border-0 border-b-2 px-0 focus-visible:ring-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-400 text-xs uppercase tracking-widest">Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Your message"
                          {...field}
                          rows={6}
                          className="bg-transparent border-zinc-800 text-white focus:border-white transition-colors resize-none rounded-none border-0 border-b-2 px-0 focus-visible:ring-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    className="w-full bg-white text-black hover:bg-gray-200 font-medium rounded-full py-6 tracking-widest text-sm transition-colors"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
                  </Button>
                </motion.div>
              </form>
            </Form>
          </FadeUp>
        </div>
      </div>
    </main>
  );
}
