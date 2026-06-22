"use client";

import { Activity, Calendar, FileText, Inbox, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface RecentActivityProps {
  isAdmin?: boolean;
}

const COLOR_THEMES = {
  publications: {
    border: "hover:border-indigo-500/30",
    bg: "hover:bg-indigo-50/5 dark:hover:bg-indigo-950/5",
    iconBg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    badge: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400",
  },
  events: {
    border: "hover:border-violet-500/30",
    bg: "hover:bg-violet-50/5 dark:hover:bg-violet-950/5",
    iconBg: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    badge: "bg-violet-500/10 text-violet-700 dark:text-violet-400",
  },
  media: {
    border: "hover:border-sky-500/30",
    bg: "hover:bg-sky-50/5 dark:hover:bg-sky-950/5",
    iconBg: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
    badge: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
  },
  helpdesk: {
    border: "hover:border-amber-500/30",
    bg: "hover:bg-amber-50/5 dark:hover:bg-amber-950/5",
    iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    badge: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  },
  roster: {
    border: "hover:border-emerald-500/30",
    bg: "hover:bg-emerald-50/5 dark:hover:bg-emerald-950/5",
    iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  },
}

const STAFF_ROWS = [
  {
    key: "publications" as const,
    icon: FileText,
    label: "Publications & Content",
    description: "Compose, sanitize, and publish dynamic editorial articles",
    href: "/dashboard/publications",
    statusText: "Ready for triage",
  },
  {
    key: "events" as const,
    icon: Calendar,
    label: "Events & Education",
    description: "Manage community programs, workshops, and attendee limits",
    href: "/dashboard/events",
    statusText: "Active schedules",
  },
  {
    key: "media" as const,
    icon: Activity,
    label: "Media & Core Assets",
    description: "Review R2-stored files, sponsor logs, and clinic profiles",
    href: "/dashboard",
    statusText: "Fully optimized",
  },
];

const ADMIN_ROWS = [
  {
    key: "helpdesk" as const,
    icon: Inbox,
    label: "Legal Help Desk",
    description: "Review incoming client intake and coordinate student triage",
    href: "/dashboard/help-requests",
    statusText: "Real-time inbox",
  },
  {
    key: "roster" as const,
    icon: Users,
    label: "Student & Staff Roster",
    description: "Configure administrative privileges and assign case loads",
    href: "/dashboard/users",
    statusText: "System directory",
  },
];

export default function RecentActivity({ isAdmin = false }: RecentActivityProps) {
  const rows = isAdmin ? [...STAFF_ROWS, ...ADMIN_ROWS] : STAFF_ROWS;

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {rows.map(({ key, icon: Icon, label, description, href, statusText }) => {
        const theme = COLOR_THEMES[key];
        return (
          <div
            key={label}
            className={cn(
              "group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-5 text-foreground transition-all duration-300 shadow-xs",
              "hover:shadow-md hover:-translate-y-0.5",
              theme.border,
              theme.bg
            )}
          >
            <div>
              <div className="flex items-center justify-between">
                <div className={cn("size-9 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-105", theme.iconBg)}>
                  <Icon className="size-5" />
                </div>
                <span className={cn("text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md", theme.badge)}>
                  {statusText}
                </span>
              </div>

              <h3 className="mt-4 font-serif text-base font-bold text-foreground tracking-tight hover:underline cursor-pointer">
                <Link href={href}>{label}</Link>
              </h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Operational Node
              </span>
              <Link 
                href={href}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground hover:text-primary transition-colors"
              >
                Access view
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
