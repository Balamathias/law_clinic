'use client'

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Inbox, Circle, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useHelpRequests, useHelpRequestStats } from "@/services/client/help-requests";
import Loader from "@/components/loader";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<string, {
  color: string;
  badge: string;
  accent: string;
  bg: string;
  label: string;
}> = {
  new: {
    color: "bg-amber-500",
    badge: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    accent: "bg-amber-500",
    bg: "hover:bg-amber-50/10 dark:hover:bg-amber-950/5 hover:border-amber-500/20",
    label: "New",
  },
  in_review: {
    color: "bg-blue-500",
    badge: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    accent: "bg-blue-500",
    bg: "hover:bg-blue-50/10 dark:hover:bg-blue-950/5 hover:border-blue-500/20",
    label: "In Review",
  },
  assigned: {
    color: "bg-purple-500",
    badge: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
    accent: "bg-purple-500",
    bg: "hover:bg-purple-50/10 dark:hover:bg-purple-950/5 hover:border-purple-500/20",
    label: "Assigned",
  },
  resolved: {
    color: "bg-emerald-500",
    badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    accent: "bg-emerald-500",
    bg: "hover:bg-emerald-50/10 dark:hover:bg-emerald-950/5 hover:border-emerald-500/20",
    label: "Resolved",
  },
  closed: {
    color: "bg-zinc-400",
    badge: "bg-zinc-500/10 text-zinc-700 dark:text-zinc-400 border-zinc-500/20",
    accent: "bg-zinc-400",
    bg: "hover:bg-zinc-50/20 dark:hover:bg-zinc-900/10 hover:border-zinc-500/20",
    label: "Closed",
  },
};

export default function HelpRequestsPage() {
  const searchParams = useSearchParams();
  
  const params: Record<string, any> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  const { data: requestsRes, isLoading: isRequestsLoading } = useHelpRequests({ params });
  const { data: statsRes, isLoading: isStatsLoading } = useHelpRequestStats();

  if (isRequestsLoading || isStatsLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader variant="dots" size={48} text="Loading help desk..." />
      </div>
    );
  }

  const s = statsRes?.data;
  const requests = requestsRes?.data ?? [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-1">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
            <Inbox className="size-3.5" />
            Legal Help Desk
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Triage Inbox
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl">
            {s?.total ?? 0} total requests · {s?.new ?? 0} new · {s?.in_review ?? 0} in review queue.
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-5">
        {[
          { label: "Total Intake", value: s?.total ?? 0, bg: "hover:bg-zinc-50/10 dark:hover:bg-zinc-950/5 hover:border-zinc-300 dark:hover:border-zinc-700", border: "bg-zinc-400", color: "text-foreground" },
          { label: "New Requests", value: s?.new ?? 0, bg: "hover:bg-amber-50/10 dark:hover:bg-amber-950/5 hover:border-amber-500/20", border: "bg-amber-500", color: "text-amber-600 dark:text-amber-400" },
          { label: "In Review", value: s?.in_review ?? 0, bg: "hover:bg-blue-50/10 dark:hover:bg-blue-950/5 hover:border-blue-500/20", border: "bg-blue-500", color: "text-blue-600 dark:text-blue-400" },
          { label: "Assigned Cases", value: s?.assigned ?? 0, bg: "hover:bg-purple-50/10 dark:hover:bg-purple-950/5 hover:border-purple-500/20", border: "bg-purple-500", color: "text-purple-600 dark:text-purple-400" },
          { label: "Resolved Cases", value: s?.resolved ?? 0, bg: "hover:bg-emerald-50/10 dark:hover:bg-emerald-950/5 hover:border-emerald-500/20", border: "bg-emerald-500", color: "text-emerald-600 dark:text-emerald-400" },
        ].map((card) => (
          <div 
            key={card.label} 
            className={cn(
              "group relative flex min-h-[100px] flex-col justify-between rounded-2xl border border-border bg-card p-4 text-foreground transition-all duration-300 shadow-xs overflow-hidden",
              card.bg
            )}
          >
            <div className={cn("absolute left-0 top-0 bottom-0 w-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300", card.border)} />
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {card.label}
            </p>
            <p className={cn("mt-2 font-serif text-3xl font-extrabold tracking-tight", card.color)}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Inbox List */}
      {requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center bg-muted/10">
          <div className="size-12 rounded-full bg-muted flex items-center justify-center border border-border">
            <Inbox className="size-6 text-muted-foreground/60" />
          </div>
          <p className="mt-4 text-sm font-bold text-foreground">
            Inbox is completely clear
          </p>
          <p className="mt-1 text-xs text-muted-foreground max-w-xs leading-relaxed">
            All active client intake requests have been resolved or assigned.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs divide-y divide-border">
          {requests.map((req) => {
            const config = STATUS_CONFIG[req.status] || STATUS_CONFIG.closed;
            return (
              <Link
                key={req.id}
                href={`/dashboard/help-requests/${req.id}`}
                className={cn(
                  "group relative flex items-start gap-4 px-6 py-5 border-l-4 border-l-transparent transition-all duration-300",
                  config.bg
                )}
              >
                {/* Visual left indicator on hover */}
                <div className={cn("absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300", config.accent)} />

                <span className="mt-1.5 shrink-0">
                  <span className="relative flex size-2.5">
                    {req.status === "new" && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    )}
                    <span className={cn("relative inline-flex rounded-full h-2.5 w-2.5", config.color)}></span>
                  </span>
                </span>
                
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-serif text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      {req.full_name}
                    </span>
                    <Badge variant="outline" className={cn("text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg", config.badge)}>
                      {config.label}
                    </Badge>
                    {req.assigned_to_name && (
                      <span className="text-xs text-muted-foreground font-semibold inline-flex items-center gap-1">
                        <ArrowRight className="size-3 text-muted-foreground" />
                        {req.assigned_to_name}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-xs text-muted-foreground font-medium">
                    <span className="font-bold text-foreground/80">
                      {req.legal_issue_type}
                    </span>{" "}
                    · {req.email} · {req.phone_number}
                  </p>
                  
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {req.description}
                  </p>
                </div>
                
                <span className="shrink-0 text-xs text-muted-foreground font-bold whitespace-nowrap inline-flex items-center gap-1">
                  <Clock className="size-3.5 text-muted-foreground/60" />
                  {new Date(req.created_at).toLocaleDateString("en-NG", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
