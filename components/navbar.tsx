'use client';

import type React from "react";

import Link from 'next/link';
import { PressLink } from '@/components/ui/press-link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import { FaSpotify, FaInstagram, FaYoutube } from 'react-icons/fa';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState, useEffect, useRef } from 'react';
import { DialogTitle } from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';

const navLinks = [
  { href: '/', label: 'HOME' },
  { href: '/discography', label: 'DISCOGRAPHY' },
  { href: '/events', label: 'EVENTS' },
  { href: '/contact', label: 'CONTACT' },
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

export default function Navbar(): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const navActed = useRef(false);

  function handleNavPointerDown(e: React.PointerEvent<HTMLAnchorElement>, href: string): void {
    navActed.current = false;
    if (e.pointerType === 'touch') { return; }
    if (e.button === 1 || (e.button === 0 && (e.ctrlKey || e.metaKey))) {
      e.preventDefault();
      window.open(href, '_blank');
      navActed.current = true;
    } else if (e.button === 0 && e.shiftKey) {
      e.preventDefault();
      window.open(href);
      navActed.current = true;
    } else if (e.button === 0 && !e.altKey) {
      e.preventDefault();
      router.push(href);
      navActed.current = true;
    }
  }

  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>): void {
    if (navActed.current) {
      navActed.current = false;
      e.preventDefault();
      return;
    }
    // Touch or keyboard: let Next.js Link navigate naturally
  }

  useEffect(() => {
    function onScroll(): void {
      setScrolled(window.scrollY > 40);
    }
    function cleanup(): void {
      window.removeEventListener('scroll', onScroll);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return cleanup;
  }, []);

  return (
    <header className="sticky top-0 z-50 px-3 py-3 sm:px-4">
      <div
        className={cn(
          'relative mx-auto flex max-w-6xl items-center justify-between gap-3 overflow-hidden rounded-[1.75rem] border px-4 py-3 transition-all duration-300 sm:px-6',
          scrolled
            ? 'border-white/10 bg-black/72 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.95)] backdrop-blur-2xl'
            : 'border-white/8 bg-black/48 shadow-[0_18px_60px_-38px_rgba(0,0,0,0.88)] backdrop-blur-xl'
        )}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_34%),linear-gradient(115deg,rgba(255,255,255,0.08),transparent_24%,transparent_72%,rgba(255,255,255,0.05))]" />
        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

        <Link href="/" prefetch={true} onPointerDown={(e) => { handleNavPointerDown(e, '/'); }} onClick={handleNavClick} className="group relative z-10 flex min-w-0 items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-[0.65rem] font-semibold tracking-[0.35em] text-amber-accent/70 transition-colors duration-300 group-hover:text-amber-accent">
            ML
          </span>
          <span className="min-w-0">
            <span className="block text-[0.6rem] uppercase tracking-[0.42em] text-white/45">Official Site</span>
            <span className="artist-name block truncate text-lg text-white transition-opacity duration-300 group-hover:opacity-85 sm:text-xl">
              MAX LAFARR
            </span>
          </span>
        </Link>

        <nav className="relative z-10 hidden items-center rounded-full border border-white/10 bg-white/[0.04] p-1 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                prefetch={true}
                aria-current={isActive ? 'page' : undefined}
                onPointerDown={(e) => { handleNavPointerDown(e, link.href); }}
                onClick={handleNavClick}
                className={cn(
                  'rounded-full px-4 py-2 text-[0.68rem] font-medium tracking-[0.3em] transition-all duration-300',
                  isActive
                    ? 'bg-white text-black shadow-[0_12px_30px_-18px_rgba(255,255,255,0.95)]'
                    : 'text-white/60 hover:bg-white/[0.06] hover:text-white'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="relative z-10 flex items-center gap-2">
          <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1.5 md:flex">
            {socialLinks.map((s) => (
              <motion.div key={s.label} whileHover={{ scale: 1.08, y: -1 }} whileTap={{ scale: 0.96 }}>
                <PressLink
                  href={s.href}
                  target="_blank"
                  className="flex size-9 items-center justify-center rounded-full text-white/70 transition-colors duration-300 hover:bg-white/[0.08] hover:text-white"
                >
                  {s.icon}
                  <span className="sr-only">{s.label}</span>
                </PressLink>
              </motion.div>
            ))}
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08] hover:text-white md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full border-l border-white/10 bg-black/95 p-0 text-white sm:max-w-md"
            >
              <DialogTitle className="sr-only">Navigation Menu</DialogTitle>
              <div className="relative flex h-full flex-col overflow-hidden film-grain">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.05),transparent_24%),linear-gradient(145deg,#111,#050505_45%,#000)]" />

                <div className="relative flex items-center justify-between border-b border-white/10 px-6 py-5">
                  <div>
                    <p className="text-[0.6rem] uppercase tracking-[0.42em] text-white/40">Max LaFarr</p>
                    <p className="artist-name text-2xl text-white">NAVIGATION</p>
                  </div>
                </div>

                <div className="relative flex flex-1 flex-col justify-between px-6 py-8">
                  <nav className="space-y-3">
                    {navLinks.map((link, i) => {
                      const isActive = pathname === link.href;

                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          prefetch={true}
                          aria-current={isActive ? 'page' : undefined}
                          onClick={() => { setIsOpen(false); }}
                          className={cn(
                            'flex items-center justify-between rounded-[1.4rem] border px-5 py-4 transition-all duration-300',
                            isActive
                              ? 'border-white/20 bg-white text-black shadow-[0_20px_45px_-30px_rgba(255,255,255,0.95)]'
                              : 'border-white/10 bg-white/[0.03] text-white hover:border-white/20 hover:bg-white/[0.06]'
                          )}
                        >
                          <span className="text-lg font-medium tracking-[0.2em]">{link.label}</span>
                          <span
                            className={cn(
                              'text-[0.65rem] tracking-[0.34em]',
                              isActive ? 'text-black/60' : 'text-white/35'
                            )}
                          >
                            0{i + 1}
                          </span>
                        </Link>
                      );
                    })}
                  </nav>

                  <div className="space-y-8">
                    <div className="flex items-center gap-3">
                      {socialLinks.map((s) => (
                        <Link
                          key={s.label}
                          href={s.href}
                          target="_blank"
                          className="flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                        >
                          {s.icon}
                          <span className="sr-only">{s.label}</span>
                        </Link>
                      ))}
                    </div>

                    <div className="border-t border-white/10 pt-5">
                      <p className="text-xs uppercase tracking-[0.35em] text-white/35">Cinematic folk with edge.</p>
                      <p className="mt-2 text-sm text-white/55">© {new Date().getFullYear()} MAX LAFARR</p>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
