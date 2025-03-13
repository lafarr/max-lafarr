"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

// Album data from the Ghost Pavilion Spotify
const albums = [
  {
    id: "1",
    title: "Oblivion",
    year: "2020",
    cover: "/album-covers/oblivion.jpg",
    spotifyId: "0Ij3PxFZDuRxDybNj3qHvO",
  },
  {
    id: "2",
    title: "Bluebird",
    year: "2018",
    cover: "/album-covers/bluebird.jpg",
    spotifyId: "6Ju2Wv5BcHYsVhQYJ7QoLQ",
  },
  {
    id: "3",
    title: "Ghost Pavilion",
    year: "2016",
    cover: "/album-covers/ghost-pavilion.jpg",
    spotifyId: "3Yrp8YDfnRzoGnYIUQWLFZ",
  },
  {
    id: "4",
    title: "Traces",
    year: "2019",
    cover: "/album-covers/traces.jpg",
    spotifyId: "0Ij3PxFZDuRxDybNj3qHvO",
  },
  {
    id: "5",
    title: "Reflections",
    year: "2017",
    cover: "/album-covers/reflections.jpg",
    spotifyId: "6Ju2Wv5BcHYsVhQYJ7QoLQ",
  },
  {
    id: "6",
    title: "Echoes",
    year: "2015",
    cover: "/album-covers/echoes.jpg",
    spotifyId: "3Yrp8YDfnRzoGnYIUQWLFZ",
  },
]

export default function DiscographyPage() {
  const [selectedAlbum, setSelectedAlbum] = useState<(typeof albums)[0] | null>(null)

  return (
    <main className="min-h-screen bg-black text-white py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center">DISCOGRAPHY</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {albums.map((album) => (
            <Dialog key={album.id}>
              <DialogTrigger asChild>
                <div className="cursor-pointer group" onClick={() => setSelectedAlbum(album)}>
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={album.cover || "/placeholder.svg"}
                      alt={album.title}
                      fill
                      className="object-cover grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="bg-black border-gray-800 text-white max-w-3xl">
                {selectedAlbum && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative aspect-square">
                      <Image
                        src={selectedAlbum.cover || "/placeholder.svg"}
                        alt={selectedAlbum.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{selectedAlbum.title}</h2>
                      <p className="text-gray-400 mb-6">{selectedAlbum.year}</p>

                      <iframe
                        src={`https://open.spotify.com/embed/album/${selectedAlbum.spotifyId}`}
                        width="100%"
                        height="380"
                        frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        className="rounded-md"
                      ></iframe>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </main>
  )
}

