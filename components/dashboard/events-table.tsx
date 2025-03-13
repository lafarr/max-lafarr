"use client"

import type React from "react";

import { useState } from "react"
import { useQuery } from 'convex/react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Search, Trash , AlertCircle } from "lucide-react"
import { api } from '@/convex/_generated/api'
import { type Event, deleteEvent } from "@/lib/actions"
import { useRouter } from "next/navigation"
import { ConfirmationDialog } from "./confirmation_dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type EventsTableProps = {
  initialEvents: Event[];
}

export function EventsTable({ initialEvents }: EventsTableProps): React.JSX.Element {
  const [searchTerm, setSearchTerm] = useState("")
  const [confirmation, setConfirmation] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<number | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const resolvedEvents = useQuery(api.music.listEvents) ?? initialEvents;

  const filteredEvents = resolvedEvents.filter(
    (event) =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  function handleDelete(): void {
    const id = eventToDelete;
    if (id !== undefined) {
      setError(null);
      deleteEvent(id)
        .then(() => {
          router.refresh();
        })
        .catch((err: unknown) => {
          console.error("Failed to delete event:", err);
          setError("Failed to delete the event. Please try again later.");
        });
    }
  }

  return (
    <div className="space-y-4">
      {error != null && error !== '' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search events..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); }}
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
                      <span className="text-muted-foreground text-sm truncate block max-w-[200px]">{event.ticket_link ?? ''}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => { if (event.id != null) { router.push(`/admin/events/${event.id}/edit`); } }}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => { setConfirmation(true); setEventToDelete(event.id); }}>
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
      {confirmation && (
        <ConfirmationDialog
          confirmationButtonColor="bg-red-500"
          confirmationText="Delete Event"
          confirmationAction={() => { handleDelete(); setConfirmation(false); }}
        />
      )}
    </div>
  );
}

function formatDate(dateString: string): string {
  const dateParts = dateString.split('-');
  for (let i = 0; i < dateParts.length; ++i) {
    dateParts[i] = dateParts[i].replace(/^0/, '');
  }
  return `${dateParts[1]}-${dateParts[2]}-${dateParts[0]}`;
}

function formatTime(time: string): string {
  const timeParts = time.split(':');
  let hours = timeParts[0];
  const mins = timeParts[1];
  hours = hours.replace(/^0/, '');
  const timeOfDay = parseInt(hours) < 12 ? 'AM' : 'PM';
  if (parseInt(hours) > 12) {hours = (parseInt(hours) - 12).toString();}
  return `${hours}:${mins} ${timeOfDay.toUpperCase()}`;
}
