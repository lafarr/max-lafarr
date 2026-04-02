'use client';

import type React from "react";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Album } from '@/lib/queries';

type AlbumShowcaseProps = {
  albums: Album[];
}

export function AlbumShowcase({ albums }: AlbumShowcaseProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {albums.map((album, i) => (
        <motion.div
          key={album.id}
          className="group"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{
            duration: 0.6,
            delay: i * 0.1,
            ease: [0.21, 0.47, 0.32, 0.98],
          }}
        >
          <Link href="/discography" className="block">
            <div className="relative aspect-square overflow-hidden rounded-sm">
              <Image
                src={album.album_cover ?? ''}
                alt={album.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500" />
            </div>
            <div className="mt-4 space-y-1">
              <p className="text-white font-medium tracking-wide text-sm">{album.title}</p>
              <p className="text-zinc-500 text-xs tracking-widest uppercase">{album.release_date}</p>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
