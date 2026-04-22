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

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

const inputClassName = 'h-14 rounded-[1.25rem] border border-white/8 bg-white/[0.02] px-4 text-white placeholder:text-zinc-600 transition-all duration-300 focus-visible:border-white/20 focus-visible:ring-0 focus-visible:shadow-[0_0_30px_-10px_hsl(38,55%,55%,0.1)]';
const textareaClassName = 'min-h-40 rounded-[1.25rem] border border-white/8 bg-white/[0.02] px-4 py-4 text-white placeholder:text-zinc-600 transition-all duration-300 focus-visible:border-white/20 focus-visible:ring-0 focus-visible:shadow-[0_0_30px_-10px_hsl(38,55%,55%,0.1)]';

export function ContactForm(): React.JSX.Element {
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
          </div>

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

          <div className="flex flex-col gap-4 border-t border-white/8 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="submit"
              className="h-12 rounded-full border border-white bg-white px-8 text-[0.68rem] font-medium uppercase tracking-[0.32em] text-black transition-all duration-300 hover:bg-zinc-200 hover:shadow-[0_20px_50px_-20px_rgba(255,255,255,0.25)]"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
