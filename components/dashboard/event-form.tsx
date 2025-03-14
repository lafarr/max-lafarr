"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface EventFormProps {
  eventId?: string
}

export function EventForm({ eventId }: EventFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    date: "",
    time: "",
    ticketLink: "",
    description: "",
  })

  useEffect(() => {
    if (eventId) {
      // In a real app, you would fetch the event data from your API
      // This is just mock data for demonstration
      const mockEvent = {
        id: eventId,
        name: "Summer Festival 2023",
        location: "Central Park, New York",
        date: "2023-07-15", // HTML date input format
        time: "14:00",
        ticketLink: "https://example.com/tickets/summer-festival",
        description: "A wonderful summer festival with live music and food.",
      }

      setFormData(mockEvent)
    }
  }, [eventId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // In a real app, you would send the data to your API
    setTimeout(() => {
      setIsLoading(false)
      router.push("/admin/events")
    }, 1000)
  }

  // Function to format date from HTML date input (YYYY-MM-DD) to M-DD-YYYY for display
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return ""
    const [year, month, day] = dateString.split("-")
    // Remove leading zero from month if present
    const formattedMonth = month.replace(/^0/, "")
    return `${formattedMonth}-${day}-${year}`
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Event Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter event name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                placeholder="Enter event location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Date (M-DD-YYYY)</Label>
              <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
              {formData.date && (
                <p className="text-xs text-muted-foreground">
                  Will be displayed as: {formatDateForDisplay(formData.date)}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input id="time" name="time" type="time" value={formData.time} onChange={handleChange} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ticketLink">Ticket Link</Label>
            <Input
              id="ticketLink"
              name="ticketLink"
              placeholder="https://example.com/tickets"
              value={formData.ticketLink}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter event description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/events")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : eventId ? "Update Event" : "Create Event"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

