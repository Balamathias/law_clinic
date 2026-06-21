'use client'

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Inbox, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useHelpRequests, useHelpRequestStats } from "@/services/client/help-requests";
import Loader from "@/components/loader";

const STATUS_COLORS: Record<string, string> = {
  new: "bg-amber-500",
  in_review: "bg-blue-500",
  assigned: "bg-purple-500",
  resolved: "bg-green-500",
  closed: "bg-gray-400",
};

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  new: "default",
  in_review: "secondary",
  assigned: "outline",
  resolved: "outline",
  closed: "outline",
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
        <Loader variant="dots" size={48} text="Loading inbox..." />
      </div>
    );
  }

  const s = statsRes?.data;
  const requests = requestsRes?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Help Requests Inbox
          </h1>
          <p className="mt-1 text-xs text-muted-foreground font-medium">
            {s?.total ?? 0} total · {s?.new ?? 0} new · {s?.in_review ?? 0} in review
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-5">
        {[
          { label: "Total", value: s?.total ?? 0, bg: "bg-zinc-50/50 dark:bg-zinc-900/20" },
          { label: "New", value: s?.new ?? 0, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/5" },
          { label: "In review", value: s?.in_review ?? 0, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/5" },
          { label: "Assigned", value: s?.assigned ?? 0, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-500/5" },
          { label: "Resolved", value: s?.resolved ?? 0, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/5" },
        ].map((card) => (
          <div key={card.label} className={`rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 ${card.bg} p-4 shadow-sm`}>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{card.label}</p>
            <p className={`mt-1.5 text-2xl font-bold tracking-tight ${card.color ?? "text-zinc-900 dark:text-zinc-50"}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Inbox list */}
      {requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 py-20 text-center bg-zinc-50/20">
          <Inbox className="size-10 text-muted-foreground/40" />
          <p className="mt-4 text-base font-medium text-muted-foreground">
            Inbox is empty
          </p>
          <p className="mt-1 text-small text-muted-foreground">
            New help requests will appear here.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-zinc-200/60 dark:divide-zinc-800/60 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
          {requests.map((req) => (
            <Link
              key={req.id}
              href={`/dashboard/help-requests/${req.id}`}
              className="flex items-start gap-4 px-5 py-4 hover:bg-zinc-50/40 dark:hover:bg-zinc-900/10 transition-colors group"
            >
              <span className="mt-1.5 shrink-0">
                <Circle
                  className={`size-2.5 fill-current ${
                    STATUS_COLORS[req.status]?.replace("bg-", "text-") ??
                    "text-gray-400"
                  }`}
                />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-primary transition-colors">
                    {req.full_name}
                  </span>
                  <Badge variant={STATUS_VARIANTS[req.status] ?? "outline"} className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5">
                    {req.status.replace("_", " ")}
                  </Badge>
                  {req.assigned_to_name && (
                    <span className="text-xs text-muted-foreground font-medium">
                      → {req.assigned_to_name}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground font-medium">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                    {req.legal_issue_type}
                  </span>{" "}
                  · {req.email} · {req.phone_number}
                </p>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                  {req.description}
                </p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground font-semibold whitespace-nowrap">
                {new Date(req.created_at).toLocaleDateString("en-NG", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
