"use client";

import { Activity, Calendar, FileText, Inbox, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface RecentActivityProps {
  isAdmin?: boolean;
}

const STAFF_ROWS = [
  {
    icon: FileText,
    label: "Publications & Content",
    description: "Compose, sanitize, and publish dynamic editorial articles",
    href: "/dashboard/publications",
    statusText: "Ready for triage",
  },
  {
    icon: Calendar,
    label: "Events & Education",
    description: "Manage community programs, workshops, and attendee limits",
    href: "/dashboard/events",
    statusText: "Active schedules",
  },
  {
    icon: Activity,
    label: "Media & Core Assets",
    description: "Review R2-stored files, sponsor logs, and clinic profiles",
    href: "/dashboard",
    statusText: "Fully optimized",
  },
];

const ADMIN_ROWS = [
  {
    icon: Inbox,
    label: "Legal Help Desk",
    description: "Review incoming client intake and coordinate student triage",
    href: "/dashboard/help-requests",
    statusText: "Real-time inbox",
  },
  {
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {rows.map(({ icon: Icon, label, description, href, statusText }) => (
        <div
          key={label}
          className="group relative flex flex-col justify-between rounded-xl border border-zinc-200/80 bg-white p-5 text-foreground transition-all duration-200 dark:border-zinc-800/80 dark:bg-zinc-950 hover:border-zinc-400 dark:hover:border-zinc-700"
        >
          <div>
            <div className="flex items-center justify-between">
              <Icon className="size-5 text-zinc-400 dark:text-zinc-500 transition-colors group-hover:text-zinc-600 dark:group-hover:text-zinc-300" />
              <span className="text-[9px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                {statusText}
              </span>
            </div>

            <h3 className="mt-4 font-sans text-sm font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight group-hover:underline cursor-pointer">
              <Link href={href}>{label}</Link>
            </h3>
            <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed">
              {description}
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Operational Node
            </span>
            <Link 
              href={href}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-900 hover:text-zinc-700 dark:text-zinc-50 dark:hover:text-zinc-300 transition-colors"
            >
              Access view
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
