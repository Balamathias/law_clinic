import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { EventForm } from "@/components/dashboard/events/event-form";
import { getEventCategories } from "@/services/server/events";

export const metadata: Metadata = {
  title: "New Event | ABU Law Clinic",
};

export default async function NewEventPage() {
  const { data: categories } = await getEventCategories();

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
          New event
        </h1>
      </div>

      <EventForm categories={categories ?? []} mode="create" />
    </div>
  );
}
