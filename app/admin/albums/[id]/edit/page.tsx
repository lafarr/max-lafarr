import { AlbumForm } from "@/components/dashboard/album-form"

export default async function EditAlbumPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Edit Album</h2>
      <AlbumForm albumId={id} />
    </div>
  )
}
