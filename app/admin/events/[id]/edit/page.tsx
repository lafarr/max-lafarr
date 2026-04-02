import type React from "react";

import { EventForm } from "@/components/dashboard/event-form"
import { getEventById } from "@/lib/queries"
import { notFound } from "next/navigation"

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }): Promise<React.JSX.Element> {
  const { id } = await params;
  const event = await getEventById(parseInt(id));

  if (event == null) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Edit Event</h2>
      <EventForm eventId={id} initialEvent={event} />
    </div>
  )
}
