import { AlbumForm } from "@/components/dashboard/album-form"

export default function EditAlbumPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Edit Album</h2>
      <AlbumForm albumId={params.id} />
    </div>
  )
}

