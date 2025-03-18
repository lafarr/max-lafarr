"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Upload } from "lucide-react"
import { Album, createAlbum } from "@/lib/actions"
import Image from 'next/image';

interface AlbumFormProps {
	albumId?: string
}

export function AlbumForm({ albumId }: Readonly<AlbumFormProps>) {
	const router = useRouter()
	const ref = useRef<HTMLInputElement>(null);
	const [isLoading, setIsLoading] = useState(false)
	const [file, setFile] = useState<File | null>(null);
	const [formData, setFormData] = useState({
		title: "",
		streaming_link: "",
		release_date: "", // HTML month input format
		streaming_platform: "spotify",
	})

	function getRemSize() {
		const rootElement = document.documentElement;
		const computedStyle = window.getComputedStyle(rootElement);

		// Extract the font-size value
		return parseFloat(computedStyle.fontSize);
	}


	function getButtonText(isLoading: boolean, albumId?: string): string {
		if (isLoading) {
			return "Saving..."
		}
		if (albumId) {
			return "Update Album"
		}
		return "Create Album"
	}

	useEffect(() => {
		if (albumId) {
			// In a real app, you would fetch the album data from your API
			// This is just mock data for demonstration
			const mockAlbum = {
				id: albumId,
				title: "Midnight Dreams",
				release_date: "2023-03", // HTML month input format
				streaming_link: "https://spotify.com/album/midnight-dreams",
				streaming_platform: "spotify",
			}

			setFormData(mockAlbum)
		}
	}, [albumId])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData((prev) => ({ ...prev, [name]: value }))
	}

	const handleRadioChange = (value: string) => {
		setFormData((prev) => ({ ...prev, streaming_platform: value }))
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setIsLoading(true)

		if (file) {
			await createAlbum(formData as Album, file);
		}
		setIsLoading(false);
		router.push('/admin/albums');
	}

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.value && event.target.files) {
			setFile(event.target.files[0])
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<Card>
				<CardContent className="space-y-4 pt-6">
					<div className="flex flex-col items-center space-y-4 md:flex-row md:space-x-4 md:space-y-0">
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
								<Label htmlFor="title">Album Cover</Label>
								<Input
									id="pic"
									name="pic"
									type="file"
									onChange={handleFileChange}
									ref={ref}
									className="hidden"
								/>
								{!file && <div className="w-48 h-48 bg-neutral-800 cursor-pointer hover:opacity-50 flex justify-center items-center" onClick={() => ref.current?.click()}>
									<Upload className="text-white" />
								</div>}
								{file && <Image alt="Uploaded image" width={getRemSize() * 12} height={getRemSize() * 12} className="object-cover" src={URL.createObjectURL(file)} />}
							</div>
							<div className="space-y-2">
								<Label htmlFor="release_date">Release Date (M/YYYY)</Label>
								<Input
									id="releaseDate"
									name="release_date"
									type="month"
									value={formData.release_date}
									onChange={handleChange}
									placeholder="1/2025"
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="streamingLink">Streaming Link</Label>
								<Input
									id="streamingLink"
									name="streaming_link"
									placeholder="https://example.com/album"
									value={formData.streaming_link}
									onChange={handleChange}
									required
								/>
							</div>
						</div>
					</div>

					<div className="space-y-2">
						<Label>Streaming Platform</Label>
						<RadioGroup value={formData.streaming_platform} onValueChange={handleRadioChange} className="flex space-x-4">
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
						{getButtonText(isLoading, albumId)}
					</Button>
				</CardFooter>
			</Card>
		</form>
	)
}
