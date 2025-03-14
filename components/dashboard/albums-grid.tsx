"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Edit, Search, Trash } from "lucide-react"

const albums = [
  {
    id: "1",
    title: "Midnight Dreams",
    releaseDate: "3-15-2023",
    coverImage: "/placeholder.svg?height=300&width=300",
    streamingLink: "https://spotify.com/album/midnight-dreams",
    platform: "Spotify",
  },
  {
    id: "2",
    title: "Ocean Waves",
    releaseDate: "1-20-2023",
    coverImage: "/placeholder.svg?height=300&width=300",
    streamingLink: "https://soundcloud.com/coastal-sounds/ocean-waves",
    platform: "SoundCloud",
  },
  {
    id: "3",
    title: "Urban Jungle",
    releaseDate: "11-05-2022",
    coverImage: "/placeholder.svg?height=300&width=300",
    streamingLink: "https://spotify.com/album/urban-jungle",
    platform: "Spotify",
  },
  {
    id: "4",
    title: "Mountain Echo",
    releaseDate: "9-30-2022",
    coverImage: "/placeholder.svg?height=300&width=300",
    streamingLink: "https://soundcloud.com/alpine-trio/mountain-echo",
    platform: "SoundCloud",
  },
  {
    id: "5",
    title: "Electric Dreams",
    releaseDate: "7-12-2022",
    coverImage: "/placeholder.svg?height=300&width=300",
    streamingLink: "https://spotify.com/album/electric-dreams",
    platform: "Spotify",
  },
  {
    id: "6",
    title: "Desert Mirage",
    releaseDate: "5-08-2022",
    coverImage: "https://i1.sndcdn.com/artworks-z90iEhi4hH6vh2vE-AZmxiQ-t500x500.jpg",
    streamingLink: "https://soundcloud.com/sand-dunes/desert-mirage",
    platform: "SoundCloud",
  },
]

export function AlbumsGrid() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredAlbums = albums.filter(
    (album) =>
      album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      album.releaseDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      album.platform.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search albums by title, date, or platform..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAlbums.map((album) => (
          <Card key={album.id} className="overflow-hidden">
            <div className="relative aspect-square">
              <Image src={album.coverImage || "/placeholder.svg"} alt={album.title} fill className="object-cover" />
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-1">{album.title}</h3>
              <p className="text-sm text-muted-foreground">Released: {album.releaseDate}</p>
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">Platform: {album.platform}</p>
                <p className="text-xs text-muted-foreground truncate mt-1">{album.streamingLink}</p>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
              <Button variant="outline" size="sm" onClick={() => console.log(`Edit album ${album.id}`)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="ghost" size="icon" onClick={() => console.log(`Delete album ${album.id}`)}>
                <Trash className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

