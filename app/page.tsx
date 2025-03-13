'use client';

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function Home() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement newsletter signup logic
    setSubscribed(true)
    setEmail("")
  }

  return (
    <main
      className="min-h-screen bg-black text-white relative flex items-center justify-center"
      style={{
        backgroundImage: `url('https://scontent-ord5-2.xx.fbcdn.net/v/t39.30808-6/362622283_10161863852524893_7292756329538877753_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=f727a1&_nc_ohc=c-U5vPe8-yEQ7kNvgFFq0JS&_nc_oc=AdgQSaxzlhZjP94nXpJi5dp62kfcXew-CRtyDvnm4Q2l0LZk86kACYKEqsl1R69Zc_xrcL7h_02dhnBz1sUzwqdV&_nc_zt=23&_nc_ht=scontent-ord5-2.xx&_nc_gid=AV_QdHt-H-in39HGoSJe2KG&oh=00_AYEGUgbctoi3Ew9eJ-ZPCXWHUJ05RlkTHvD7rV8rlgjWXg&oe=67D88851')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        filter: "grayscale(100%)",
      }}
    >
      {/* Dark overlay with gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/70 to-black/80"></div>

      <div className="container px-4 flex flex-col items-center justify-center text-center space-y-12 relative z-10">
        <h1 className="artist-name text-6xl md:text-8xl font-normal leading-none animate-fade-in">MAX LAFARR</h1>

        <p className="text-xl md:text-2xl max-w-2xl mx-auto text-gray-200 font-light tracking-wide animate-fade-in delay-100">
          I play a little bit of everything.
        </p>

        <div className="flex flex-wrap gap-6 justify-center mt-8 animate-fade-in delay-200">
          <Button
            asChild
            size="lg"
            className="bg-white text-black hover:bg-gray-200 font-medium px-12 py-6 rounded-full text-base"
          >
            <Link href="/discography">LISTEN</Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-medium px-12 py-6 rounded-full text-base"
          >
            <Link href="/events">EVENTS</Link>
          </Button>
        </div>

        <div className="w-full max-w-md mx-auto mt-16 animate-fade-in delay-300">
          {!subscribed ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-lg text-gray-300 mb-6">
                Stay updated with new releases, upcoming shows, and other content
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 rounded-full px-6"
                />
                <Button 
                  type="submit"
                  className="bg-white text-black hover:bg-gray-200 rounded-full whitespace-nowrap px-8"
                >
                  Subscribe
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-green-400 text-lg animate-fade-in">
              Thanks for subscribing! Check your email to confirm.
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

