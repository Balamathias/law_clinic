import { Suspense } from "react"
import type { Metadata } from "next"
import { Calendar, FileText, Inbox, Users } from "lucide-react"

import RecentActivity from "@/components/dashboard/recent-activity"
import { StatCard } from "@/components/dashboard/stat-card"
import { getUser } from "@/services/server/auth"
import { getEventsStats } from "@/services/server/events"
import { getHelpRequestsStats } from "@/services/server/help-requests"
import { getPublicationsStats } from "@/services/server/publications"
import { getUsersStats } from "@/services/server/users"
import type { User } from "@/@types/db"

export const metadata: Metadata = {
  title: "Overview | ABU Law Clinic",
  description: "Dashboard overview for ABU Law Clinic staff.",
}

export default async function DashboardOverviewPage() {
  const { data: user } = await getUser()
  const firstName = user?.first_name?.trim() || user?.username || "there"

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Overview
        </p>
        <h1 className="mt-2 text-h1-editorial text-foreground">
          Welcome back, {firstName}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Here is the clinic at a glance: publishing, events, requests, and account activity.
        </p>
      </div>

      <Suspense fallback={<StatsGridSkeleton isAdmin={!!user?.is_superuser} />}>
        <StatsGrid user={user} />
      </Suspense>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Recent activity</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            A prepared feed for the operational events that land in Wave 2.
          </p>
        </div>
        <Suspense fallback={<RecentActivitySkeleton />}>
          <RecentActivity isAdmin={!!user?.is_superuser} />
        </Suspense>
      </section>
    </div>
  )
}

async function StatsGrid({ user }: { user: User | null }) {
  const [publications, events, helpRequests, users] = await Promise.all([
    getPublicationsStats(),
    getEventsStats(),
    user?.is_superuser ? getHelpRequestsStats() : Promise.resolve({ data: null }),
    user?.is_superuser ? getUsersStats() : Promise.resolve({ data: null }),
  ])

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Dashboard stats">
      <StatCard
        label="Publications"
        value={publications.data?.total ?? 0}
        href="/dashboard/publications"
        icon={FileText}
      />
      <StatCard
        label="Upcoming events"
        value={events.data?.upcoming ?? 0}
        href="/dashboard/events"
        icon={Calendar}
      />
      {user?.is_superuser && (
        <>
          <StatCard
            label="Help requests"
            value={helpRequests.data?.new ?? 0}
            href="/dashboard/help-requests"
            icon={Inbox}
          />
          <StatCard
            label="Users"
            value={users.data?.total ?? 0}
            href="/dashboard/users"
            icon={Users}
          />
        </>
      )}
    </section>
  )
}

function StatsGridSkeleton({ isAdmin }: { isAdmin: boolean }) {
  const cardCount = isAdmin ? 4 : 2

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Loading dashboard stats">
      {Array.from({ length: cardCount }).map((_, index) => (
        <div
          key={index}
          className="min-h-40 rounded-lg border border-border bg-surface p-5"
        >
          <div className="flex items-center justify-between">
            <div className="h-3 w-24 animate-pulse rounded-full bg-muted" />
            <div className="size-4 animate-pulse rounded bg-muted" />
          </div>
          <div className="mt-8 h-9 w-16 animate-pulse rounded bg-muted" />
          <div className="mt-9 h-3 w-20 animate-pulse rounded-full bg-muted" />
        </div>
      ))}
    </section>
  )
}

function RecentActivitySkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-border p-4 last:border-b-0">
          <div className="size-9 animate-pulse rounded-md bg-muted" />
          <div className="space-y-2">
            <div className="h-3 w-28 animate-pulse rounded-full bg-muted" />
            <div className="h-3 w-full max-w-sm animate-pulse rounded-full bg-muted" />
          </div>
          <div className="hidden h-3 w-16 animate-pulse rounded-full bg-muted sm:block" />
        </div>
      ))}
    </div>
  )
}
