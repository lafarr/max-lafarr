'use client';

import type React from 'react';

import { useQuery } from 'convex/react';
import { ArrowRight, CalendarDays, MapPin } from 'lucide-react';
import { FadeUp } from '@/components/animations';
import { AlbumShowcase } from '@/components/homepage/album-showcase';
import { PressLink } from '@/components/ui/press-link';
import { api } from '@/convex/_generated/api';
import { sortAlbumsByReleaseDateDesc } from '@/lib/music';
import type { Album, Event } from '@/lib/queries';

type LiveHomeSectionsProps = {
  initialAlbums: Album[];
  initialEvents: Event[];
};

function formatEventDate(date: string): string {
  const [year, month, day] = date.split('-');
  const d = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function LiveHomeSections({ initialAlbums, initialEvents }: LiveHomeSectionsProps): React.JSX.Element {
  const albums = sortAlbumsByReleaseDateDesc(useQuery(api.music.listAlbums) ?? initialAlbums);
  const events = useQuery(api.music.listEvents) ?? initialEvents;

  const now = new Date();
  const upcomingEvents = events
    .filter((event) => new Date(event.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <>
      {albums.length > 0 && (
        <section className="relative py-28 md:py-36">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,hsl(38_55%_55%/0.06),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.04),transparent_40%)]" />
          <div className="container mx-auto px-4">
            <FadeUp>
              <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="mb-3 text-xs uppercase tracking-[0.34em] text-amber-accent/60">Latest</p>
                  <h2 className="artist-name text-5xl md:text-7xl">RELEASES</h2>
                </div>
                <div className="flex max-w-md flex-col gap-6">
                  <p className="text-sm leading-7 text-zinc-500">
                    Recorded with depth, texture, and atmosphere. Step into the newest material and trace the catalog from its sharpest edges outward.
                  </p>
                  <PressLink
                    href="/discography"
                    className="group flex w-fit items-center gap-2 text-[0.72rem] uppercase tracking-[0.3em] text-white/50 transition-colors duration-300 hover:text-white"
                  >
                    Full Discography
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </PressLink>
                </div>
              </div>
            </FadeUp>

            <AlbumShowcase albums={albums.slice(0, 5)} />
          </div>
        </section>
      )}

      {upcomingEvents.length > 0 && (
        <section className="relative py-28 md:py-36">
          <div className="section-divider absolute inset-x-0 top-0" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,hsl(38_55%_55%/0.05),transparent_45%)]" />
          <div className="container mx-auto px-4">
            <FadeUp>
              <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="mb-3 text-xs uppercase tracking-[0.34em] text-amber-accent/60">Upcoming</p>
                  <h2 className="artist-name text-5xl md:text-7xl">SHOWS</h2>
                </div>
                <div className="max-w-md">
                  <p className="text-sm leading-7 text-zinc-500">
                    Upcoming dates, intimate rooms, and open-air stages. Catch the next set while the songs are still evolving in real time.
                  </p>
                </div>
              </div>
            </FadeUp>

            <div className="space-y-4">
              {upcomingEvents.map((event, i) => (
                <FadeUp key={event.id} delay={i * 0.12}>
                  <div className="group relative overflow-hidden rounded-[1.5rem] border border-white/8 bg-white/[0.02] transition-all duration-500 hover:border-white/15 hover:bg-white/[0.04]">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_left,hsl(38_55%_55%/0.04),transparent_50%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="relative flex flex-col gap-5 px-6 py-7 md:flex-row md:items-center md:justify-between md:px-8 md:py-8">
                      <div className="flex items-center gap-6 md:gap-8">
                        <div className="hidden shrink-0 md:block">
                          <p className="text-[0.62rem] uppercase tracking-[0.34em] text-zinc-600">{formatEventDate(event.date).split(',')[0]}</p>
                          <p className="artist-name mt-1 text-3xl text-amber-accent/80">
                            {new Date(event.date + 'T12:00:00').getDate()}
                          </p>
                        </div>
                        <div className="hidden h-14 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent md:block" />
                        <div className="flex-1">
                          <h3 className="mb-2 text-xl font-medium tracking-[0.06em] text-white/90 transition-colors group-hover:text-white sm:text-2xl">
                            {event.name}
                          </h3>
                          <div className="flex flex-wrap gap-4 text-sm text-zinc-500">
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
                      </div>
                      {event.ticket_link != null && event.ticket_link !== '' && (
                        <PressLink
                          href={event.ticket_link}
                          target="_blank"
                          className="w-fit rounded-full border border-white/15 bg-white/[0.06] px-6 py-3 text-[0.68rem] font-medium uppercase tracking-[0.3em] text-white/70 transition-all duration-300 hover:border-white/30 hover:bg-white/[0.1] hover:text-white"
                        >
                          Get Tickets
                        </PressLink>
                      )}
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>

            <FadeUp delay={0.3}>
              <div className="mt-10 flex justify-end">
                <PressLink
                  href="/events"
                  className="group flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.3em] text-white/50 transition-colors duration-300 hover:text-white"
                >
                  All Events
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </PressLink>
              </div>
            </FadeUp>
          </div>
        </section>
      )}
    </>
  );
}
