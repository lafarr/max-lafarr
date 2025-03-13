import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Navbar() {
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

        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-white">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-black text-white">
            <nav className="flex flex-col gap-6 mt-12">
              <Link href="/" className="text-xl hover:text-gray-300 transition-colors font-medium">
                HOME
              </Link>
              <Link href="/discography" className="text-xl hover:text-gray-300 transition-colors font-medium">
                MUSIC
              </Link>
              <Link href="/events" className="text-xl hover:text-gray-300 transition-colors font-medium">
                EVENTS
              </Link>
              <Link href="/contact" className="text-xl hover:text-gray-300 transition-colors font-medium">
                CONTACT
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

