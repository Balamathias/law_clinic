'use client'

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Plus, Calendar, Users, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getEvents, getEventsStats } from "@/services/server/events";
import Loader from "@/components/loader";

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  scheduled: "secondary",
  in_progress: "default",
  completed: "outline",
  cancelled: "destructive",
  postponed: "outline",
};

export default function EventsPage() {
  const searchParams = useSearchParams();

  const params: Record<string, any> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  const { data: eventsRes, isLoading: isEventsLoading } = useQuery({
    queryKey: ["events-list", params],
    queryFn: () => getEvents({ params }),
  });

  const { data: statsRes, isLoading: isStatsLoading } = useQuery({
    queryKey: ["events-stats"],
    queryFn: () => getEventsStats(),
  });

  if (isEventsLoading || isStatsLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader variant="dots" size={48} text="Loading events..." />
      </div>
    );
  }

  const s = statsRes?.data;
  const events = eventsRes?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Events</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {s?.total ?? 0} total · {s?.upcoming ?? 0} upcoming · {s?.ongoing ?? 0} ongoing
          </p>
        </div>
        <Button asChild className="rounded-xl px-4 py-2">
          <Link href="/dashboard/events/new">
            <Plus className="size-4 mr-1.5" />
            New event
          </Link>
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total", value: s?.total ?? 0 },
          { label: "Upcoming", value: s?.upcoming ?? 0 },
          { label: "Ongoing", value: s?.ongoing ?? 0 },
          { label: "Cancelled", value: s?.cancelled ?? 0 },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-border bg-card p-4 shadow-sm"
          >
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{card.label}</p>
            <p className="mt-1.5 text-2xl font-bold tracking-tight text-foreground">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Events table */}
      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center bg-card/30">
          <Calendar className="size-10 text-muted-foreground/40" />
          <p className="mt-4 text-base font-semibold text-foreground">
            No events yet
          </p>
          <Button asChild className="mt-4 rounded-xl">
            <Link href="/dashboard/events/new">Create your first event</Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden bg-card shadow-xs">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-4 py-3.5 text-left font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
                  Title
                </th>
                <th className="hidden px-4 py-3.5 text-left font-semibold text-muted-foreground uppercase tracking-wider text-[10px] sm:table-cell">
                  Date
                </th>
                <th className="hidden px-4 py-3.5 text-left font-semibold text-muted-foreground uppercase tracking-wider text-[10px] lg:table-cell">
                  Location
                </th>
                <th className="px-4 py-3.5 text-left font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
                  Status
                </th>
                <th className="px-4 py-3.5 text-left font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
                  Registrations
                </th>
                <th className="px-4 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-foreground line-clamp-1">
                      {event.title}
                    </p>
                    {event.featured && (
                      <span className="text-[10px] font-bold text-primary tracking-wider uppercase">Featured</span>
                    )}
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                    <div className="flex items-center gap-1">
                      <Calendar className="size-3.5" />
                      {new Date(event.start_date).toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">
                    <div className="flex items-center gap-1 max-w-[180px] truncate">
                      <MapPin className="size-3.5 shrink-0" />
                      {event.location}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_VARIANTS[event.status] ?? "outline"} className="text-[10px] font-semibold uppercase tracking-wider">
                      {event.status.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="size-3.5" />
                      {event.registration_count ?? 0}
                      {event.max_participants
                        ? ` / ${event.max_participants}`
                        : ""}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Button asChild variant="outline" size="sm" className="rounded-lg text-xs font-semibold h-8">
                        <Link href={`/dashboard/events/${event.slug}/registrations`}>
                          Registrations
                        </Link>
                      </Button>
                      <Button asChild variant="ghost" size="sm" className="rounded-lg text-xs font-semibold h-8">
                        <Link href={`/dashboard/events/${event.slug}`}>Edit</Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
