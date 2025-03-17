"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Loader2, Search, Trash } from "lucide-react"
import { deleteEvent, getEvents } from "@/lib/actions"

interface Event {
	id?: number;
	name: string;
	location: string;
	date: string;
	time: string;
	ticket_link: string | undefined;
}

export function EventsTable() {
	const [searchTerm, setSearchTerm] = useState("")
	const [events, setEvents] = useState<Event[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setIsLoading(true);
		getEvents()
			.then(tmpEvents => {
				setEvents(tmpEvents)
				setIsLoading(false);
			})
			// TODO: Handle this error
			.catch();
	}, []);

	const filteredEvents = events.filter(
		(event) =>
			event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			event.location.toLowerCase().includes(searchTerm.toLowerCase()),
	)

	if (isLoading)
		return (
			<div className="flex mt-24 items-center justify-center">
				<Loader2 className="animate-spin text-white" />
			</div>
		)

	else
		return (
			<div className="space-y-4">
				<div className="flex items-center">
					<div className="relative flex-1">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Search events..."
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
								<TableHead>Name</TableHead>
								<TableHead>Location</TableHead>
								<TableHead>Date</TableHead>
								<TableHead>Time</TableHead>
								<TableHead>Ticket Link</TableHead>
								<TableHead className="w-[100px]">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredEvents.map((event) => (
								<TableRow key={event.id}>
									<TableCell className="font-medium">{event.name}</TableCell>
									<TableCell>{event.location}</TableCell>
									<TableCell>{formatDate(event.date)}</TableCell>
									<TableCell>{formatTime(event.time)}</TableCell>
									<TableCell>
										<span className="text-muted-foreground text-sm truncate block max-w-[200px]">{event.ticket_link}</span>
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-2">
											{/* TODO: Need to change this on click to route to the proper thing */}
											<Button variant="ghost" size="icon" onClick={() => console.log(`Edit event ${event.id}`)}>
												<Edit className="h-4 w-4" />
												<span className="sr-only">Edit</span>
											</Button>
											{/* TODO: Need to change this on click to route to the proper thing */}
											<Button variant="ghost" size="icon" onClick={async () => { await deleteEvent(event.id); setEvents(await getEvents()); }}>
												<Trash className="h-4 w-4" />
												<span className="sr-only">Delete</span>
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>
		)
}

// Format date to M-DD-YYYY (no leading zero for month)
const formatDate = (dateString: string) => {
	const localDateString = dateString.toString();
	const dateParts = localDateString.split('-');
	for (let i = 0; i < dateParts.length; ++i) {
		dateParts[i] = dateParts[i].replace(/^0/, '');
	}

	return `${dateParts[1]}-${dateParts[2]}-${dateParts[0]}`;
}

function formatTime(time: string) {
	const timeParts = time.split(':');
	let hours = timeParts[0];
	const mins = timeParts[1];
	hours = hours.replace(/^0/, '');

	const timeOfDay = parseInt(hours) < 12 ? 'AM' : 'PM';

	if (parseInt(hours) > 12) hours = (parseInt(hours) - 12).toString();

	return `${hours}:${mins} ${timeOfDay.toUpperCase()}`;
}
