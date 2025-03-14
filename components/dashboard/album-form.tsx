"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Upload } from "lucide-react"

interface AlbumFormProps {
  albumId?: string
}

export function AlbumForm({ albumId }: AlbumFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    releaseDate: "2023-03", // HTML month input format
    streamingLink: "",
    platform: "spotify",
    coverImage: "/placeholder.svg?height=300&width=300",
  })

  useEffect(() => {
    if (albumId) {
      // In a real app, you would fetch the album data from your API
      // This is just mock data for demonstration
      const mockAlbum = {
        id: albumId,
        title: "Midnight Dreams",
        releaseDate: "2023-03", // HTML month input format
        streamingLink: "https://spotify.com/album/midnight-dreams",
        platform: "spotify",
        coverImage: "/placeholder.svg?height=300&width=300",
      }

      setFormData(mockAlbum)
    }
  }, [albumId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, platform: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // In a real app, you would send the data to your API
    setTimeout(() => {
      setIsLoading(false)
      router.push("/admin/albums")
    }, 1000)
  }

  // Function to format date from HTML month input (YYYY-MM) to M-YYYY for display
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return ""
    const [year, month] = dateString.split("-")
    // Remove leading zero from month if present
    const formattedMonth = month.replace(/^0/, "")
    return `${formattedMonth}-01-${year}`
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-col items-center space-y-4 md:flex-row md:space-x-4 md:space-y-0">
            <div className="relative h-40 w-40 overflow-hidden rounded-md">
              <Image src={formData.coverImage || "/placeholder.svg"} alt="Album cover" fill className="object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100">
                <Button variant="secondary" size="sm" type="button">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </Button>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Album Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter album title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="releaseDate">Release Date (M-DD-YYYY)</Label>
                <Input
                  id="releaseDate"
                  name="releaseDate"
                  type="month"
                  value={formData.releaseDate}
                  onChange={handleChange}
                  required
                />
                {formData.releaseDate && (
                  <p className="text-xs text-muted-foreground">
                    Will be displayed as: {formatDateForDisplay(formData.releaseDate)}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="streamingLink">Streaming Link</Label>
                <Input
                  id="streamingLink"
                  name="streamingLink"
                  placeholder="https://example.com/album"
                  value={formData.streamingLink}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Streaming Platform</Label>
            <RadioGroup value={formData.platform} onValueChange={handleRadioChange} className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="spotify" id="spotify" />
                <Label htmlFor="spotify">Spotify</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="soundcloud" id="soundcloud" />
                <Label htmlFor="soundcloud">SoundCloud</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/albums")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : albumId ? "Update Album" : "Create Album"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

