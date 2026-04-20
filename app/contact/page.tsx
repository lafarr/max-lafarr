import type React from "react";

import { FaSpotify, FaInstagram, FaYoutube } from 'react-icons/fa';
import { Mail, MapPin } from 'lucide-react';
import { PressLink } from '@/components/ui/press-link';
import { ContactForm } from '@/components/contact/contact-form';

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

export default function ContactPage(): React.JSX.Element {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_10%,hsl(38_55%_55%/0.06),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.03),transparent_40%)]" />
      <div className="container relative mx-auto px-4 py-24 md:py-32">
        <div className="relative">
          <div className="mb-16 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.34em] text-amber-accent/60">Get In Touch</p>
              <h1 className="artist-name text-5xl md:text-7xl lg:text-8xl">CONTACT</h1>
            </div>
            <p className="max-w-xl text-sm font-light leading-7 text-zinc-500 md:text-base">
              Booking requests, collaborations, session work, or general inquiries. Reach out and start the conversation.
            </p>
          </div>

          <div className="section-divider mb-14" />

          <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-4">
              <div>
                <p className="mb-4 text-xs uppercase tracking-[0.34em] text-zinc-600">Booking & Inquiries</p>
                <p className="text-sm font-light leading-7 text-zinc-500">
                  Want to book Max LaFarr for a show, collaboration, or session work? Send the details and we&apos;ll get back to you.
                </p>
              </div>

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

              <div className="pt-4">
                <p className="mb-4 text-xs uppercase tracking-[0.34em] text-zinc-600">Follow</p>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((s) => (
                    <PressLink
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      className="flex size-11 items-center justify-center rounded-full border border-white/8 text-zinc-600 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:text-white"
                    >
                      {s.icon}
                      <span className="sr-only">{s.label}</span>
                    </PressLink>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
