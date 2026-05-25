import Image from 'next/image'
import Link from 'next/link'
import { Calendar, MapPin } from 'lucide-react'
import type { Metadata } from 'next'
import { format } from 'date-fns'

import Footer from '@/components/footer'
import { SiteHeader } from '@/components/site-header'
import { Button } from '@/components/ui/button'
import { getEvents } from '@/services/server/events'

export const metadata: Metadata = {
  title: 'Events ~ Ahmadu Bello University Law Clinic',
  description: 'Upcoming and recent events from the ABU Law Clinic.',
}

export default async function EventsPage() {
  const { data: events } = await getEvents({ params: { ordering: 'start_date' } })

  return (
    <main className="overflow-hidden">
      <SiteHeader />
      <section className="bg-background py-28 md:py-36">
        <div className="container-editorial">
          <div className="max-w-3xl">
            <span className="text-eyebrow inline-flex items-center gap-2">
              <Calendar className="size-4 text-primary" />
              Events
            </span>
            <h1 className="text-h1-editorial mt-5 text-foreground">Clinic events and workshops</h1>
            <p className="text-lede mt-5">
              Browse public legal education sessions, workshops, and clinic programmes.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {(events || []).map((event) => {
              const date = event.start_date ? new Date(event.start_date) : null
              const href = `/events/${event.slug || event.id}`

              return (
                <article key={event.id} className="overflow-hidden rounded-xl border border-border bg-card">
                  <div className="relative aspect-video bg-muted">
                    {event.image ? (
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-primary/40">
                        <Calendar className="size-12" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-primary">
                      {date ? format(date, 'MMM d, yyyy') : 'Date to be announced'}
                    </p>
                    <h2 className="mt-3 line-clamp-2 font-serif text-2xl font-semibold text-foreground">
                      {event.title}
                    </h2>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                      {event.short_description || event.description || 'Details coming soon.'}
                    </p>
                    <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="size-4 text-primary" />
                      <span className="line-clamp-1">{event.location || 'Location to be announced'}</span>
                    </div>
                    <Button asChild variant="outline" className="mt-6 w-full">
                      <Link href={href}>View event</Link>
                    </Button>
                  </div>
                </article>
              )
            })}
          </div>

          {(!events || events.length === 0) && (
            <div className="mt-12 rounded-xl border border-dashed border-border bg-card p-10 text-center">
              <h2 className="font-serif text-2xl font-semibold text-foreground">No events yet</h2>
              <p className="mt-2 text-muted-foreground">Check back soon for upcoming clinic events.</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  )
}
