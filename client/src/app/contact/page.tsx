import Link from 'next/link'
import { CalendarClock, Mail, MapPin, Phone, Scale } from 'lucide-react'
import type { Metadata } from 'next'

import Footer from '@/components/footer'
import { SiteHeader } from '@/components/site-header'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Contact ~ Law Clinic ~ Ahmadu Bello University',
  description: 'Contact the ABU Law Clinic for legal aid, partnerships, and general enquiries.',
}

const contactCards = [
  {
    icon: MapPin,
    title: 'Visit the clinic',
    body: '2nd Floor, Faculty of Law, Ahmadu Bello University, Kongo Campus, Zaria',
  },
  {
    icon: Mail,
    title: 'Email',
    body: 'hello@abulawclinic.com',
    href: 'mailto:hello@abulawclinic.com',
  },
  {
    icon: Phone,
    title: 'Phone',
    body: '+234 123 456 7890',
    href: 'tel:+2341234567890',
  },
  {
    icon: CalendarClock,
    title: 'Office hours',
    body: 'Monday to Friday, 9:00 AM - 4:00 PM',
  },
]

export default function ContactPage() {
  return (
    <main className="overflow-hidden">
      <SiteHeader />
      <section className="bg-background py-28 md:py-36">
        <div className="container-editorial">
          <div className="max-w-3xl">
            <span className="text-eyebrow inline-flex items-center gap-2">
              <Scale className="size-4 text-primary" />
              Contact
            </span>
            <h1 className="text-h1-editorial mt-5 text-foreground">Reach the ABU Law Clinic</h1>
            <p className="text-lede mt-5">
              Send an enquiry, ask about partnerships, or begin a legal help request. We will route
              your message to the appropriate clinic team.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {contactCards.map(({ icon: Icon, title, body, href }) => {
              const content = (
                <div className="h-full rounded-xl border border-border bg-card p-6 transition-colors hover:border-border-strong">
                  <Icon className="size-5 text-primary" aria-hidden />
                  <h2 className="mt-5 font-serif text-2xl font-semibold text-foreground">{title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
                </div>
              )

              return href ? (
                <a key={title} href={href} className="block">
                  {content}
                </a>
              ) : (
                <div key={title}>{content}</div>
              )
            })}
          </div>

          <div className="mt-12 rounded-xl border border-border bg-surface-muted p-6 md:p-8">
            <h2 className="font-serif text-2xl font-semibold text-foreground">Need legal assistance?</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              The fastest way to request support is through the clinic intake form. It helps us
              capture the details needed for review.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <Link href="/get-help">Start intake</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/faq">Read FAQ</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
