"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"

const LABELS: Record<string, string> = {
  dashboard: "Overview",
  publications: "Publications",
  "publication-categories": "Categories",
  comments: "Comments",
  events: "Events",
  "event-categories": "Event categories",
  "help-requests": "Help requests",
  registrations: "Registrations",
  users: "Users",
  gallery: "Gallery",
  sponsors: "Sponsors",
  testimonials: "Testimonials",
  "app-data": "App data",
  profile: "Profile",
  new: "New",
  edit: "Edit",
}

function humanize(seg: string) {
  if (LABELS[seg]) return LABELS[seg]
  // Decode dynamic segments like UUIDs into something shorter for crumbs.
  if (/^[0-9a-f-]{8,}$/i.test(seg)) return seg.slice(0, 8) + "…"
  return seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " ")
}

export default function Breadcrumbs() {
  const path = usePathname()
  const segments = path.split("/").filter(Boolean)

  if (segments.length === 0) return null

  return (
    <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1 text-sm text-muted-foreground">
      {segments.map((seg, i) => {
        const href = "/" + segments.slice(0, i + 1).join("/")
        const isLast = i === segments.length - 1
        const label = humanize(seg)
        return (
          <span key={href} className="flex min-w-0 items-center gap-1">
            {i > 0 && <ChevronRight className="size-3 shrink-0 text-muted-foreground" aria-hidden />}
            {isLast ? (
              <span className="truncate font-medium text-foreground">{label}</span>
            ) : (
              <Link href={href} className="truncate hover:text-foreground">
                {label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
