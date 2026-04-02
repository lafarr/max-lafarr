'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { StaggerContainer, StaggerItem } from '@/components/animations';
import { motion } from 'framer-motion';
import type { Album } from '@/lib/queries';

interface AlbumDialogGridProps {
  albums: Album[];
}

function renderEmbed(album: Album) {
  if (album.streaming_platform === 'soundcloud') {
    return (
      <iframe
        width="100%"
        height="500"
        scrolling="no"
        frameBorder="no"
        src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(album.streaming_link)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`}
        className="rounded-md"
      />
    );
  }
  return (
    <iframe
      src={`https://open.spotify.com/embed/album/${album.streaming_link}`}
      width="100%"
      height="500"
      frameBorder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      className="rounded-md"
    />
  );
}

export function AlbumDialogGrid({ albums }: AlbumDialogGridProps) {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

  return (
    <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-0">
      {albums.map((album) => (
        <StaggerItem key={album.id}>
          <Dialog>
            <DialogTrigger asChild>
              <motion.div
                className="cursor-pointer"
                onClick={() => setSelectedAlbum(album)}
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className="relative aspect-square overflow-hidden rounded-lg">
                  <Image
                    src={album.album_cover ?? ''}
                    alt={album.title}
                    className="object-cover md:scale-[0.835] rounded-lg"
                    width={500}
                    height={500}
                  />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all duration-300 rounded-lg" />
                </div>
              </motion.div>
            </DialogTrigger>
            <DialogContent className="text-white max-w-4xl bg-transparent border-none">
              <DialogTitle className="sr-only">
                {selectedAlbum?.title ?? 'Album Player'}
              </DialogTitle>
              {selectedAlbum && (
                <div className="w-full">{renderEmbed(selectedAlbum)}</div>
              )}
            </DialogContent>
          </Dialog>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
