import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, MapPin, Users, ChevronLeft, ArrowRight, Share2, Globe, Clock } from "lucide-react";
import { format } from "date-fns";

import Footer from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getEvent, checkEventRegistration } from "@/services/server/events";
import { getUser } from "@/services/server/auth";
import { EventRegisterButton } from "@/components/dashboard/events/event-register-button";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const res = await getEvent(slug);
  return {
    title: res.data
      ? `${res.data.title} | Events | ABU Law Clinic`
      : "Event Details | ABU Law Clinic",
    description: res.data?.short_description || res.data?.description?.slice(0, 150),
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;

  const [eventRes, userRes] = await Promise.all([
    getEvent(slug),
    getUser(),
  ]);

  if (!eventRes.data) notFound();

  const event = eventRes.data;
  const currentUser = userRes.data;

  // Check if current user is registered
  let isRegistered = false;
  if (currentUser) {
    const regCheck = await checkEventRegistration(event.slug);
    isRegistered = !!regCheck.data?.is_registered;
  }

  const startDate = event.start_date ? new Date(event.start_date) : null;
  const endDate = event.end_date ? new Date(event.end_date) : null;
  const deadline = event.registration_deadline ? new Date(event.registration_deadline) : null;

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      <section className="pt-28 pb-20 md:pt-36">
        <div className="container-editorial">
          {/* Back button */}
          <Link
            href="/events"
            className="inline-flex items-center gap-1 text-small text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ChevronLeft className="size-4" />
            Back to events
          </Link>

          {/* Grid Layout */}
          <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
            {/* Left Content column */}
            <div className="space-y-8">
              {/* Event Header Info */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 items-center">
                  <Badge variant={event.status === "scheduled" ? "secondary" : "outline"}>
                    {event.status.replace("_", " ")}
                  </Badge>
                  {event.featured && <Badge variant="default">Featured</Badge>}
                  {event.category_name && (
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                      {event.category_name}
                    </Badge>
                  )}
                </div>
                <h1 className="text-h1-editorial font-serif text-foreground leading-tight">
                  {event.title}
                </h1>
                {event.short_description && (
                  <p className="text-lede text-muted-foreground">
                    {event.short_description}
                  </p>
                )}
              </div>

              {/* Cover Image */}
              <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl bg-muted border border-border">
                {event.image ? (
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    priority
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground/30">
                    <Calendar className="size-20" />
                  </div>
                )}
              </div>

              {/* Event Description (Markdown) */}
              <div className="prose-editorial max-w-none text-ink">
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
                  About this Event
                </h2>
                <div className="whitespace-pre-wrap leading-relaxed">
                  {event.description}
                </div>
              </div>
            </div>

            {/* Right Sidebar column */}
            <div className="space-y-6">
              {/* Event Quick Info Card */}
              <div className="rounded-2xl border border-border bg-card p-6 space-y-6 shadow-sm sticky top-28">
                <h3 className="font-serif text-xl font-semibold text-foreground">
                  Event Details
                </h3>

                {/* Timing */}
                <div className="flex gap-3">
                  <Clock className="size-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-small font-semibold text-foreground">Date & Time</h4>
                    <p className="text-small text-muted-foreground mt-0.5">
                      {startDate ? format(startDate, "EEEE, MMMM d, yyyy") : "TBA"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {startDate ? format(startDate, "h:mm a") : ""}
                      {endDate ? ` - ${format(endDate, "h:mm a")}` : ""}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex gap-3">
                  <MapPin className="size-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-small font-semibold text-foreground">Location</h4>
                    <p className="text-small text-muted-foreground mt-0.5">
                      {event.location}
                    </p>
                    {event.virtual_link && (
                      <a
                        href={event.virtual_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
                      >
                        <Globe className="size-3" />
                        Join Virtual Meeting
                      </a>
                    )}
                  </div>
                </div>

                {/* Registration Info */}
                {event.registration_required && (
                  <div className="flex gap-3 border-t border-border pt-4">
                    <Users className="size-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-small font-semibold text-foreground">Capacity & Deadline</h4>
                      <p className="text-small text-muted-foreground mt-0.5">
                        {event.max_participants > 0
                          ? `${event.registration_count ?? 0} registered (${event.max_participants} spots total)`
                          : "Unlimited spots"}
                      </p>
                      {deadline && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Deadline: {format(deadline, "MMM d, yyyy 'at' h:mm a")}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Registration Button / Call To Action */}
                <div className="border-t border-border pt-4">
                  {event.registration_required ? (
                    <EventRegisterButton
                      event={event}
                      currentUser={currentUser}
                      isRegisteredInitial={isRegistered}
                    />
                  ) : (
                    <div className="rounded-lg bg-muted/40 p-3 text-center text-small font-medium text-muted-foreground border border-border/40">
                      No registration required. Open to everyone.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
