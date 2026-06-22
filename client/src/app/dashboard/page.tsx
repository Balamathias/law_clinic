'use client'

import { useQuery } from "@tanstack/react-query"
import { Calendar, FileText, Inbox, Users, ShieldCheck, Activity, Clock, ArrowRight, CheckCircle2 } from "lucide-react"
import Link from "next/link"

import RecentActivity from "@/components/dashboard/recent-activity"
import { StatCard } from "@/components/dashboard/stat-card"
import { useUser } from "@/services/client/auth"
import { getEventsStats } from "@/services/server/events"
import { getHelpRequestsStats } from "@/services/server/help-requests"
import { getPublicationsStats } from "@/services/server/publications"
import { getUsersStats } from "@/services/server/users"
import Loader from "@/components/loader"

export default function DashboardOverviewPage() {
  const { data: userResponse, isLoading: isUserLoading } = useUser()
  const user = userResponse?.data
  const firstName = user?.first_name?.trim() || user?.username || "there"

  const { data: publications, isLoading: isPubsLoading } = useQuery({
    queryKey: ['publications-stats'],
    queryFn: getPublicationsStats,
  })

  const { data: events, isLoading: isEventsLoading } = useQuery({
    queryKey: ['events-stats'],
    queryFn: getEventsStats,
  })

  const { data: helpRequests, isLoading: isHelpLoading } = useQuery({
    queryKey: ['help-requests-stats'],
    queryFn: getHelpRequestsStats,
    enabled: !!user?.is_superuser,
  })

  const { data: users, isLoading: isUsersLoading } = useQuery({
    queryKey: ['users-stats'],
    queryFn: getUsersStats,
    enabled: !!user?.is_superuser,
  })

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader variant="dots" size={48} text="Loading workspace..." />
      </div>
    )
  }

  const isStatsLoading = isPubsLoading || isEventsLoading || (user?.is_superuser && (isHelpLoading || isUsersLoading))

  // Time of day greeting
  const hour = new Date().getHours()
  let greeting = "Welcome back"
  if (hour < 12) greeting = "Good morning"
  else if (hour < 17) greeting = "Good afternoon"
  else greeting = "Good evening"

  // Mock timeline activities for visual polish
  const activities = [
    {
      id: 1,
      type: "publication",
      text: "Draft publication 'Understanding Landlord Tenant Rights' was updated by Staff",
      time: "2 hours ago",
      color: "bg-indigo-500",
    },
    {
      id: 2,
      type: "event",
      text: "New registration received for the upcoming 'Human Rights Workshop'",
      time: "4 hours ago",
      color: "bg-violet-500",
    },
    {
      id: 3,
      type: "triage",
      text: "Legal Help request ID #4230 was auto-assigned to triage queue",
      time: "Yesterday",
      color: "bg-amber-500",
    },
  ]

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-1">
      {/* Premium Aurora Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200/60 dark:border-zinc-800/80 bg-linear-to-br from-zinc-50 via-white to-zinc-100/50 p-6 md:p-8 dark:from-zinc-950 dark:via-zinc-900/60 dark:to-zinc-950 shadow-xs">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 size-40 bg-linear-to-br from-primary/10 to-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 size-48 bg-linear-to-br from-teal-500/5 to-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold tracking-wider uppercase">
              <span className="relative flex size-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              Systems Nominal · Active
            </div>
            <h1 className="font-serif text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
              {greeting}, {firstName}
            </h1>
            <p className="max-w-2xl text-xs text-muted-foreground leading-relaxed">
              Welcome to the Ahmadu Bello University Law Clinic workspace. Manage student rosters, coordinate legal triages, and publish clinical journals.
            </p>
          </div>
          
          <div className="shrink-0 flex items-center gap-3.5 bg-background border border-border/80 p-4 rounded-xl shadow-xs">
            <div className="size-9 rounded-lg bg-primary/5 flex items-center justify-center border border-primary/10">
              <ShieldCheck className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">Access Mode</p>
              <p className="text-sm font-bold text-foreground">{user?.is_superuser ? "System Administrator" : "Clinic Officer"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-border/50 pb-3">
          <div className="space-y-0.5">
            <h2 className="font-serif text-lg font-bold tracking-tight text-foreground">
              Clinic Metrics
            </h2>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Operational parameters</p>
          </div>
          <div className="inline-flex items-center gap-1 text-[10px] text-muted-foreground font-medium bg-muted/50 px-2 py-0.5 rounded-md">
            <Clock className="size-3" />
            Live Updates
          </div>
        </div>
        
        {isStatsLoading ? (
          <StatsGridSkeleton isAdmin={!!user?.is_superuser} />
        ) : (
          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" aria-label="Dashboard stats">
            <StatCard
              label="Publications"
              value={publications?.data?.total ?? 0}
              href="/dashboard/publications"
              icon={FileText}
              themeColor="indigo"
              delta={{
                value: `${publications?.data?.published ?? 0} published`,
                positive: true,
                label: "Articles in database"
              }}
            />
            <StatCard
              label="Upcoming events"
              value={events?.data?.upcoming ?? 0}
              href="/dashboard/events"
              icon={Calendar}
              themeColor="violet"
              delta={{
                value: `${events?.data?.total ?? 0} total`,
                positive: true,
                label: "Scheduled workshops"
              }}
            />
            {user?.is_superuser && (
              <>
                <StatCard
                  label="Legal Triage"
                  value={helpRequests?.data?.new ?? 0}
                  href="/dashboard/help-requests"
                  icon={Inbox}
                  themeColor="amber"
                  delta={{
                    value: `${helpRequests?.data?.assigned ?? 0} assigned`,
                    positive: true,
                    label: "New intake requests"
                  }}
                />
                <StatCard
                  label="Registered Users"
                  value={users?.data?.total ?? 0}
                  href="/dashboard/users"
                  icon={Users}
                  themeColor="teal"
                  delta={{
                    value: `${users?.data?.staff ?? 0} staff`,
                    positive: true,
                    label: "Enrolled clinic team"
                  }}
                />
              </>
            )}
          </section>
        )}
      </section>

      {/* Main Grid: Control Center + Live Timeline */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left 2 Cols: Action Center */}
        <section className="lg:col-span-2 space-y-4">
          <div className="border-b border-border/50 pb-3">
            <h2 className="font-serif text-lg font-bold tracking-tight text-foreground">
              Workspace Operations
            </h2>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Operational modules</p>
          </div>
          
          <RecentActivity isAdmin={!!user?.is_superuser} />
        </section>

        {/* Right 1 Col: Live Timeline */}
        <section className="space-y-4">
          <div className="border-b border-border/50 pb-3">
            <h2 className="font-serif text-lg font-bold tracking-tight text-foreground">
              Recent Events
            </h2>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Activity Feed</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 space-y-5 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground pb-2 border-b border-border/60">
              <Activity className="size-4 text-primary" />
              Live Workspace Stream
            </div>
            
            <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-border/60">
              {activities.map((act) => (
                <div key={act.id} className="relative pl-6 space-y-1">
                  <div className={`absolute left-0.5 top-1.5 size-3 rounded-full border-2 border-card ${act.color}`} />
                  <p className="text-xs text-foreground font-medium leading-relaxed">
                    {act.text}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {act.time}
                  </p>
                </div>
              ))}
            </div>

            <Link
              href="/dashboard/publications"
              className="inline-flex items-center justify-center w-full gap-1.5 py-2 px-3 border border-border hover:bg-muted/40 transition-colors rounded-xl text-xs font-bold text-foreground mt-2"
            >
              View System Logs
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

function StatsGridSkeleton({ isAdmin }: { isAdmin: boolean }) {
  const cardCount = isAdmin ? 4 : 2

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Loading stats">
      {Array.from({ length: cardCount }).map((_, index) => (
        <div
          key={index}
          className="min-h-[130px] rounded-xl border border-border bg-card p-5 animate-pulse space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="h-3 w-20 rounded bg-muted" />
            <div className="size-4 rounded bg-muted" />
          </div>
          <div className="h-8 w-12 rounded bg-muted" />
          <div className="h-3 w-24 rounded bg-muted" />
        </div>
      ))}
    </section>
  )
}
