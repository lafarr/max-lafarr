import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FadeUp, ParallaxHero } from '@/components/animations';
import { HeroHeading } from '@/components/homepage/hero-heading';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white relative flex items-center justify-center overflow-hidden">
      {/* Parallax background */}
      <div className="absolute inset-0 z-0">
        <ParallaxHero className="w-full h-full">
          <div
            className="w-full h-[130%] grayscale"
            style={{
              backgroundImage: `url('https://7x0zshh65t.ufs.sh/f/ef0jRbxJDgdLgzL7khE4tsQJRIvCa1LTgcr0kupZWVyxfOoj')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </ParallaxHero>
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/70 to-black/80 z-10" />

      {/* Content */}
      <div className="container px-4 flex flex-col items-center justify-center text-center space-y-12 relative z-20">
        <HeroHeading />

        <FadeUp delay={0.4}>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto text-gray-200 font-light tracking-wide">
            I play a little bit of everything.
          </p>
        </FadeUp>

        <FadeUp delay={0.6}>
          <div className="flex flex-wrap gap-6 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-black hover:bg-gray-200 font-medium px-12 py-6 rounded-full text-base transition-all hover:scale-105 active:scale-95"
            >
              <Link href="/discography">LISTEN</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-medium px-12 py-6 rounded-full text-base transition-all hover:scale-105 active:scale-95"
            >
              <Link href="/events">EVENTS</Link>
            </Button>
          </div>
        </FadeUp>
      </div>
    </main>
  );
}
