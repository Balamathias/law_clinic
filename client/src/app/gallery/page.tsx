import { Image as ImageIcon } from 'lucide-react'
import type { Metadata } from 'next'

import Footer from '@/components/footer'
import GalleryShowcase from '@/components/gallery-showcase'
import { SiteHeader } from '@/components/site-header'
import { getGalleries } from '@/services/server/app_settings'

export const metadata: Metadata = {
  title: 'Gallery ~ Ahmadu Bello University Law Clinic',
  description: 'Photo galleries from ABU Law Clinic programmes, events, and teams.',
}

export default async function GalleryPage() {
  const { data: galleries } = await getGalleries({ params: { ordering: 'ordering' } })
  const visibleGalleries = galleries || []

  return (
    <main className="overflow-hidden">
      <SiteHeader />
      <section className="bg-background py-28 md:py-36">
        <div className="container-editorial">
          <div className="max-w-3xl">
            <span className="text-eyebrow inline-flex items-center gap-2">
              <ImageIcon className="size-4 text-primary" />
              Gallery
            </span>
            <h1 className="text-h1-editorial mt-5 text-foreground">Clinic life in pictures</h1>
            <p className="text-lede mt-5">
              A visual archive of outreach, education, executive teams, and community work.
            </p>
          </div>

          <div className="mt-12 space-y-12">
            {visibleGalleries.map((gallery) => (
              <GalleryShowcase
                key={gallery.id}
                gallery={gallery}
                className="rounded-xl border border-border bg-card p-6"
              />
            ))}
          </div>

          {visibleGalleries.length === 0 && (
            <div className="mt-12 rounded-xl border border-dashed border-border bg-card p-10 text-center">
              <h2 className="font-serif text-2xl font-semibold text-foreground">No gallery yet</h2>
              <p className="mt-2 text-muted-foreground">Gallery collections will appear here once available.</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  )
}
