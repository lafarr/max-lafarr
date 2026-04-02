import { CalendarDays, MapPin, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { getEvents } from '@/lib/queries';
import { FadeUp, SlideIn, StaggerContainer, StaggerItem } from '@/components/animations';
import { TicketButton } from '@/components/events/ticket-button';

function formatDate(date: string) {
  const [year, month, day] = date.split('-');
  return `${month.replace(/^0/, '')}-${day}-${year}`;
}

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <main className="min-h-screen bg-black text-white py-16">
      <div className="container mx-auto px-4">
        <SlideIn direction="left">
          <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center">UPCOMING EVENTS</h1>
        </SlideIn>

        <div className="max-w-3xl mx-auto">
          {events.length > 0 ? (
            <StaggerContainer className="grid gap-6" staggerDelay={0.1}>
              {events.map((event) => (
                <StaggerItem key={event.id}>
                  <Card className="bg-zinc-900 border-zinc-800 text-white">
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
                            <span>{event.location}</span>
                          </div>
                        </div>
                        <div className="flex justify-start">
                          {event.ticket_link && <TicketButton href={event.ticket_link} />}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <FadeUp>
              <div className="text-center py-12">
                <p className="text-2xl font-light text-gray-300">
                  No events scheduled right now, check back soon!
                </p>
              </div>
            </FadeUp>
          )}
        </div>
      </div>
    </main>
  );
}
