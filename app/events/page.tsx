import type React from "react";

import { getEvents } from '@/lib/queries';
import { FadeUp, SlideIn } from '@/components/animations';
import { LiveEventsPageContent } from '@/components/events/live-events-page-content';

export default async function EventsPage(): Promise<React.JSX.Element> {
  const events = await getEvents();

  return (
    <main className="relative min-h-screen overflow-hidden bg-black py-24 text-white md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_10%,hsl(38_55%_55%/0.05),transparent_45%),radial-gradient(circle_at_20%_60%,rgba(255,255,255,0.03),transparent_40%)]" />
      <div className="container relative mx-auto px-4">
        <div className="relative">
          <SlideIn direction="left">
            <p className="mb-3 text-xs uppercase tracking-[0.34em] text-amber-accent/60">Live Dates</p>
          </SlideIn>
          <SlideIn direction="left">
            <h1 className="artist-name text-5xl md:text-7xl lg:text-8xl">UPCOMING EVENTS</h1>
          </SlideIn>
          <FadeUp delay={0.15}>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-500 md:text-base">
              Tour stops, local sets, and new rooms to fill with noise. Find the next show and lock in your ticket.
            </p>
          </FadeUp>

          <div className="section-divider mt-14 sm:mt-16 mb-14" />

          <div className="mx-auto max-w-5xl">
            <LiveEventsPageContent initialEvents={events} />
          </div>
        </div>
      </div>
    </main>
  );
}
