import type React from "react";

import { getAlbums } from '@/lib/queries';
import { FadeUp, SlideIn } from '@/components/animations';
import { LiveDiscographyContent } from '@/components/discography/live-discography-content';

export default async function DiscographyPage(): Promise<React.JSX.Element> {
  const albums = await getAlbums();

  return (
    <main className="relative min-h-screen overflow-hidden bg-black py-24 text-white md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_10%,hsl(38_55%_55%/0.06),transparent_45%),radial-gradient(circle_at_80%_60%,rgba(255,255,255,0.03),transparent_40%)]" />
      <div className="container relative mx-auto px-4">
        <div className="relative">
          <SlideIn direction="left">
            <p className="mb-3 text-xs uppercase tracking-[0.34em] text-amber-accent/60">Recorded Work</p>
          </SlideIn>
          <SlideIn direction="left">
            <h1 className="artist-name text-5xl md:text-7xl lg:text-8xl">DISCOGRAPHY</h1>
          </SlideIn>
          <FadeUp delay={0.15}>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-500 md:text-base">
              A growing catalog built for headphones, speakers, and the spaces in between. Open any release to listen in full.
            </p>
          </FadeUp>

          <div className="section-divider mt-14 sm:mt-16 mb-14" />

          <div className="mt-0">
            <LiveDiscographyContent initialAlbums={albums} />
          </div>
        </div>
      </div>
    </main>
  );
}
