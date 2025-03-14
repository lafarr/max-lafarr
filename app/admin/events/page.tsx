import { Button } from "@/components/ui/button"
import { EventsTable } from "@/components/dashboard/events-table"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

export default function EventsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Music Events</h2>
        <Button asChild>
          <Link href="/admin/events/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Event
          </Link>
        </Button>
      </div>
      <EventsTable />
    </div>
  )
}

