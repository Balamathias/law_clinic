import Link from 'next/link'
import { CheckCircle2, HelpCircle } from 'lucide-react'

import Footer from '@/components/footer'
import { SiteHeader } from '@/components/site-header'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Request Submitted ~ Law Clinic ~ Ahmadu Bello University',
  description: 'Your legal help request has been submitted to the ABU Law Clinic.',
}

export default function SubmittedPage() {
  return (
    <main className="overflow-hidden">
      <SiteHeader />
      <section className="bg-background py-28 md:py-36">
        <div className="container-prose text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CheckCircle2 className="size-8" aria-hidden />
          </div>
          <h1 className="text-h1-editorial mt-8 text-foreground">Request submitted</h1>
          <p className="text-lede mt-5">
            Thank you for reaching out. The clinic team will review your request and contact you
            with the next available step.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/faq">
                <HelpCircle className="size-4" />
                Visit FAQ
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Return home</Link>
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
