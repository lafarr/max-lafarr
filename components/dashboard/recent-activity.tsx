import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const activities = [
  {
    id: "1",
    type: "event_created",
    title: "Summer Festival 2023",
    timestamp: "2 hours ago",
    user: {
      name: "Admin",
      avatar: "/placeholder-user.jpg",
      initials: "AD",
    },
  },
  {
    id: "2",
    type: "album_updated",
    title: "Midnight Dreams",
    timestamp: "5 hours ago",
    user: {
      name: "Admin",
      avatar: "/placeholder-user.jpg",
      initials: "AD",
    },
  },
  {
    id: "3",
    type: "newsletter_sent",
    title: "June Newsletter",
    timestamp: "1 day ago",
    user: {
      name: "Admin",
      avatar: "/placeholder-user.jpg",
      initials: "AD",
    },
  },
  {
    id: "4",
    type: "event_updated",
    title: "Jazz Night",
    timestamp: "2 days ago",
    user: {
      name: "Admin",
      avatar: "/placeholder-user.jpg",
      initials: "AD",
    },
  },
]

export function RecentActivity() {
  return (
    <div className="space-y-8">
      {activities.map((activity) => (
        <div className="flex items-center" key={activity.id}>
          <Avatar className="h-9 w-9">
            <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
            <AvatarFallback>{activity.user.initials}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{activity.title}</p>
            <p className="text-sm text-muted-foreground">
              {activity.type.replace("_", " ")} {activity.timestamp}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

