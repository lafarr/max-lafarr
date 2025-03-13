'use client';

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, Instagram, Youtube } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import { DialogTitle } from "@radix-ui/react-dialog";
import { FaSpotify } from "react-icons/fa"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="bg-black text-white sticky top-0 z-50 border-b border-white/10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="artist-name text-xl">
          MAX LAFARR
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="hover:text-gray-300 transition-colors text-sm font-medium">
            HOME
          </Link>
          <Link href="/discography" className="hover:text-gray-300 transition-colors text-sm font-medium">
            MUSIC
          </Link>
          <Link href="/events" className="hover:text-gray-300 transition-colors text-sm font-medium">
            EVENTS
          </Link>
          <Link href="/contact" className="hover:text-gray-300 transition-colors text-sm font-medium">
            CONTACT
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="https://open.spotify.com/artist/48cLxcaQBLsUSBvgiOmEe4"
            className="hover:text-gray-300 transition-colors"
            target="_blank"
          >
            <FaSpotify className="h-5 w-5" />
            <span className="sr-only">Spotify</span>
          </Link>
          <Link
            href="https://www.instagram.com/maxlafarrmusic/"
            className="hover:text-gray-300 transition-colors"
            target="_blank">
            <Instagram className="h-5 w-5" />
            <span className="sr-only">Instagram</span>
          </Link>
          <Link
            href="https://www.youtube.com/@maxlafarrmusic3168"
            className="hover:text-gray-300 transition-colors"
            target="_blank">
            <Youtube className="h-6 w-6" />
            <span className="sr-only">YouTube</span>
          </Link>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-black text-white w-full sm:w-full p-0 border-0">
            <DialogTitle className="sr-only"></DialogTitle>
            <div className="flex flex-col h-full">
              <div className="flex justify-end p-4">
                <Button variant="ghost" size="icon" className="text-white" onClick={() => setIsOpen(false)}>
                  <span className="sr-only">Close menu</span>
                </Button>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center">
                <nav className="flex flex-col items-center gap-8">
                  <Link
                    href="/"
                    onClick={() => setIsOpen(false)}
                    className="text-2xl hover:text-gray-300 transition-colors font-medium tracking-wider"
                  >
                    HOME
                  </Link>
                  <Link
                    href="/discography"
                    onClick={() => setIsOpen(false)}
                    className="text-2xl hover:text-gray-300 transition-colors font-medium tracking-wider"
                  >
                    MUSIC
                  </Link>
                  <Link
                    href="/events"
                    onClick={() => setIsOpen(false)}
                    className="text-2xl hover:text-gray-300 transition-colors font-medium tracking-wider"
                  >
                    EVENTS
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setIsOpen(false)}
                    className="text-2xl hover:text-gray-300 transition-colors font-medium tracking-wider"
                  >
                    CONTACT
                  </Link>
                </nav>
              </div>
              <div className="p-4 text-center text-sm text-gray-400">
                © {new Date().getFullYear()} MAX LAFARR
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

