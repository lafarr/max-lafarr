"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Album, Calendar, Mail } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navItems = [
	/*{
	  title: "Newsletter",
	  href: "/admin/newsletter",
	  icon: Mail,
	},*/
	{
		title: "Events",
		href: "/admin/events",
		icon: Calendar,
	},
	{
		title: "Albums",
		href: "/admin/albums",
		icon: Album,
	},
]

export function DashboardNav() {
	const pathname = usePathname()

	return (
		<nav className="grid items-start gap-2">
			{navItems.map((item) => {
				const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
				return (
					<Button
						key={item.href}
						variant={isActive ? "secondary" : "ghost"}
						className={cn(
							"justify-start",
							isActive ? "bg-secondary text-secondary-foreground" : "hover:bg-muted hover:text-primary",
						)}
						asChild
					>
						<Link href={item.href}>
							<item.icon className="mr-2 h-4 w-4" />
							{item.title}
						</Link>
					</Button>
				)
			})}
		</nav>
	)
}

