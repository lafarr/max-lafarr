"use client"

import type React from "react";

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createEvent, updateEventById } from "@/lib/actions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Event } from "@/lib/queries"

const eventSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  location: z.string().min(1, "Location is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  ticket_link: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
});

type EventFormValues = z.infer<typeof eventSchema>;

type EventFormProps = {
  eventId?: string;
  initialEvent?: Event;
}

export function EventForm({ eventId, initialEvent }: Readonly<EventFormProps>): React.JSX.Element {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch,
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: initialEvent?.name ?? "",
      location: initialEvent?.location ?? "",
      date: initialEvent?.date ?? "",
      time: initialEvent?.time ?? "",
      ticket_link: initialEvent?.ticket_link ?? "",
    },
  });

  const dateValue = watch("date");
  let submitLabel = "Create Event";
  const isEditing = eventId != null && eventId !== "";
  if (eventId != null && eventId !== "") {
    submitLabel = "Update Event";
  }
  if (isSubmitting) {
    submitLabel = "Saving...";
  }

  async function onSubmit(data: EventFormValues): Promise<void> {
    const payload = {
      name: data.name,
      location: data.location,
      date: data.date,
      time: data.time,
      ticket_link: data.ticket_link ?? "",
    };

    try {
      if (isEditing) {
        await updateEventById(parseInt(eventId), payload);
      } else {
        await createEvent(payload);
      }
      router.push("/admin/events");
    } catch (err) {
      console.error("Error saving event:", err);
      setError("root", {
        message: isEditing
          ? "Failed to update the event. Please try again later."
          : "Failed to create the event. Please try again later.",
      });
    }
  }

  function formatDateForDisplay(dateString: string): string {
    if (dateString === "") {return "";}
    const [year, month, day] = dateString.split("-");
    return `${month.replace(/^0/, "")}-${day}-${year}`;
  }

  return (
    <form onSubmit={(event) => { void handleSubmit(onSubmit)(event).catch(() => undefined); }}>
      <Card>
        <CardContent className="space-y-4 pt-6">
          {errors.root != null && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{errors.root.message}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Event Name</Label>
              <Input
                id="name"
                placeholder="Enter event name"
                {...register("name")}
              />
              {errors.name != null && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Enter event location"
                {...register("location")}
              />
              {errors.location != null && (
                <p className="text-xs text-destructive">{errors.location.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Date (MM-DD-YYYY)</Label>
              <Input id="date" type="date" {...register("date")} />
              {dateValue !== "" && (
                <p className="text-xs text-muted-foreground">
                  Will be displayed as: {formatDateForDisplay(dateValue)}
                </p>
              )}
              {errors.date != null && (
                <p className="text-xs text-destructive">{errors.date.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input id="time" type="time" {...register("time")} />
              {errors.time != null && (
                <p className="text-xs text-destructive">{errors.time.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ticket_link">Ticket Link (Optional)</Label>
            <Input
              id="ticket_link"
              placeholder="https://example.com/tickets"
              {...register("ticket_link")}
            />
            {errors.ticket_link != null && (
              <p className="text-xs text-destructive">{errors.ticket_link.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => { router.push("/admin/events"); }}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {submitLabel}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
