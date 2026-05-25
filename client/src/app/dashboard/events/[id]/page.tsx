import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { EventForm } from "@/components/dashboard/events/event-form";
import { getEvent, getEventCategories } from "@/services/server/events";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const res = await getEvent(id);
  return {
    title: res.data?.title
      ? `Edit: ${res.data.title} | ABU Law Clinic`
      : "Edit Event | ABU Law Clinic",
  };
}

export default async function EditEventPage({ params }: Props) {
  const { id } = await params;

  const [eventRes, categoriesRes] = await Promise.all([
    getEvent(id),
    getEventCategories(),
  ]);

  if (!eventRes.data) notFound();

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
          Edit event
        </h1>
        <p className="mt-1 text-small text-muted-foreground">
          {eventRes.data.title}
        </p>
      </div>

      <EventForm
        event={eventRes.data}
        categories={categoriesRes.data ?? []}
        mode="edit"
      />
    </div>
  );
}
