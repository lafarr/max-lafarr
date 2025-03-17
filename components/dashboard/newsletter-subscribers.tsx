"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LoaderCircle, MoreHorizontal, Search } from "lucide-react"
import { getSubData, deleteSub } from "@/lib/actions"

// TODO: Add a spinner while the subs are loading
export function NewsletterSubscribers() {
	const [searchTerm, setSearchTerm] = useState("")
	const [filteredSubscribers, setFilteredSubscribers] = useState<{ id: number, email: string, createdAt: string }[]>([]);
	const [subs, setSubs] = useState<{ id: number, email: string, createdAt: string }[]>([])
	const [haveFetched, setHaveFetched] = useState(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	function handleDelete(id: number): void {
		setIsLoading(true);

		deleteSub(id)
			.then(() => {
				getSubData()
					.then((subs) => {
						setSubs(subs);

						setFilteredSubscribers(
							subs.filter((sub: { id: number, email: string, createdAt: string }) =>
								sub.email.toLowerCase().includes(searchTerm.toLowerCase()),
							)
						)
						setIsLoading(false);
					})
					// TODO: Handle this error
					.catch()
			})
			// TODO: Handle this error
			.catch();
	}

	useEffect(() => {
		setIsLoading(true);
		if (!haveFetched) {
			getSubData()
				.then((subscribers) => {
					setSubs(subscribers);
					setHaveFetched(true);
					setFilteredSubscribers(
						subscribers.filter((sub: { id: number, email: string, createdAt: string }) =>
							sub.email.toLowerCase().includes(searchTerm.toLowerCase()),
						)
					)
					setIsLoading(false);
				})
				// TODO: Handle this error
				.catch()
		} else {
			setFilteredSubscribers(
				subs.filter((sub: { id: number, email: string, createdAt: string }) =>
					sub.email.toLowerCase().includes(searchTerm.toLowerCase()),
				)
			)
			setIsLoading(false);
		}
	}, [searchTerm, haveFetched, subs])

	if (isLoading) {
		return (
			<div className="w-full flex justify-center space-y-4">
				<LoaderCircle className="animate-spin" />
			</div>
		)
	} else {
		return (
			<div className="space-y-4">
				<div className="flex items-center gap-2">
					<div className="relative flex-1">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Search by email..."
							className="pl-8"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
				</div>
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Email</TableHead>
								<TableHead>Date Added</TableHead>
								<TableHead className="w-[50px]"></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredSubscribers.map((subscriber) => (
								<TableRow key={subscriber.id}>
									<TableCell>{subscriber.email}</TableCell>
									<TableCell>{subscriber.createdAt}</TableCell>
									<TableCell>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" className="h-8 w-8 p-0">
													<span className="sr-only">Open menu</span>
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem onClick={() => handleDelete(subscriber.id)}>Delete</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>
		)
	}
}
