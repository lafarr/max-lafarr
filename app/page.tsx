import type React from 'react';
import Image from 'next/image';
import { getAlbums, getEvents } from '@/lib/queries';
import { PressLink } from '@/components/ui/press-link';
import { LiveHomeSections } from '@/components/homepage/live-home-sections';
import { NewsletterSignup } from '@/components/homepage/newsletter-signup';

export default async function Home(): Promise<React.JSX.Element> {
  const [albums, events] = await Promise.all([getAlbums(), getEvents()]);

  return (
    <main className="overflow-hidden bg-black text-white">
      {/* ── HERO ── */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden film-grain">
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
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
          {/* Warm cinematic light leak from top-left */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,hsl(38_60%_48%/0.12),transparent_50%)]" />
        </div>
        {/* Subtle top highlight + bottom amber warmth */}
        <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_28%),radial-gradient(ellipse_at_bottom,hsl(38_55%_55%/0.06),transparent_40%)]" />

        <div className="relative z-20 mx-auto flex w-full max-w-6xl flex-col items-center px-4 pb-14 pt-24 text-center sm:pb-20 sm:pt-28">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-5 py-2.5 text-[0.62rem] uppercase tracking-[0.38em] text-white/60 backdrop-blur-md">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[hsl(38,55%,55%)] shadow-[0_0_8px_hsl(38,55%,55%)]" />
            Official Site
          </p>

          <div>
            <h1
              className="artist-name flex flex-wrap justify-center text-center text-6xl font-normal leading-[0.84] tracking-[-0.035em] text-white drop-shadow-[0_20px_50px_rgba(0,0,0,0.75)] sm:text-8xl md:text-9xl lg:text-[10rem]"
              aria-label="MAX LAFARR"
            >
              {'MAX LAFARR'.split('').map((char, i) => (
                <span
                  key={i}
                  className={char === ' ' ? 'w-4 sm:w-8 md:w-12 lg:w-16' : 'inline-block'}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </h1>
          </div>

          <p className="mt-6 text-[0.72rem] uppercase tracking-[0.5em] text-white/50 sm:text-sm md:text-base">
            Multi-Instrumentalist <span className="text-amber-accent">•</span> Songwriter <span className="text-amber-accent">•</span> Live Performer
          </p>

          <p className="mx-auto mt-6 max-w-2xl text-sm font-light leading-7 text-white/50 sm:text-base md:leading-8">
				Guitarist and songwriter for: JÖRMUNGANDR, Children of Nothing, Tom Foolery &amp; The Silly Guys, Ashtaroth, Nepo Babies
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:mt-12 sm:flex-row">
            <PressLink
              href="/discography"
              className="group rounded-full border border-white bg-white px-7 py-3.5 text-[0.68rem] font-medium uppercase tracking-[0.32em] text-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-20px_rgba(255,255,255,0.3)]"
            >
              Explore Releases
            </PressLink>
            <PressLink
              href="/events"
              className="rounded-full border border-white/12 bg-white/[0.05] px-7 py-3.5 text-[0.68rem] font-medium uppercase tracking-[0.32em] text-white/70 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.09] hover:text-white"
            >
              View Shows
            </PressLink>
            <PressLink
              href="/contact"
              className="rounded-full border border-white/12 bg-white/[0.05] px-7 py-3.5 text-[0.68rem] font-medium uppercase tracking-[0.32em] text-white/70 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.09] hover:text-white"
            >
              Booking Info
            </PressLink>
          </div>

          <div className="mt-12 grid w-full max-w-4xl gap-3 sm:mt-14 sm:grid-cols-3">
            {[
              { label: 'Sound', value: 'Cinematic folk with edge' },
              { label: 'Based In', value: 'Queensbury, New York' },
              { label: 'Available For', value: 'Shows, sessions, collabs' },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-[1.5rem] border border-white/8 bg-black/30 px-5 py-4 text-left backdrop-blur-md transition-colors duration-500 hover:border-white/15"
              >
                <p className="text-[0.62rem] uppercase tracking-[0.34em] text-amber-accent/70">{item.label}</p>
                <p className="mt-2 text-sm text-white/75">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LiveHomeSections initialAlbums={albums} initialEvents={events} />

      {/* ── NEWSLETTER ── */}
      <section className="relative py-32 md:py-40">
        <div className="section-divider absolute inset-x-0 top-0" />
        {/* Dramatic centered amber glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(38_55%_55%/0.08),transparent_50%)]" />
        <div className="container mx-auto px-4 text-center">
          <div className="relative">
            <p className="mb-6 text-xs uppercase tracking-[0.34em] text-amber-accent/60">Stay Connected</p>
            <h2 className="artist-name mb-4 text-4xl md:text-6xl lg:text-7xl">NEVER MISS A BEAT</h2>
            <p className="mx-auto mb-12 max-w-xl text-sm font-light leading-7 text-zinc-500 md:text-base">
              New music, upcoming shows, and the occasional behind-the-scenes dispatch — delivered without the noise.
            </p>
            <NewsletterSignup />
          </div>
        </div>
      </section>
    </main>
  );
}
