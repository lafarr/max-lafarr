'use client';

import { CalendarDays, MapPin, Clock, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getEvents } from "@/lib/actions";
import { useEffect, useState } from "react";

interface Event {
	id: string;
	name: string;
	date: string;
	time: string;
	venue: string;
	location: string;
	ticket_link: string;
}

export default function EventsPage() {
	const [events, setEvents] = useState<Event[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [eventsError, setEventsError] = useState(false);

	useEffect(() => {
		getEvents()
			.then((localEvents) => {
				setEvents(localEvents);
				setIsLoading(false);
			})
			.catch(() => setEventsError(true));
	}, []);

	function formatDate(date: string) {
		const dateParts = date.split('-');
		const year = dateParts[0];
		let [, month, day] = dateParts;
		month = month.replace(/^0/, '');
		day = day.replace(/^0/, '');
		return `${month}-${day}-${year}`;
	}

	return (
		<main className="min-h-screen bg-black text-white py-16">
			<div className="container mx-auto px-4">
				<h1 className="text-4xl md:text-5xl font-bold mb-12 text-center">UPCOMING EVENTS</h1>

				{eventsError && (
					<div className="text-center py-12">
						<p className="text-2xl font-light text-red-400">Sorry, we had trouble loading the events. Please try again later.</p>
					</div>
				)}
				{isLoading && <div className="flex justify-center items-center"><Loader2 className="mt-24 animate-spin text-white" /> </div>}
				{!isLoading && !eventsError && <div className="grid gap-6 max-w-3xl mx-auto">
					{events.length > 0 ? (
						events.map((event) => (
							<Card key={event.id} className="bg-zinc-900 border-zinc-800 text-white">
								<CardContent className="p-6">
									<div className="flex flex-col gap-6">
										<div>
											<h2 className="text-xl font-bold mb-3">{event.name}</h2>
											<div className="flex items-center gap-2 text-gray-300 mb-2">
												<CalendarDays className="h-4 w-4" />
												<span>{formatDate(event.date)}</span>
											</div>
											<div className="flex items-center gap-2 text-gray-300 mb-2">
												<Clock className="h-4 w-4" />
												<span>{event.time}</span>
											</div>
											<div className="flex items-center gap-2 text-gray-300">
												<MapPin className="h-4 w-4" />
												<span>
													{event.location}
												</span>
											</div>
										</div>

										<div className="flex justify-start">
											{event.ticket_link && <Button asChild className="bg-white text-black hover:bg-gray-200 px-6 sm:px-8">
												<a href={event.ticket_link}>GET TICKETS</a>
											</Button>}
										</div>
									</div>
								</CardContent>
							</Card>
						))
					) : (
						<div className="text-center py-12">
							<p className="text-2xl font-light text-gray-300">No events scheduled right now, check back soon!</p>
						</div>
					)}
				</div>}
			</div>
		</main>
	)
}

