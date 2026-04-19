'use client';

import type React from "react";

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { StaggerContainer, StaggerItem } from '@/components/animations';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import type { Album } from '@/lib/queries';

type AlbumDialogGridProps = {
  albums: Album[];
}

function getEmbedSrc(album: Album): string {
  if (album.streaming_platform === 'soundcloud') {
    return `https://w.soundcloud.com/player/?url=${encodeURIComponent(album.streaming_link)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`;
  }
  return `https://open.spotify.com/embed/album/${album.streaming_link}`;
}

function AlbumCard({ album }: { album: Album }): React.JSX.Element {
  const [preload, setPreload] = useState(false);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const src = getEmbedSrc(album);
  const showIframe = preload || open;

  const handleHover = useCallback(() => {
    setPreload(true);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.div
          className="group cursor-pointer"
          whileHover={{ scale: 1.03, y: -6 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          onPointerEnter={handleHover}
        >
          <div className="relative overflow-hidden rounded-[1.4rem] border border-white/8 bg-white/[0.03] transition-all duration-500 hover:border-white/20 hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]">
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={album.album_cover ?? ''}
                alt={album.title}
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                width={500}
                height={500}
                loading="eager"
              />
            </div>
          </div>
        </motion.div>
      </DialogTrigger>

      {showIframe && !open && (
        <iframe
          src={src}
          className="absolute w-0 h-0 overflow-hidden opacity-0 pointer-events-none"
          aria-hidden="true"
          tabIndex={-1}
          title={`Preload ${album.title}`}
        />
      )}

      <DialogContent className="max-w-5xl border-none bg-transparent p-0 text-white shadow-none">
        <DialogTitle className="sr-only">
          {album.title}
        </DialogTitle>
        <div>
          <div className="relative w-full overflow-hidden rounded-[1.4rem] border border-white/10 bg-black/50 p-2">
            {!loaded && (
              <div className="absolute inset-2 flex items-center justify-center rounded-[1rem] bg-zinc-900/80" style={{ height: 500 }}>
                <Loader2 className="h-8 w-8 text-zinc-500 animate-spin" />
              </div>
            )}
            <iframe
              src={src}
              width="100%"
              height="500"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              className="rounded-[1rem] border-0"
              title={`${album.title} on ${album.streaming_platform === 'soundcloud' ? 'SoundCloud' : 'Spotify'}`}
              onLoad={() => { setLoaded(true); }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function AlbumDialogGrid({ albums }: AlbumDialogGridProps): React.JSX.Element {
  return (
    <StaggerContainer className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {albums.map((album) => (
        <StaggerItem key={album.id}>
          <AlbumCard album={album} />
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
