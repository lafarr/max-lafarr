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
import { Album, createAlbum, getAlbumById, updateAlbumById } from "@/lib/actions"
import Image from 'next/image';

interface AlbumFormProps {
	albumId?: string
}

export function AlbumForm({ albumId }: Readonly<AlbumFormProps>) {
	const router = useRouter()
	const ref = useRef<HTMLInputElement>(null);
	const [isLoading, setIsLoading] = useState(false)
	const [file, setFile] = useState<File | null>(null);
	const [error, setError] = useState(false)
	const [formData, setFormData] = useState<Album>({
		title: '',
		album_cover: '',
		release_date: '',
		streaming_link: '',
		streaming_platform: ''
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
			getAlbumById(parseInt(albumId))
				.then((data) => {
					setFormData(data[0]);
					setError(false);
				})
				.catch((err) => {
					console.error("Error fetching album:", err);
					setError(true);
				})
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

		if (albumId) {
			try {
				await updateAlbumById(parseInt(albumId), formData, file);
			} catch (err: unknown) {
				console.log(err);
				setIsLoading(false);
			}
		}
		else {
			if (file) {
				try {
					await createAlbum(formData, file);
				} catch (err: unknown) {
					console.log((err as Error).message || 'An unexpected error occurred.');
					setIsLoading(false);
				}
			}
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
					{error && (
						<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
							<svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z" clipRule="evenodd"></path>
							</svg>
							<div>
								<p className="font-medium">Error retrieving album information</p>
								<p className="text-sm">We encountered a problem loading this album. Please try again later.</p>
							</div>
						</div>
					)}
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
								{!file && !formData.album_cover && <div className="w-48 h-48 bg-neutral-800 cursor-pointer hover:opacity-50 flex justify-center items-center" onClick={() => ref.current?.click()}>
									<Upload className="text-white" />
								</div>}
								{(file || formData.album_cover) && (
									<div className="flex flex-col gap-4 w-48">
										<Image alt="Uploaded image" width={getRemSize() * 12} height={getRemSize() * 12} className="object-cover" src={file ? URL.createObjectURL(file) : formData.album_cover ?? ''} />
										<Button type="button" className="bg-blue-500" onClick={() => ref.current?.click()}>Replace</Button>
									</div>
								)}
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
							<div className="space-y-2">
								<Label htmlFor="streamingLink">{formData.streaming_platform === 'soundcloud' ? 'Streaming Link' : 'Spotify ID'}</Label>
								<Input
									id="streamingLink"
									name="streaming_link"
									placeholder={`Example: ${formData.streaming_platform === 'soundcloud' ? 'https://soundcloud.com/max-lafarr/sets/unanimity' : "5QlSo5Hgas50pzaufIlIxa"}`}
									value={formData.streaming_link}
									onChange={handleChange}
									required
								/>
							</div>
						</div>
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
