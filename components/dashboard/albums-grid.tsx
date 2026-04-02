"use client"

import type React from "react";

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Edit, Search, Trash, AlertCircle } from "lucide-react"
import { type Album, deleteAlbumById } from "@/lib/actions"
import { ConfirmationDialog } from "./confirmation_dialog"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"

type AlbumsGridProps = {
  initialAlbums: Album[];
}

export function AlbumsGrid({ initialAlbums }: AlbumsGridProps): React.JSX.Element {
  const [searchTerm, setSearchTerm] = useState("")
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [albumToDelete, setAlbumToDelete] = useState<number | undefined>(undefined);
  const [deleteError, setDeleteError] = useState(false);
  const router = useRouter();

  const filteredAlbums = initialAlbums.filter(
    (album) =>
      album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      album.release_date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      album.streaming_platform.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  function handleDelete(): void {
    const id = albumToDelete;
    if (id !== undefined) {
      setDeleteError(false);
      deleteAlbumById(id)
        .then(() => {
          router.refresh();
        })
        .catch((error: unknown) => {
          console.error("Error deleting album:", error);
          setDeleteError(true);
        });
    }
  }

  return (
    <div className="space-y-4">
      {deleteError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            We encountered an error while deleting the album. Please try again later.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search albums by title, date, or platform..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAlbums.map((album) => (
          <Card key={album.id} className="overflow-hidden">
            <div className="relative aspect-square">
              <Image src={album.album_cover ?? "/placeholder.svg"} alt={album.title} fill className="object-cover" />
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-1">{album.title}</h3>
              <p className="text-sm text-muted-foreground">Released: {album.release_date}</p>
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">Platform: {album.streaming_platform}</p>
                <p className="text-xs text-muted-foreground truncate mt-1">
                  {album.streaming_platform === 'spotify' ? 'Spotify ID: ' : 'SoundCloud link: '}
                  {album.streaming_link}
                </p>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
              <Button variant="outline" size="sm" onClick={() => { if (album.id != null) { router.push(`/admin/albums/${album.id}/edit`); } }}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="ghost" size="icon" onClick={() => { if (album.id != null) { setAlbumToDelete(album.id); setShowDeleteModal(true); } }}>
                <Trash className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {showDeleteModal && (
        <ConfirmationDialog
          confirmationButtonColor="bg-red-500"
          confirmationText="Delete Album"
          confirmationAction={() => { handleDelete(); setShowDeleteModal(false); }}
        />
      )}
    </div>
  );
}
