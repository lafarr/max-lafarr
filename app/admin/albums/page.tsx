import { Button } from "@/components/ui/button"
import { AlbumsGrid } from "@/components/dashboard/albums-grid"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

export default function AlbumsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Albums</h2>
        <Button asChild>
          <Link href="/admin/albums/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Album
          </Link>
        </Button>
      </div>
      <AlbumsGrid />
    </div>
  )
}

