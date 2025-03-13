import Link from "next/link"
import { Instagram, Facebook, Twitter, Youtube, AirplayIcon as Spotify } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h2 className="artist-name text-2xl mb-2">MAX LAFARR</h2>
            <p className="text-gray-400 text-sm font-light">© {new Date().getFullYear()} All Rights Reserved</p>
          </div>

          <div className="flex gap-6">
            <Link href="https://instagram.com" className="hover:text-gray-300 transition-colors">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link href="https://facebook.com" className="hover:text-gray-300 transition-colors">
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link href="https://twitter.com" className="hover:text-gray-300 transition-colors">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="https://youtube.com" className="hover:text-gray-300 transition-colors">
              <Youtube className="h-5 w-5" />
              <span className="sr-only">YouTube</span>
            </Link>
            <Link
              href="https://open.spotify.com/artist/48cLxcaQBLsUSBvgiOmEe4"
              className="hover:text-gray-300 transition-colors"
            >
              <Spotify className="h-5 w-5" />
              <span className="sr-only">Spotify</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

