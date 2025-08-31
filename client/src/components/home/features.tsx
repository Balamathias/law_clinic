"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import React from "react"

interface FeatureItem {
    title: string
    description: string
    icon: React.ReactNode
    accent?: string
}

const features: FeatureItem[] = [
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
            </svg>
        ),
        title: "Legal Consultation",
        description: "Free guidance to understand your rights, obligations, and available pathways before critical decisions are made.",
        accent: "from-primary/25 via-primary/10 to-transparent"
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
            </svg>
        ),
        title: "Legal Education",
        description: "Workshops & awareness programs that empower communities with practical knowledge of core legal protections.",
        accent: "from-primary/20 via-primary/5 to-transparent"
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z" />
            </svg>
        ),
        title: "Representation",
        description: "Guided advocacy & supervised student participation ensuring ethical, client‑centered outcomes.",
        accent: "from-primary/25 via-primary/10 to-transparent"
    }
]

// Motion variants (respect reduced motion)
const makeVariants = (reduce: boolean) => ({
    section: {
        hidden: { opacity: 0, y: reduce ? 0 : 32 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }
    },
    card: {
        hidden: { opacity: 0, y: reduce ? 0 : 28, scale: reduce ? 1 : 0.97 },
        show: (i: number) => ({
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.55, ease: 'easeOut', delay: reduce ? 0 : 0.08 * i }
        })
    }
})

export default function Features() {
    const reduce = useReducedMotion()
    const variants = makeVariants(!!reduce)

    return (
        <section
            aria-labelledby="features-heading"
            className="relative py-20 md:py-28 overflow-hidden"
        >
            {/* Background accents */}
            <div aria-hidden className="pointer-events-none absolute inset-0">
                <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-primary/15 blur-3xl opacity-40" />
                <div className="absolute bottom-0 -left-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background" />
            </div>

            <div className="container max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
                <motion.header
                    variants={variants.section}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-140px' }}
                    className="text-center max-w-3xl mx-auto mb-14"
                >
                    <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-[0.65rem] sm:text-xs font-semibold tracking-wider uppercase text-primary ring-1 ring-primary/25">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> Our Services
                    </span>
                    <h2 id="features-heading" className="mt-6 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                        <span className="bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">What We Do</span>
                    </h2>
                    <p className="mt-6 text-muted-foreground text-base sm:text-lg leading-relaxed">
                        Tailored legal aid, education, and supervised representation—empowering individuals while training the next generation of ethical advocates.
                    </p>
                </motion.header>

                <div className="grid gap-6 md:gap-8 md:grid-cols-3 relative">
                    {features.map((f, i) => (
                        <motion.article
                            key={f.title}
                            variants={variants.card}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, margin: '-80px' }}
                            custom={i}
                            className="group relative rounded-2xl p-[1px] overflow-hidden"
                        >
                            {/* Border gradient frame */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/5 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />
                            <div className="relative h-full rounded-[inherit] bg-background/80 dark:bg-neutral-950/70 backdrop-blur-xl ring-1 ring-white/10 flex flex-col px-6 py-7 md:px-7 md:py-8 shadow-sm group-hover:shadow-md transition-[box-shadow,transform] duration-300">
                                <div className="absolute -top-20 -right-14 h-40 w-40 bg-gradient-to-br from-primary/25 via-primary/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-60 transition-opacity" aria-hidden />
                                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20 text-primary group-hover:bg-primary/15 group-hover:shadow-sm transition-colors">
                                    {f.icon}
                                </div>
                                <h3 className="text-lg md:text-xl font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
                                    {f.title}
                                </h3>
                                <p className="mt-3 text-sm md:text-[0.94rem] leading-relaxed text-muted-foreground">
                                    {f.description}
                                </p>
                                <div className="mt-6">
                                    <Button variant="ghost" size="sm" className="group/btn h-8 px-3 rounded-full text-xs font-medium tracking-wide">
                                        Learn more
                                        <ArrowRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover/btn:translate-x-0.5" />
                                    </Button>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: reduce ? 0 : 0.4, duration: 0.6 }}
                    className="text-center mt-16"
                >
                    <Button asChild className="rounded-full h-12 px-8 text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30">
                        <a href="/services" aria-label="Explore all services offered by the clinic">Explore Our Services</a>
                    </Button>
                </motion.div>
            </div>
        </section>
    )
}