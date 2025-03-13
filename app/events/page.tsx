import { CalendarDays, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  location: string;
  ticketLink: string;
}

// Sample event data
const events: Event[] = [
  // {
  //   id: "1",
  //   title: "Ghost Pavilion Live at The Echo",
  //   date: "October 15, 2024",
  //   time: "8:00 PM",
  //   venue: "The Echo",
  //   location: "Los Angeles, CA",
  //   ticketLink: "#",
  // },
]

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-black text-white py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center">UPCOMING EVENTS</h1>

        <div className="grid gap-6 max-w-3xl mx-auto">
          {events.length > 0 ? (
            events.map((event) => (
              <Card key={event.id} className="bg-zinc-900 border-zinc-800 text-white">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-6">
                    <div>
                      <h2 className="text-xl font-bold mb-3">{event.title}</h2>
                      <div className="flex items-center gap-2 text-gray-300 mb-2">
                        <CalendarDays className="h-4 w-4" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300 mb-2">
                        <Clock className="h-4 w-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {event.venue}, {event.location}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-start">
                      <Button asChild className="bg-white text-black hover:bg-gray-200 px-6 sm:px-8">
                        <a href={event.ticketLink}>GET TICKETS</a>
                      </Button>
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
        </div>
      </div>
    </main>
  )
}

