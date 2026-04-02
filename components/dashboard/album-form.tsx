"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Upload } from "lucide-react"
import { createAlbum, updateAlbumById } from "@/lib/actions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"
import type { Album } from "@/lib/queries"

const albumSchema = z.object({
  title: z.string().min(1, "Album title is required"),
  release_date: z.string().min(1, "Release date is required"),
  streaming_platform: z.enum(["spotify", "soundcloud"], {
    required_error: "Streaming platform is required",
  }),
  streaming_link: z.string().min(1, "Streaming link is required"),
});

type AlbumFormValues = z.infer<typeof albumSchema>;

interface AlbumFormProps {
  albumId?: string;
  initialAlbum?: Album;
}

export function AlbumForm({ albumId, initialAlbum }: Readonly<AlbumFormProps>) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<AlbumFormValues>({
    resolver: zodResolver(albumSchema),
    defaultValues: {
      title: initialAlbum?.title ?? "",
      release_date: initialAlbum?.release_date ?? "",
      streaming_platform: (initialAlbum?.streaming_platform as "spotify" | "soundcloud") ?? "spotify",
      streaming_link: initialAlbum?.streaming_link ?? "",
    },
  });

  const streamingPlatform = watch("streaming_platform");
  const coverPreview = file ? URL.createObjectURL(file) : (initialAlbum?.album_cover ?? "");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  }

  async function onSubmit(data: AlbumFormValues) {
    const payload: Album = {
      title: data.title,
      release_date: data.release_date,
      streaming_platform: data.streaming_platform,
      streaming_link: data.streaming_link,
      album_cover: initialAlbum?.album_cover ?? "",
      album_cover_key: initialAlbum?.album_cover_key,
    };

    try {
      if (albumId) {
        await updateAlbumById(parseInt(albumId), payload, file);
      } else {
        if (!file) {
          setError("root", { message: "Album cover image is required." });
          return;
        }
        await createAlbum(payload, file);
      }
      router.push("/admin/albums");
    } catch (err) {
      console.error("Error saving album:", err);
      setError("root", {
        message: albumId
          ? "Failed to update the album. Please try again later."
          : "Failed to create the album. Please try again later.",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardContent className="space-y-4 pt-6">
          {errors.root && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{errors.root.message}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col items-center space-y-4 md:flex-row md:space-x-4 md:space-y-0">
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Album Title</Label>
                <Input id="title" placeholder="Enter album title" {...register("title")} />
                {errors.title && (
                  <p className="text-xs text-destructive">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Album Cover</Label>
                <input
                  id="pic"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="hidden"
                />
                {!coverPreview ? (
                  <div
                    className="w-48 h-48 bg-neutral-800 cursor-pointer hover:opacity-50 flex justify-center items-center"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="text-white" />
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 w-48">
                    <Image
                      alt="Uploaded image"
                      width={192}
                      height={192}
                      className="object-cover"
                      src={coverPreview}
                    />
                    <Button type="button" className="bg-blue-500" onClick={() => fileInputRef.current?.click()}>
                      Replace
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="release_date">Release Date (M/YYYY)</Label>
                <Input
                  id="release_date"
                  type="month"
                  placeholder="1/2025"
                  {...register("release_date")}
                />
                {errors.release_date && (
                  <p className="text-xs text-destructive">{errors.release_date.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Streaming Platform</Label>
                <Controller
                  control={control}
                  name="streaming_platform"
                  render={({ field }) => (
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="spotify" id="spotify" />
                        <Label htmlFor="spotify">Spotify</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="soundcloud" id="soundcloud" />
                        <Label htmlFor="soundcloud">SoundCloud</Label>
                      </div>
                    </RadioGroup>
                  )}
                />
                {errors.streaming_platform && (
                  <p className="text-xs text-destructive">{errors.streaming_platform.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="streaming_link">
                  {streamingPlatform === "soundcloud" ? "Streaming Link" : "Spotify ID"}
                </Label>
                <Input
                  id="streaming_link"
                  placeholder={
                    streamingPlatform === "soundcloud"
                      ? "https://soundcloud.com/max-lafarr/sets/unanimity"
                      : "5QlSo5Hgas50pzaufIlIxa"
                  }
                  {...register("streaming_link")}
                />
                {errors.streaming_link && (
                  <p className="text-xs text-destructive">{errors.streaming_link.message}</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/albums")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : albumId ? "Update Album" : "Create Album"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
