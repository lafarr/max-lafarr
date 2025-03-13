'use client';

import type React from 'react';

import { useQuery } from 'convex/react';
import { FadeUp } from '@/components/animations';
import { AlbumDialogGrid } from '@/components/discography/album-dialog-grid';
import { api } from '@/convex/_generated/api';
import { sortAlbumsByReleaseDateDesc } from '@/lib/music';
import type { Album } from '@/lib/queries';

type LiveDiscographyContentProps = {
  initialAlbums: Album[];
};

export function LiveDiscographyContent({ initialAlbums }: LiveDiscographyContentProps): React.JSX.Element {
  const albums = sortAlbumsByReleaseDateDesc(useQuery(api.music.listAlbums) ?? initialAlbums);

  if (albums.length === 0) {
    return (
      <FadeUp>
        <div className="rounded-[1.6rem] border border-dashed border-white/8 bg-white/[0.02] px-6 py-16 text-center text-zinc-600">
          No albums yet. Check back soon.
        </div>
      </FadeUp>
    );
  }

  return <AlbumDialogGrid albums={albums} />;
}
