"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

// Album data from the Ghost Pavilion Spotify
const albums = [
  {
    id: "1",
    title: "The Adventure",
    year: "2025",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/c7/3b/9b/c73b9b38-34f9-cf41-2def-b4fcc00f472a/198999712476.jpg/316x316bb.webp",
    spotifyId: "5QlSo5Hgas50pzaufIlIxa",
  },
  {
    id: "9",
    title: "Inferno",
    year: "2024",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/f3/74/fb/f374fb31-2874-f82f-cdd6-b8c1b8932554/198999517514.jpg/316x316bb.webp",
    spotifyId: "4h255Kgs1OqArb7Dhym4aY",
  },
  {
    id: "10",
    title: "Død og Oppblåst",
    year: "2024",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/1e/dd/cc/1eddcc02-cdd1-5762-249c-dbe280c63b5b/198595868072.jpg/316x316bb.webp",
    spotifyId: "2mjC9csH3LiC1Fhla1SUJK",
  },
  {
    id: "11",
    title: "Children of Nothing",
    year: "2024",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/d0/9d/6d/d09d6d0c-b348-d0bc-3b50-d10e2605cb83/198595056196.jpg/316x316bb.webp",
    spotifyId: "6Q9OaZ0GaHke8wulfsiKTl",
  },
  {
    id: "12",
    title: "Exploration into Human Agony",
    year: "2024",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/05/fe/31/05fe3107-5e4d-558e-7af7-69dd62b4d38f/198595397183.jpg/316x316bb.webp",
    spotifyId: "2XjtIwoPhpN3U2vq3DunH3",
  },
  {
    id: "13",
    title: "Portrait of Misery",
    year: "2024",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/df/6c/01/df6c0153-f794-3627-8b86-5f5527f65f79/198500833102.jpg/316x316bb.webp",
    spotifyId: "1PoXfPAHx5pBfQRDaHF0S4",
  },
  {
    id: "14",
    title: "The Fall of Man",
    year: "2024",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/d0/6a/35/d06a35bb-7352-8d16-5782-5d622dcd7aab/198595226438.jpg/316x316bb.webp",
    spotifyId: "4Ug5QckLM0Yxk2qsYbbpuA",
  },
  {
    id: "2",
    title: "The Werewolf Dance",
    year: "2024",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/14/47/79/14477952-07f8-4c9d-1171-9fbdd662cd7d/198999182743.jpg/316x316bb.webp",
    spotifyId: "7cFrgjHXIU8zD7Njt0wVoW",
  },
  {
    id: "3",
    title: "The Zappa Ripoff Project",
    year: "2024",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/1f/4e/5d/1f4e5de2-9dae-6708-075e-72db2f054a1a/198595397190.jpg/316x316bb.webp",
    spotifyId: "1jDD7KouXq0tk502qfh3cX",
  },
  {
    id: "4",
    title: "Weevil",
    year: "2024",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/18/c0/a0/18c0a006-7461-8eee-0e53-09e414c0c43e/198595335338.jpg/316x316bb.webp",
    spotifyId: "594PD2BKlLPwOHkexBtQ39",
  },
  {
    id: "5",
    title: "There's Nothin' Wrong (With Workin' the Prostate)",
    year: "2024",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/12/06/b8/1206b8d0-e816-a7f6-d63d-bd7d60a1a393/198595265420.jpg/316x316bb.webp",
    spotifyId: "5CaRUSX7yBec7ZMHa10O03",
  },
  {
    id: "6",
    title: "Enchiridion",
    year: "2024",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/e3/e2/bd/e3e2bdcf-0fdc-373b-c5f4-932ba596abf3/198500367553.jpg/316x316bb.webp",
    spotifyId: "573I4X3cdEDY0nJ4IpVoom",
  },
  {
    id: "7",
    title: "Rock All Night (And Fish All Day)",
    year: "2023",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/b8/fc/f8/b8fcf89b-44d4-cbd6-30b1-30170e70f296/198025211379.jpg/316x316bb.webp",
    spotifyId: "57G2yVSUcL7Hn1P5tXyBBr",
  },
  {
    id: "8",
    title: "Carpeted Bathroom",
    year: "2023",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/23/b7/50/23b750d2-eb81-033c-f308-af24ccb0882e/198015933175.jpg/316x316bb.webp",
    spotifyId: "09TctObtlADg0yHqRy68DB",
  },
]

export default function DiscographyPage() {
  const [selectedAlbum, setSelectedAlbum] = useState<(typeof albums)[0] | null>(null)

  return (
    <main className="min-h-screen bg-black text-white py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center">DISCOGRAPHY</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-0">
          {albums.map((album) => (
            <Dialog key={album.id}>
              <DialogTrigger asChild>
                <div className="cursor-pointer group" onClick={() => setSelectedAlbum(album)}>
                  <div className="relative aspect-square overflow-hidden rounded-lg">
                    <Image
                      src={album.cover || "/placeholder.svg"}
                      alt={album.title}
                      fill 
                      className="object-cover hover:opacity-50 transition-all duration-300 md:scale-[0.835] rounded-lg"
                    />
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="text-white max-w-4xl bg-transparent border-none">
                <DialogTitle className="sr-only">Hello</DialogTitle>
                {selectedAlbum && (
                  <div className="w-full">
                    <iframe
                      src={`https://open.spotify.com/embed/album/${selectedAlbum.spotifyId}`}
                      width="100%"
                      height="500"
                      frameBorder="0"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      className="rounded-md"
                    ></iframe>
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

