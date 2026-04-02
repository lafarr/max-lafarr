import { EventForm } from "@/components/dashboard/event-form"

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Edit Event</h2>
      <EventForm eventId={id} />
    </div>
  )
}
