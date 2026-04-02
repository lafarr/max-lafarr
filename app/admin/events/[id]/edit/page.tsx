import { EventForm } from "@/components/dashboard/event-form"
import { getEventById } from "@/lib/queries"
import { notFound } from "next/navigation"

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEventById(parseInt(id));

  if (!event) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Edit Event</h2>
      <EventForm eventId={id} initialEvent={event} />
    </div>
  )
}
