import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Users, Check, X } from "lucide-react";
import { getEvent, getEventRegistrations } from "@/services/server/events";
import { Badge } from "@/components/ui/badge";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const res = await getEvent(id);
  return {
    title: res.data ? `Registrations: ${res.data.title} | ABU Law Clinic` : "Event Registrations",
  };
}

export default async function EventRegistrationsPage({ params }: Props) {
  const { id } = await params;

  const [eventRes, registrationsRes] = await Promise.all([
    getEvent(id),
    getEventRegistrations({ params: { event__slug: id } }),
  ]);

  if (!eventRes.data) notFound();

  const event = eventRes.data;
  const registrations = registrationsRes.data ?? [];

  const attended = registrations.filter((r) => r.attended).length;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard/events"
          className="inline-flex items-center gap-1 text-small text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="size-3.5" />
          Events
        </Link>
        <h1 className="mt-2 text-h3 font-semibold text-foreground">
          Registrations
        </h1>
        <p className="mt-1 text-small text-muted-foreground">
          {event.title} — {registrations.length} registered, {attended} attended
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Registered", value: registrations.length },
          { label: "Attended", value: attended },
          {
            label: "Capacity",
            value: event.max_participants
              ? `${registrations.length} / ${event.max_participants}`
              : "Unlimited",
          },
        ].map((card) => (
          <div key={card.label} className="rounded-xl border border-border bg-card p-4">
            <p className="text-small text-muted-foreground">{card.label}</p>
            <p className="mt-1 text-h4 font-semibold">{card.value}</p>
          </div>
        ))}
      </div>

      {registrations.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center">
          <Users className="size-10 text-muted-foreground/40" />
          <p className="mt-4 text-base font-medium text-muted-foreground">
            No registrations yet
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-x-auto">
          <table className="w-full text-small">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Participant
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Email
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Registered at
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Attended
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {registrations.map((reg) => (
                <tr
                  key={reg.id}
                  className="hover:bg-muted/20 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-foreground">
                    {reg.user_details
                      ? `${reg.user_details.first_name ?? ""} ${reg.user_details.last_name ?? ""}`.trim() ||
                        reg.user_details.username
                      : reg.user}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {reg.user_details?.email ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(reg.registered_at).toLocaleString("en-NG")}
                  </td>
                  <td className="px-4 py-3">
                    {reg.attended ? (
                      <Badge variant="default" className="gap-1">
                        <Check className="size-3" /> Yes
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1 text-muted-foreground">
                        <X className="size-3" /> No
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate">
                    {reg.notes ?? "—"}
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
