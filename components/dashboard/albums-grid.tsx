"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, Edit, Search, Trash } from "lucide-react"
import { Album, deleteAlbumById, getAlbums } from "@/lib/actions"

export function AlbumsGrid() {
	const [searchTerm, setSearchTerm] = useState("")
	const [filteredAlbums, setFilteredAlbums] = useState<Album[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [itemsDeleted, setItemsDeleted] = useState(0);

	function formatDate(date: string) {
		if (date.includes('-')) {
			const [year, month] = date.split('-');
			return `${month}/${year}`;
		}
	}

	function handleDelete(id: number | undefined) {
		if (id) {
			setIsLoading(true);
			deleteAlbumById(id)
				.then(() => {
					setIsLoading(false);
					setItemsDeleted((prev) => prev + 1);
				})
				// TODO: handle this error
				.catch()
		}
	}

	useEffect(() => {
		getAlbums()
			.then((data) => {
				setFilteredAlbums(data.filter(
					(album) =>
						album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
						album.release_date.toLowerCase().includes(searchTerm.toLowerCase()) ||
						album.streaming_platform.toLowerCase().includes(searchTerm.toLowerCase()),
				))
				setIsLoading(false);
			})
			// TODO: Handle this error
			.catch()
	}, [searchTerm, itemsDeleted]);

	if (isLoading)
		return (
			<div className="flex justify-center items-center">
				<Loader2 className="mt-24 animate-spin text-white" />
			</div>
		)

	else return (
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
							<Image src={album.album_cover || "/placeholder.svg"} alt={album.title} fill className="object-cover" />
						</div>
						<CardContent className="p-4">
							<h3 className="font-semibold mb-1">{album.title}</h3>
							<p className="text-sm text-muted-foreground">Released: {formatDate(album.release_date)}</p>
							<div className="mt-2">
								<p className="text-sm text-muted-foreground">Platform: {album.streaming_platform}</p>
								<p className="text-xs text-muted-foreground truncate mt-1">{album.streaming_link}</p>
							</div>
						</CardContent>
						<CardFooter className="p-4 pt-0 flex justify-between">
							<Button variant="outline" size="sm" onClick={() => console.log(`Edit album ${album.id}`)}>
								<Edit className="h-4 w-4 mr-2" />
								Edit
							</Button>
							<Button variant="ghost" size="icon" onClick={() => handleDelete(album.id)}>
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

