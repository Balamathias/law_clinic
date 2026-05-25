import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Calendar, Users, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getEvents, getEventsStats } from "@/services/server/events";

export const metadata: Metadata = {
  title: "Events | ABU Law Clinic",
  description: "Manage clinic events and registrations.",
};

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  scheduled: "secondary",
  in_progress: "default",
  completed: "outline",
  cancelled: "destructive",
  postponed: "outline",
};

interface Props {
  searchParams: Promise<Record<string, any>>;
}

export default async function EventsPage({ searchParams: _sp }: Props) {
  const searchParams = await _sp;

  const [events, stats] = await Promise.all([
    getEvents({ params: searchParams }),
    getEventsStats(),
  ]);

  const s = stats.data;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-h3 font-semibold text-foreground">Events</h1>
          <p className="mt-1 text-small text-muted-foreground">
            {s?.total ?? 0} total · {s?.upcoming ?? 0} upcoming · {s?.ongoing ?? 0} ongoing
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/events/new">
            <Plus className="size-4" />
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
            className="rounded-xl border border-border bg-card p-4"
          >
            <p className="text-small text-muted-foreground">{card.label}</p>
            <p className="mt-1 text-h4 font-semibold">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Events table */}
      {(events.data?.length ?? 0) === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center">
          <Calendar className="size-10 text-muted-foreground/40" />
          <p className="mt-4 text-base font-medium text-muted-foreground">
            No events yet
          </p>
          <Button asChild className="mt-6">
            <Link href="/dashboard/events/new">Create your first event</Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-small">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Title
                </th>
                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground sm:table-cell">
                  Date
                </th>
                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground lg:table-cell">
                  Location
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Registrations
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {events.data?.map((event) => (
                <tr key={event.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground line-clamp-1">
                      {event.title}
                    </p>
                    {event.featured && (
                      <span className="text-xs text-primary">Featured</span>
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
                    <Badge variant={STATUS_VARIANTS[event.status] ?? "outline"}>
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
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/dashboard/events/${event.slug}/registrations`}>
                          Registrations
                        </Link>
                      </Button>
                      <Button asChild variant="ghost" size="sm">
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
