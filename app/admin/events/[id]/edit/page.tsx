import { EventForm } from "@/components/dashboard/event-form"

export default function EditEventPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Edit Event</h2>
      <EventForm eventId={params.id} />
    </div>
  )
}

