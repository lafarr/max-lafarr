import type React from "react";

import { AlbumForm } from "@/components/dashboard/album-form"
import { getAlbumById } from "@/lib/queries"
import { notFound } from "next/navigation"

export default async function EditAlbumPage({ params }: { params: Promise<{ id: string }> }): Promise<React.JSX.Element> {
  const { id } = await params;
  const albums = await getAlbumById(parseInt(id));

  if (albums.length === 0) {
    notFound();
  }

  const album = albums[0];

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Edit Album</h2>
      <AlbumForm albumId={id} initialAlbum={album} />
    </div>
  )
}
