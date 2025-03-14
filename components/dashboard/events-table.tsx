"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Search, Trash } from "lucide-react"

const events = [
  {
    id: "1",
    name: "Summer Festival 2023",
    location: "Central Park, New York",
    date: "7-15-2023",
    time: "14:00",
    ticketLink: "https://example.com/tickets/summer-festival",
  },
  {
    id: "2",
    name: "Jazz Night",
    location: "Blue Note, Chicago",
    date: "8-05-2023",
    time: "20:00",
    ticketLink: "https://example.com/tickets/jazz-night",
  },
  {
    id: "3",
    name: "Rock Concert",
    location: "Madison Square Garden, New York",
    date: "9-10-2023",
    time: "19:30",
    ticketLink: "https://example.com/tickets/rock-concert",
  },
  {
    id: "4",
    name: "Electronic Music Festival",
    location: "Venice Beach, Los Angeles",
    date: "7-22-2023",
    time: "16:00",
    ticketLink: "https://example.com/tickets/electronic-festival",
  },
  {
    id: "5",
    name: "Classical Symphony",
    location: "Symphony Hall, Boston",
    date: "8-18-2023",
    time: "19:00",
    ticketLink: "https://example.com/tickets/classical-symphony",
  },
]

export function EventsTable() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredEvents = events.filter(
    (event) =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
                <TableCell>{event.time}</TableCell>
                <TableCell>
                  <span className="text-muted-foreground text-sm truncate block max-w-[200px]">{event.ticketLink}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => console.log(`Edit event ${event.id}`)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => console.log(`Delete event ${event.id}`)}>
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
  // If the date is already in the right format, return it
  if (/^\d{1,2}-\d{2}-\d{4}$/.test(dateString)) {
    return dateString
  }

  // If it's in YYYY-MM-DD format, convert it
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split("-")
    // Remove leading zero from month if present
    const formattedMonth = month.replace(/^0/, "")
    return `${formattedMonth}-${day}-${year}`
  }

  return dateString // Return as is if format is unknown
}

