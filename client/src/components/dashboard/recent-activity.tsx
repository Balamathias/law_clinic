import { Activity, Calendar, FileText, Inbox, Users } from "lucide-react"

import { EmptyState } from "@/components/ui/empty-state"

interface RecentActivityProps {
  isAdmin?: boolean
}

const STAFF_ROWS = [
  {
    icon: FileText,
    label: "Publication edits",
    description: "Draft, review, and publishing activity will appear here.",
  },
  {
    icon: Calendar,
    label: "Event updates",
    description: "Schedule changes and registrations will be listed here.",
  },
  {
    icon: Activity,
    label: "Site content",
    description: "Gallery, sponsor, and testimonial changes will be tracked here.",
  },
]

const ADMIN_ROWS = [
  {
    icon: Inbox,
    label: "Help request movement",
    description: "New assignments and status changes will appear here.",
  },
  {
    icon: Users,
    label: "User administration",
    description: "Role and account updates will be visible to admins.",
  },
]

export default function RecentActivity({ isAdmin = false }: RecentActivityProps) {
  const rows = isAdmin ? [...STAFF_ROWS, ...ADMIN_ROWS] : STAFF_ROWS

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      <div className="divide-y divide-border">
        {rows.map(({ icon: Icon, label, description }) => (
          <div key={label} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 p-4">
            <div className="flex size-9 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground">
              <Icon className="size-4" aria-hidden />
            </div>
            <div className="min-w-0">
              <div className="mb-2 h-2 w-24 animate-pulse rounded-full bg-muted" />
              <p className="text-sm font-medium text-foreground">{label}</p>
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            </div>
            <div className="hidden w-20 space-y-2 sm:block" aria-hidden>
              <div className="h-2 rounded-full bg-muted" />
              <div className="ml-auto h-2 w-12 rounded-full bg-muted" />
            </div>
          </div>
        ))}
      </div>
      <EmptyState
        icon={Activity}
        title="No live activity yet"
        description="This feed is prepared for Wave 2, when content, event, request, and user actions will stream in."
        className="rounded-none border-x-0 border-b-0 bg-muted/25 px-4 py-8"
      />
    </div>
  )
}
