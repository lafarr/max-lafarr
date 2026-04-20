'use client';

import type React from "react";

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import type { Album } from '@/lib/queries';

type AlbumShowcaseProps = {
  albums: Album[];
}

function getEmbedSrc(album: Album): string {
  if (album.streaming_platform === 'soundcloud') {
    return `https://w.soundcloud.com/player/?url=${encodeURIComponent(album.streaming_link)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`;
  }
  return `https://open.spotify.com/embed/album/${album.streaming_link}`;
}

function AlbumCard({ album }: { album: Album }): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const src = getEmbedSrc(album);

  function handleOpenChange(next: boolean): void {
    setOpen(next);
    if (!next) {
      setLoaded(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <motion.div
          className="group cursor-pointer"
          whileHover={{ scale: 1.03, y: -6 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          onPointerDown={() => { setOpen(true); }}
        >
          <div className="relative overflow-hidden rounded-[1.4rem] border border-white/8 bg-white/[0.03] transition-all duration-500 hover:border-white/20 hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]">
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={album.album_cover ?? ''}
                alt={album.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 20vw"
              />
            </div>
          </div>
        </motion.div>
      </DialogTrigger>

      <DialogContent className="max-w-5xl border-none bg-transparent p-0 text-white shadow-none">
        <DialogTitle className="sr-only">
          {album.title}
        </DialogTitle>
        <div>
          <div className="relative w-full overflow-hidden rounded-[1.4rem] border border-white/10 bg-black/90 p-2">
            {!loaded && (
              <div className="absolute inset-2 flex flex-col items-center justify-center gap-5 rounded-[1rem] bg-zinc-950" style={{ height: 500 }}>
                <div className="relative h-28 w-28 overflow-hidden rounded-2xl shadow-2xl">
                  <Image
                    src={album.album_cover ?? ''}
                    alt=""
                    width={112}
                    height={112}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 animate-pulse bg-white/[0.06]" />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <p className="text-sm font-medium tracking-[0.1em] text-white/80">{album.title}</p>
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span className="tracking-[0.2em] uppercase">Loading {album.streaming_platform === 'soundcloud' ? 'SoundCloud' : 'Spotify'}</span>
                  </div>
                </div>
              </div>
            )}
            <iframe
              src={src}
              width="100%"
              height="500"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              className={`rounded-[1rem] border-0 transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
              title={`${album.title} on ${album.streaming_platform === 'soundcloud' ? 'SoundCloud' : 'Spotify'}`}
              onLoad={() => { setLoaded(true); }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function AlbumShowcase({ albums }: AlbumShowcaseProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {albums.map((album) => (
        <AlbumCard key={album.id} album={album} />
      ))}
    </div>
  );
}
