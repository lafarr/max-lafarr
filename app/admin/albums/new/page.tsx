import { AlbumForm } from "@/components/dashboard/album-form"

export default function NewAlbumPage() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Add New Album</h2>
      <AlbumForm />
    </div>
  )
}

