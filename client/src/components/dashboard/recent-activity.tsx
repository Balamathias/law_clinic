"use client";

import { Activity, Calendar, FileText, Inbox, Users, ArrowRight, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
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
    color: "from-blue-500/20 to-indigo-500/20 text-blue-600 dark:text-blue-400",
    statusText: "Ready for triage",
  },
  {
    icon: Calendar,
    label: "Events & Education",
    description: "Manage community programs, workshops, and attendee limits",
    href: "/dashboard/events",
    color: "from-purple-500/20 to-pink-500/20 text-purple-600 dark:text-purple-400",
    statusText: "Active schedules",
  },
  {
    icon: Activity,
    label: "Media & Core Assets",
    description: "Review R2-stored files, sponsor logs, and clinic profiles",
    href: "/dashboard",
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400",
    statusText: "Fully optimized",
  },
];

const ADMIN_ROWS = [
  {
    icon: Inbox,
    label: "Legal Help Desk",
    description: "Review incoming client intake and coordinate student triage",
    href: "/dashboard/help-requests",
    color: "from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400",
    statusText: "Real-time inbox",
  },
  {
    icon: Users,
    label: "Student & Staff Roster",
    description: "Configure administrative privileges and assign case loads",
    href: "/dashboard/users",
    color: "from-rose-500/20 to-red-500/20 text-rose-600 dark:text-rose-400",
    statusText: "System directory",
  },
];

export default function RecentActivity({ isAdmin = false }: RecentActivityProps) {
  const rows = isAdmin ? [...STAFF_ROWS, ...ADMIN_ROWS] : STAFF_ROWS;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
    >
      {rows.map(({ icon: Icon, label, description, href, color, statusText }) => (
        <motion.div
          key={label}
          variants={item}
          className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/60 p-5 shadow-xs transition-all duration-300 hover:border-primary/20 hover:shadow-md"
        >
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-radial-gradient from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          
          <div>
            <div className="flex items-center justify-between">
              <div className={cn("flex size-10 items-center justify-center rounded-xl bg-gradient-to-br border border-border/40 shadow-2xs transition-transform duration-300 group-hover:scale-105", color)}>
                <Icon className="size-5" />
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted/65 px-2.5 py-0.5 rounded-full">
                <Clock className="size-2.5 text-primary" />
                {statusText}
              </span>
            </div>

            <h3 className="mt-4 font-serif text-lg font-semibold text-foreground tracking-tight group-hover:text-primary transition-colors">
              {label}
            </h3>
            <p className="mt-2 text-small leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Operational Node</span>
            <Link 
              href={href}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              Access view
              <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
