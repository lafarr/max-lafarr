'use client';

import type React from "react";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { FaSpotify, FaInstagram, FaYoutube } from 'react-icons/fa';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState, useEffect } from 'react';
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
    href: 'https://www.instagram.com/maxlafarrmusic/',
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

  useEffect(() => {
    function onScroll(): void {
      setScrolled(window.scrollY > 40);
    }
    function cleanup(): void {
      window.removeEventListener('scroll', onScroll);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return cleanup;
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? 'bg-black/80 backdrop-blur-md border-white/10'
          : 'bg-black border-white/10'
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="artist-name text-xl text-white hover:opacity-80 transition-opacity">
          MAX LAFARR
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative text-white text-sm font-medium hover:text-gray-300 transition-colors"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-px w-full bg-white origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </Link>
          ))}
        </nav>

        {/* Desktop social icons */}
        <div className="hidden md:flex items-center gap-4">
          {socialLinks.map((s) => (
            <motion.div key={s.label} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }}>
              <Link href={s.href} className="text-white hover:text-gray-300 transition-colors" target="_blank">
                {s.icon}
                <span className="sr-only">{s.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile hamburger */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-black text-white w-full sm:w-full p-0 border-0">
            <DialogTitle className="sr-only">Navigation Menu</DialogTitle>
            <div className="flex flex-col h-full">
              <div className="flex-1 flex flex-col items-center justify-center">
                <nav className="flex flex-col items-center gap-8">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 30 }}
                      animate={isOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                      transition={{ duration: 0.35, delay: i * 0.07, ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number] }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => { setIsOpen(false); }}
                        className="text-2xl hover:text-gray-300 transition-colors font-medium tracking-wider"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Mobile social icons */}
                <div className="flex items-center gap-6 mt-12">
                  {socialLinks.map((s, i) => (
                    <motion.div
                      key={s.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                      transition={{ duration: 0.35, delay: navLinks.length * 0.07 + i * 0.06 }}
                    >
                      <Link href={s.href} className="text-white hover:text-gray-300 transition-colors" target="_blank">
                        {s.icon}
                        <span className="sr-only">{s.label}</span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="p-4 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} MAX LAFARR
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
