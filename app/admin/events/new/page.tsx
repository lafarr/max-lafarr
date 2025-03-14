import { EventForm } from "@/components/dashboard/event-form"

export default function NewEventPage() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Add New Event</h2>
      <EventForm />
    </div>
  )
}

