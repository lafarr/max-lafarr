"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Album, getAlbums } from "@/lib/actions"
import { Loader2 } from "lucide-react"

export default function DiscographyPage() {
	const [selectedAlbum, setSelectedAlbum] = useState<(typeof albums)[0] | null>(null)
	const [albums, setAlbums] = useState<Album[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [albumsError, setAlbumsError] = useState(false);

	const renderEmbed = (album: (typeof albums)[0]) => {
		if (album.streaming_platform === "soundcloud") {
			return (
				<iframe
					width="100%"
					height="500"
					scrolling="no"
					frameBorder="no"
					src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(album.streaming_link)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`}
					className="rounded-md"
				></iframe>
			)
		}

		return (
			<iframe
				src={`https://open.spotify.com/embed/album/${album.streaming_link}`}
				width="100%"
				height="500"
				frameBorder="0"
				allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
				className="rounded-md"
			></iframe>
		)
	}

	useEffect(() => {
		getAlbums()
			.then((data) => {
				setAlbums(data);
				setIsLoading(false);
			})
			// TODO: Handle this error
			.catch(() => setAlbumsError(true));
	}, []);

	if (isLoading)
		return (
			<div className="min-h-screen flex justify-center items-center">
				<Loader2 className="animate-spin text-white mb-24" />
			</div>
		)

	else
		return (
			<main className="min-h-screen bg-black text-white py-16">
				<div className="container mx-auto px-4">
					<h1 className="text-4xl md:text-5xl font-bold mb-12 text-center">DISCOGRAPHY</h1>
					<p className="text-center text-gray-300 mb-12">Click any album to listen</p>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-0">
						{albumsError && (
							<div className="col-span-full text-center">
								<p className="text-red-500 text-lg">We encountered an error while loading the albums. Please try again later.</p>
							</div>
						)}
						{!albumsError && albums.map((album) => (
							<Dialog key={album.id}>
								<DialogTrigger asChild>
									<div className="cursor-pointer group" onClick={() => setSelectedAlbum(album)}>
										<div className="relative aspect-square overflow-hidden rounded-lg">
											<Image
												src={album.album_cover ?? ''}
												alt={album.title}
												className="object-cover hover:opacity-50 transition-all duration-300 md:scale-[0.835] rounded-lg"
												width={500}
												height={500}
											/>
										</div>
									</div>
								</DialogTrigger>
								<DialogContent className="text-white max-w-4xl bg-transparent border-none">
									<DialogTitle className="sr-only">Hello</DialogTitle>
									{selectedAlbum && (
										<div className="w-full">
											{renderEmbed(selectedAlbum)}
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

