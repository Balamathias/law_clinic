import { Suspense } from "react"
import type { Metadata } from "next"
import { Calendar, FileText, Inbox, Users, ArrowUpRight, ShieldCheck, Sparkles, Heart } from "lucide-react"

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
    <div className="space-y-10">
      {/* Welcome Banner Box with Apple Styling */}
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-card/80 via-card/50 to-background p-8 md:p-10 shadow-sm">
        <div className="absolute -right-20 -top-20 -z-10 size-80 rounded-full bg-gradient-to-br from-primary/10 to-transparent opacity-60 blur-3xl" />
        
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="size-3.5" />
              Administrative Command Center
            </div>
            <h1 className="font-serif text-h1-editorial leading-tight text-foreground md:text-5xl">
              Welcome back, {firstName}
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground">
              Monitor, triage, and publish core components of the Ahmadu Bello University Law Clinic workspace.
            </p>
          </div>
          
          <div className="shrink-0 flex items-center gap-3 bg-muted/40 border border-border/40 p-4 rounded-2xl md:self-center">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Workspace Mode</p>
              <p className="text-sm font-semibold text-foreground">{user?.is_superuser ? "System Administrator" : "Clinic Officer"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground">Clinic Metrics</h2>
          <span className="text-xs text-muted-foreground/80 font-medium">Real-time database counts</span>
        </div>
        
        <Suspense fallback={<StatsGridSkeleton isAdmin={!!user?.is_superuser} />}>
          <StatsGrid user={user} />
        </Suspense>
      </section>

      {/* Recent Activity / Action Center Section */}
      <section className="space-y-5">
        <div>
          <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground">Operational Action Center</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Quick links and diagnostic feed for Wave 2 operations and legal triage nodes.
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
        gradientFrom="from-blue-500/10"
        delta={{
          value: `${publications.data?.published ?? 0} published`,
          positive: true,
          label: "Articles in system overview"
        }}
      />
      <StatCard
        label="Upcoming events"
        value={events.data?.upcoming ?? 0}
        href="/dashboard/events"
        icon={Calendar}
        gradientFrom="from-purple-500/10"
        delta={{
          value: `${events.data?.total ?? 0} total`,
          positive: true,
          label: "Ongoing workshops & programs"
        }}
      />
      {user?.is_superuser && (
        <>
          <StatCard
            label="Legal Help Triage"
            value={helpRequests.data?.new ?? 0}
            href="/dashboard/help-requests"
            icon={Inbox}
            gradientFrom="from-amber-500/10"
            delta={{
              value: `${helpRequests.data?.assigned ?? 0} assigned`,
              positive: true,
              label: "New intake help requests"
            }}
          />
          <StatCard
            label="Registered Users"
            value={users.data?.total ?? 0}
            href="/dashboard/users"
            icon={Users}
            gradientFrom="from-rose-500/10"
            delta={{
              value: `${users.data?.staff ?? 0} staff`,
              positive: true,
              label: "Enrolled clinic roster list"
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
          className="min-h-[160px] rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/50 p-6 animate-pulse"
        >
          <div className="flex items-center justify-between">
            <div className="h-3 w-24 rounded-full bg-muted" />
            <div className="size-8 rounded-xl bg-muted" />
          </div>
          <div className="mt-6 h-8 w-16 rounded-md bg-muted" />
          <div className="mt-4 h-3 w-32 rounded-full bg-muted" />
        </div>
      ))}
    </section>
  )
}

function RecentActivitySkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="min-h-[220px] rounded-2xl border border-border/50 bg-card p-5 animate-pulse space-y-4">
          <div className="flex items-center justify-between">
            <div className="size-10 rounded-xl bg-muted" />
            <div className="h-5 w-20 rounded-full bg-muted" />
          </div>
          <div className="h-5 w-32 rounded bg-muted" />
          <div className="space-y-2">
            <div className="h-3 w-full rounded bg-muted" />
            <div className="h-3 w-4/5 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  )
}
