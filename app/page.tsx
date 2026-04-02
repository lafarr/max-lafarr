import type React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, MapPin } from 'lucide-react';
import { getAlbums, getEvents } from '@/lib/queries';
import { FadeUp } from '@/components/animations';
import { HeroHeading } from '@/components/homepage/hero-heading';
import { ScrollIndicator } from '@/components/homepage/scroll-indicator';
import { AlbumShowcase } from '@/components/homepage/album-showcase';
import { NewsletterSignup } from '@/components/homepage/newsletter-signup';

function formatEventDate(date: string): string {
  const [year, month, day] = date.split('-');
  const d = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default async function Home(): Promise<React.JSX.Element> {
  const [albums, events] = await Promise.all([getAlbums(), getEvents()]);

  // Get upcoming events (future dates only), sorted ascending
  const now = new Date();
  const upcomingEvents = events
    .filter((e) => new Date(e.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <main className="bg-black text-white">
      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden film-grain">
        {/* Parallax background */}
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full">
            <Image
              src="https://7x0zshh65t.ufs.sh/f/ef0jRbxJDgdLgzL7khE4tsQJRIvCa1LTgcr0kupZWVyxfOoj"
              alt=""
              fill
              priority
              className="object-cover object-center scale-110"
            />
          </div>
          {/* Cinematic gradient — darker edges, subtle vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
        </div>

        {/* Hero content */}
        <div className="relative z-20 text-center px-4">
          <HeroHeading />

          <FadeUp delay={0.6}>
            <p className="mt-6 text-lg md:text-xl text-white/60 font-light tracking-[0.15em] uppercase">
              Multi-instrumentalist
            </p>
          </FadeUp>

          <FadeUp delay={0.8}>
            <div className="flex gap-8 justify-center mt-12">
              <Link
                href="/discography"
                className="text-xs tracking-[0.3em] uppercase text-white/70 hover:text-white border-b border-white/20 hover:border-white pb-2 transition-all duration-300"
              >
                Listen
              </Link>
              <Link
                href="/events"
                className="text-xs tracking-[0.3em] uppercase text-white/70 hover:text-white border-b border-white/20 hover:border-white pb-2 transition-all duration-300"
              >
                Shows
              </Link>
              <Link
                href="/contact"
                className="text-xs tracking-[0.3em] uppercase text-white/70 hover:text-white border-b border-white/20 hover:border-white pb-2 transition-all duration-300"
              >
                Contact
              </Link>
            </div>
          </FadeUp>
        </div>

        <ScrollIndicator />
      </section>

      {/* ─── LATEST RELEASES ──────────────────────────────────────────── */}
      {albums.length > 0 && (
        <section className="py-24 md:py-32">
          <div className="container mx-auto px-4">
            <FadeUp>
              <div className="flex items-end justify-between mb-12">
                <div>
                  <p className="text-xs tracking-[0.3em] uppercase text-zinc-500 mb-3">Latest</p>
                  <h2 className="artist-name text-4xl md:text-5xl">RELEASES</h2>
                </div>
                <Link
                  href="/discography"
                  className="text-xs tracking-[0.2em] uppercase text-zinc-500 hover:text-white border-b border-zinc-800 hover:border-white pb-1 transition-all duration-300 hidden md:block"
                >
                  View All
                </Link>
              </div>
            </FadeUp>

            <AlbumShowcase albums={albums.slice(0, 5)} />

            <FadeUp>
              <div className="mt-8 text-center md:hidden">
                <Link
                  href="/discography"
                  className="text-xs tracking-[0.2em] uppercase text-zinc-500 hover:text-white border-b border-zinc-800 hover:border-white pb-1 transition-all duration-300"
                >
                  View All Releases
                </Link>
              </div>
            </FadeUp>
          </div>
        </section>
      )}

      {/* ─── UPCOMING EVENTS ──────────────────────────────────────────── */}
      {upcomingEvents.length > 0 && (
        <section className="py-24 md:py-32 border-t border-white/5">
          <div className="container mx-auto px-4">
            <FadeUp>
              <div className="flex items-end justify-between mb-16">
                <div>
                  <p className="text-xs tracking-[0.3em] uppercase text-zinc-500 mb-3">Upcoming</p>
                  <h2 className="artist-name text-4xl md:text-5xl">SHOWS</h2>
                </div>
                <Link
                  href="/events"
                  className="text-xs tracking-[0.2em] uppercase text-zinc-500 hover:text-white border-b border-zinc-800 hover:border-white pb-1 transition-all duration-300 hidden md:block"
                >
                  View All
                </Link>
              </div>
            </FadeUp>

            <div className="space-y-0 divide-y divide-white/5">
              {upcomingEvents.map((event, i) => (
                <FadeUp key={event.id} delay={i * 0.1}>
                  <div className="group py-8 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors px-2 -mx-2">
                    <div className="flex-1">
                      <h3 className="text-xl md:text-2xl font-medium tracking-wide mb-2 group-hover:text-white transition-colors">
                        {event.name}
                      </h3>
                      <div className="flex flex-wrap gap-6 text-zinc-500 text-sm">
                        <span className="flex items-center gap-2">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {formatEventDate(event.date)}
                        </span>
                        <span className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5" />
                          {event.location}
                        </span>
                      </div>
                    </div>
                    {event.ticket_link != null && event.ticket_link !== '' && (
                      <Link
                        href={event.ticket_link}
                        target="_blank"
                        className="text-xs tracking-[0.2em] uppercase text-white/60 hover:text-white border border-white/20 hover:border-white px-6 py-2.5 transition-all duration-300 w-fit"
                      >
                        Tickets
                      </Link>
                    )}
                  </div>
                </FadeUp>
              ))}
            </div>

            <FadeUp>
              <div className="mt-8 text-center md:hidden">
                <Link
                  href="/events"
                  className="text-xs tracking-[0.2em] uppercase text-zinc-500 hover:text-white border-b border-zinc-800 hover:border-white pb-1 transition-all duration-300"
                >
                  View All Events
                </Link>
              </div>
            </FadeUp>
          </div>
        </section>
      )}

      {/* ─── NEWSLETTER CTA ───────────────────────────────────────────── */}
      <section className="py-24 md:py-32 border-t border-white/5">
        <div className="container mx-auto px-4 text-center">
          <FadeUp>
            <p className="text-xs tracking-[0.3em] uppercase text-zinc-500 mb-6">Stay Connected</p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="artist-name text-3xl md:text-4xl mb-4">NEVER MISS A BEAT</h2>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-zinc-500 text-sm font-light mb-10 max-w-sm mx-auto">
              New music, tour dates, and exclusive content — straight to your inbox.
            </p>
          </FadeUp>
          <NewsletterSignup />
        </div>
      </section>
    </main>
  );
}
