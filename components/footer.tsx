import type React from "react";

import Link from 'next/link';
import { FaSpotify, FaInstagram, FaYoutube } from 'react-icons/fa';
import { FadeUp } from '@/components/animations';

export default function Footer(): React.JSX.Element {
  return (
    <footer className="bg-zinc-950 text-white border-t border-white/10">
      <FadeUp>
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
            {/* Column 1 — Brand */}
            <div className="flex flex-col gap-3">
              <h2 className="artist-name text-2xl">MAX LAFARR</h2>
              <p className="text-zinc-400 text-sm font-light leading-relaxed">
                Musician, multi-instrumentalist.
              </p>
            </div>

            {/* Column 2 — Nav links */}
            <div className="flex flex-col gap-3">
              <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Navigate</p>
              {[
                { href: '/', label: 'Home' },
                { href: '/discography', label: 'Discography' },
                { href: '/events', label: 'Events' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-zinc-400 hover:text-white text-sm transition-colors w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Column 3 — Social */}
            <div className="flex flex-col gap-3">
              <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Follow</p>
              <div className="flex items-center gap-5">
                {[
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
                    icon: <FaYoutube className="h-6 w-6" />,
                  },
                ].map((s) => (
                  <Link
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    className="text-zinc-400 hover:text-white transition-colors hover:-translate-y-0.5 transform duration-200"
                  >
                    {s.icon}
                    <span className="sr-only">{s.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8">
            <p className="text-zinc-600 text-xs font-mono text-center">
              © {new Date().getFullYear()} MAX LAFARR — ALL RIGHTS RESERVED
            </p>
          </div>
        </div>
      </FadeUp>
    </footer>
  );
}
