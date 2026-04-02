import { AlbumForm } from "@/components/dashboard/album-form"
import { getAlbumById } from "@/lib/queries"
import { notFound } from "next/navigation"

export default async function EditAlbumPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const albums = await getAlbumById(parseInt(id));
  const album = albums[0];

  if (!album) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Edit Album</h2>
      <AlbumForm albumId={id} initialAlbum={album} />
    </div>
  )
}
