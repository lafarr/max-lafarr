import type React from "react";

import { FaSpotify, FaInstagram, FaYoutube } from 'react-icons/fa';
import { FadeUp } from '@/components/animations';
import { PressLink } from '@/components/ui/press-link';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/discography', label: 'Discography' },
  { href: '/events', label: 'Events' },
  { href: '/contact', label: 'Contact' },
];

const socialLinks = [
  {
    href: 'https://open.spotify.com/artist/48cLxcaQBLsUSBvgiOmEe4',
    label: 'Spotify',
    icon: <FaSpotify className="h-5 w-5" />,
  },
  {
    href: 'https://www.instagram.com/max.the.rockstar.06/',
    label: 'Instagram',
    icon: <FaInstagram className="h-5 w-5" />,
  },
  {
    href: 'https://www.youtube.com/@maxlafarrmusic3168',
    label: 'YouTube',
    icon: <FaYoutube className="h-6 w-6" />,
  },
];

export default function Footer(): React.JSX.Element {
  return (
    <footer className="relative bg-black px-4 pb-8 pt-0 text-white sm:px-6">
      <div className="section-divider mb-16" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center_top,hsl(38_55%_55%/0.04),transparent_50%)]" />
      <FadeUp>
        <div className="relative mx-auto max-w-6xl">
          <div className="grid gap-12 md:grid-cols-[minmax(0,1.4fr)_minmax(0,0.7fr)_minmax(0,0.9fr)]">
            <div className="space-y-5">
              <p className="text-[0.62rem] uppercase tracking-[0.38em] text-amber-accent/50">Max LaFarr</p>
              <h2 className="artist-name text-4xl sm:text-5xl">Sound With Shadow.</h2>
              <p className="max-w-md text-sm font-light leading-7 text-zinc-600">
                New releases, live dates, and the visual world around the music — all in one place.
              </p>
            </div>

            <div>
              <p className="mb-5 text-[0.62rem] uppercase tracking-[0.38em] text-zinc-600">Navigate</p>
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <PressLink
                    key={link.href}
                    href={link.href}
                    className="w-fit text-sm tracking-[0.06em] text-zinc-500 transition-colors duration-300 hover:text-white"
                  >
                    {link.label}
                  </PressLink>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-5 text-[0.62rem] uppercase tracking-[0.38em] text-zinc-600">Follow</p>
              <div className="flex items-center gap-3">
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

          <div className="mt-14 flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/8 to-transparent" />
            <p className="shrink-0 text-[0.62rem] uppercase tracking-[0.3em] text-zinc-700">
              © {new Date().getFullYear()} MAX LAFARR
            </p>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/8 to-transparent" />
          </div>
        </div>
      </FadeUp>
    </footer>
  );
}
