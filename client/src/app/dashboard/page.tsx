import { Suspense } from "react"
import type { Metadata } from "next"
import { Calendar, FileText, Inbox, Users, ShieldCheck } from "lucide-react"

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
      {/* Welcome Banner Box with Apple Styling */}
      <div className="relative overflow-hidden rounded-xl border border-zinc-200/80 bg-zinc-50/50 p-6 md:p-8 dark:border-zinc-800/80 dark:bg-zinc-900/25">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
              Command Center
            </span>
            <h1 className="font-sans text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Welcome back, {firstName}
            </h1>
            <p className="max-w-xl text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed">
              Monitor, triage, and publish core components of the Ahmadu Bello University Law Clinic workspace.
            </p>
          </div>
          
          <div className="shrink-0 flex items-center gap-3 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 p-3.5 rounded-lg shadow-sm">
            <ShieldCheck className="size-4.5 text-zinc-400 dark:text-zinc-500" />
            <div>
              <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">Access Mode</p>
              <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-50">{user?.is_superuser ? "System Administrator" : "Clinic Officer"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Section */}
      <section className="space-y-3.5">
        <div className="flex items-baseline justify-between border-b border-zinc-200/60 dark:border-zinc-800/60 pb-2">
          <h2 className="font-sans text-sm font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            Clinic Metrics
          </h2>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500">Real-time stats</span>
        </div>
        
        <Suspense fallback={<StatsGridSkeleton isAdmin={!!user?.is_superuser} />}>
          <StatsGrid user={user} />
        </Suspense>
      </section>

      {/* Recent Activity / Action Center Section */}
      <section className="space-y-3.5">
        <div className="border-b border-zinc-200/60 dark:border-zinc-800/60 pb-2">
          <h2 className="font-sans text-sm font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            Action Center
          </h2>
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
        delta={{
          value: `${publications.data?.published ?? 0} published`,
          positive: true,
          label: "Articles in database"
        }}
      />
      <StatCard
        label="Upcoming events"
        value={events.data?.upcoming ?? 0}
        href="/dashboard/events"
        icon={Calendar}
        delta={{
          value: `${events.data?.total ?? 0} total`,
          positive: true,
          label: "Scheduled workshops"
        }}
      />
      {user?.is_superuser && (
        <>
          <StatCard
            label="Legal Triage"
            value={helpRequests.data?.new ?? 0}
            href="/dashboard/help-requests"
            icon={Inbox}
            delta={{
              value: `${helpRequests.data?.assigned ?? 0} assigned`,
              positive: true,
              label: "New intake requests"
            }}
          />
          <StatCard
            label="Registered Users"
            value={users.data?.total ?? 0}
            href="/dashboard/users"
            icon={Users}
            delta={{
              value: `${users.data?.staff ?? 0} staff`,
              positive: true,
              label: "Enrolled clinic team"
            }}
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
          className="min-h-[130px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 animate-pulse space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="h-3 w-20 rounded bg-zinc-100 dark:bg-zinc-800" />
            <div className="size-4 rounded bg-zinc-100 dark:bg-zinc-800" />
          </div>
          <div className="h-8 w-12 rounded bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-3 w-24 rounded bg-zinc-100 dark:bg-zinc-800" />
        </div>
      ))}
    </section>
  )
}

function RecentActivitySkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="min-h-[200px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 animate-pulse space-y-4">
          <div className="flex items-center justify-between">
            <div className="size-8 rounded bg-zinc-100 dark:bg-zinc-800" />
            <div className="h-4 w-16 rounded bg-zinc-100 dark:bg-zinc-800" />
          </div>
          <div className="h-4 w-28 rounded bg-zinc-100 dark:bg-zinc-800" />
          <div className="space-y-2">
            <div className="h-3 w-full rounded bg-zinc-100 dark:bg-zinc-800" />
            <div className="h-3 w-5/6 rounded bg-zinc-100 dark:bg-zinc-800" />
          </div>
        </div>
      ))}
    </div>
  )
}
