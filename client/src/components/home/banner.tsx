"use client"

// Reimagined Banner: more modular, prop-driven, accessible & hydration-safe.
import React, { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '../ui/button'
import { motion, useScroll, useTransform, useReducedMotion, useInView, useMotionValue, useSpring } from 'framer-motion'
import { ArrowRight, Users, FileText, Building, Handshake, PlayCircle, Sparkles } from 'lucide-react'

// -------------------- Types & Defaults --------------------
export interface BannerStat {
  label: string
  value: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  description?: string
}

export interface BannerImage {
  src: string
  alt: string
  badge?: string
  size?: 'lg' | 'md' | 'sm'
}

interface BannerProps {
  headingPrimary?: string
  headingAccent?: string
  headingSupporting?: string
  tagline?: string
  ctaPrimaryHref?: string
  ctaPrimaryLabel?: string
  ctaSecondaryLabel?: string
  stats?: BannerStat[]
  images?: BannerImage[]
  enableParticles?: boolean
}

const DEFAULT_IMAGES: BannerImage[] = [
  { src: '/images/banner/clinic-image-1.jpg', alt: 'Students at outreach event', badge: 'Outreach Event', size: 'lg' },
  { src: '/images/banner/clinic-image-2.jpg', alt: 'Community action session', badge: 'Community Action', size: 'md' },
  { src: '/images/banner/clinic-image-3.jpg', alt: 'ABU team group photo', badge: 'ABU Team', size: 'sm' },
]

const DEFAULT_STATS: BannerStat[] = [
  { label: 'Law Students', value: '500+', icon: Users, description: 'Active members in our community' },
  { label: 'Cases Handled', value: '1000+', icon: FileText, description: 'Successfully resolved cases' },
  { label: 'Years of Service', value: '40+', icon: Building, description: 'Decades of legal excellence' },
  { label: 'Community Impact', value: 'High', icon: Handshake, description: 'Transforming lives daily' },
]

// -------------------- Animated Counter --------------------
const AnimatedCounter: React.FC<{ value: string; duration?: number }> = ({ value, duration = 1.8 }) => {
  // Handle non numeric values gracefully
  const numericPart = value.match(/\d+/)?.[0]
  if (!numericPart) {
    return <span>{value}</span>
  }
  const suffix = value.slice(numericPart.length)
  const ref = useRef<HTMLSpanElement | null>(null)
  const inView = useInView(ref, { once: true, margin: '-20% 0px' })
  const count = useMotionValue(0)
  const spring = useSpring(count, { stiffness: 90, damping: 15 })
  const target = parseInt(numericPart, 10)

  useEffect(() => {
    if (inView) count.set(target)
  }, [inView, target, count])

  const [display, setDisplay] = useState('0')
  useEffect(() => {
    const unsub = spring.on('change', (v) => {
      setDisplay(Math.round(v).toString())
    })
    return () => unsub()
  }, [spring])

  return (
    <span ref={ref} aria-label={`${display}${suffix}`}> 
      <motion.span
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {display}
        <span className="ml-0.5">{suffix}</span>
      </motion.span>
    </span>
  )
}

// -------------------- Floating Card Wrapper --------------------
const FloatingCard: React.FC<{ delay?: number; className?: string; children: React.ReactNode }> = ({ delay = 0, className, children }) => {
  const shouldReduceMotion = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={{ y: 25, opacity: 0 }}
      animate={{
        y: shouldReduceMotion ? 0 : [-8, 8, -8],
        opacity: 1
      }}
      transition={shouldReduceMotion ? { delay } : {
        y: { repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay },
        opacity: { duration: 0.7, delay }
      }}
    >
      {children}
    </motion.div>
  )
}

// -------------------- Variants --------------------
const variants = {
  container: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.15 } }
  },
  item: {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 0.1, 0.25, 1] } }
  }
}

// -------------------- Banner Component --------------------
const Banner: React.FC<BannerProps> = ({
  headingPrimary = 'Creating a supportive',
  headingAccent = 'network',
  headingSupporting = 'where law students thrive together',
  tagline = 'Join our community of passionate advocates working to provide quality legal services to those who need it most while building the skills to become exceptional legal professionals.',
  ctaPrimaryHref = '/get-help',
  ctaPrimaryLabel = 'Get Legal Help',
  ctaSecondaryLabel = 'Learn More About Us',
  stats = DEFAULT_STATS,
  images = DEFAULT_IMAGES,
  enableParticles = true,
}) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: rootRef, offset: ['start start', 'end start'] })

  // Parallax transforms
  const makeY = (min: number, max: number) => useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? min : max])
  const yLarge = makeY(60, 160)
  const yMedium = makeY(80, 300)
  const ySmall = makeY(50, 200)
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.35])

  // Hydration-safe particles (avoid Math.random mismatch)
  const [particleSeeds, setParticleSeeds] = useState<number[]>([])
  useEffect(() => {
    if (enableParticles) {
      setParticleSeeds(Array.from({ length: 18 }, () => Math.random()))
    }
  }, [enableParticles])

  // Derived layout map for images
  const imageLayout = useMemo(() => {
    // enforce expected order by size or fallback
    const ordered = [
      images.find(i => i.size === 'lg') || images[0],
      images.find(i => i.size === 'md') || images[1] || images[0],
      images.find(i => i.size === 'sm') || images[2] || images[0],
    ]
    return ordered
  }, [images])

  return (
    <section
      ref={rootRef}
      aria-labelledby="banner-heading"
      className="relative overflow-hidden py-16 sm:py-20 md:py-28 lg:py-32 bg-neutral-950"
    >
      {/* Decorative gradient background */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -left-40 w-[28rem] h-[28rem] rounded-full bg-gradient-to-br from-primary/25 via-primary/10 to-transparent blur-3xl"
          animate={shouldReduceMotion ? {} : { scale: [1, 1.18, 1], opacity: [0.35, 0.65, 0.35] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-48 -right-48 w-[34rem] h-[34rem] rounded-full bg-gradient-to-tl from-primary/20 via-primary/10 to-transparent blur-3xl"
          animate={shouldReduceMotion ? {} : { scale: [1.15, 1, 1.15], opacity: [0.25, 0.55, 0.25] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute inset-0 opacity-[0.025] mix-blend-overlay">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)',
              backgroundSize: '52px 52px'
            }}
          />
        </div>
        {/* Optional floating particles */}
        {enableParticles && particleSeeds.length > 0 && (
          <div className="absolute inset-0">
            {particleSeeds.map((seed, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-primary/30"
                style={{ left: `${seed * 100}%`, top: `${(seed * 977) % 100}%` }}
                animate={shouldReduceMotion ? {} : { y: [-18, 18], opacity: [0.2, 0.85, 0.2] }}
                transition={{ duration: 3 + (seed * 2), repeat: Infinity, delay: seed * 2, ease: 'easeInOut' }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="relative z-10 container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={variants.container}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center"
        >
          {/* Text Column */}
            <motion.div variants={variants.item} className="space-y-7 md:space-y-9 lg:pr-8">
              <motion.div
                whileHover={{ scale: 1.04 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                className="inline-flex items-center gap-2.5 rounded-full bg-white/10 px-4 py-2 ring-1 ring-white/15 backdrop-blur-xl shadow-lg"
              >
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-[11px] sm:text-xs font-semibold tracking-wide text-white/90 uppercase">Empowering Justice, Defending Rights</span>
              </motion.div>

              <div className="space-y-5">
                <h1 id="banner-heading" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[0.95] text-white tracking-tight">
                  <span className="block">{headingPrimary}</span>
                  <span className="block bg-gradient-to-r from-primary-200 via-primary to-primary-400 bg-clip-text text-transparent">{headingAccent}</span>
                  <span className="block text-white/85 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mt-2">{headingSupporting}</span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-white/70 leading-relaxed max-w-2xl font-light">
                  {tagline}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 pt-2">
                <Button
                  asChild
                  className="group bg-primary hover:bg-primary/90 text-white px-8 py-4 h-14 rounded-2xl text-base font-semibold shadow-2xl shadow-primary/30 hover:shadow-primary/40 transition-all duration-300"
                >
                  <Link href={ctaPrimaryHref} aria-label={ctaPrimaryLabel} className="flex items-center gap-3">
                    <span>{ctaPrimaryLabel}</span>
                    <motion.span
                      animate={shouldReduceMotion ? {} : { x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </motion.span>
                  </Link>
                </Button>
                <motion.button
                  type="button"
                  aria-label={ctaSecondaryLabel}
                  className="group flex items-center gap-3 text-white/80 hover:text-white"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm ring-1 ring-white/20 flex items-center justify-center group-hover:bg-white/15 transition-colors">
                      <PlayCircle className="h-6 w-6 text-primary" />
                    </div>
                    <motion.div
                      className="absolute -inset-1 rounded-full border-2 border-primary/40"
                      animate={shouldReduceMotion ? {} : { scale: [1, 1.22, 1], opacity: [0.55, 0, 0.55] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  </div>
                  <span className="font-medium">{ctaSecondaryLabel}</span>
                </motion.button>
              </div>
            </motion.div>

          {/* Media Column */}
          <motion.div style={{ opacity }} variants={variants.item} className="relative lg:order-2">
            <div className="relative h-[420px] sm:h-[520px] lg:h-[620px]">
              {/* Primary */}
              <FloatingCard delay={0.15} className="absolute top-0 left-0 w-[70%] h-[75%] z-20">
                <motion.div
                  className="group relative size-full overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10 bg-neutral-800/30"
                  style={{ y: yLarge }}
                  whileHover={{ scale: 1.04 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                >
                  <Image src={imageLayout[0].src} alt={imageLayout[0].alt} fill priority className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-transparent to-transparent" />
                  {imageLayout[0].badge && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.75 }}
                      className="absolute bottom-6 left-6 right-6 inline-flex items-center gap-2 rounded-full bg-primary/90 px-3 py-1.5 text-white text-sm font-semibold shadow-lg"
                    >
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      {imageLayout[0].badge}
                    </motion.div>
                  )}
                </motion.div>
              </FloatingCard>
              {/* Secondary */}
              <FloatingCard delay={0.35} className="absolute bottom-0 right-0 w-[66%] h-[60%] z-10">
                <motion.div
                  className="group relative size-full overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10 bg-neutral-800/30"
                  style={{ y: yMedium }}
                  whileHover={{ scale: 1.04 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                >
                  <Image src={imageLayout[1].src} alt={imageLayout[1].alt} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-transparent to-transparent" />
                  {imageLayout[1].badge && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.95 }}
                      className="absolute bottom-6 left-6 right-6 inline-flex items-center gap-2 rounded-full bg-primary/90 px-3 py-1.5 text-white text-sm font-semibold shadow-lg"
                    >
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      {imageLayout[1].badge}
                    </motion.div>
                  )}
                </motion.div>
              </FloatingCard>
              {/* Accent */}
              <FloatingCard delay={0.55} className="absolute top-[32%] right-[10%] w-[46%] h-[40%] z-30">
                <motion.div
                  className="group relative size-full overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10 bg-neutral-800/30"
                  style={{ y: ySmall }}
                  whileHover={{ scale: 1.04 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                >
                  <Image src={imageLayout[2].src} alt={imageLayout[2].alt} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-transparent to-transparent" />
                  {imageLayout[2].badge && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.15 }}
                      className="absolute bottom-4 left-4 right-4 inline-flex items-center gap-2 rounded-full bg-primary/90 px-2.5 py-1 text-white text-xs font-semibold shadow-lg"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      {imageLayout[2].badge}
                    </motion.div>
                  )}
                </motion.div>
              </FloatingCard>
              {/* Circular accent ring */}
              <motion.div
                aria-hidden="true"
                className="absolute -bottom-10 -left-10 w-28 h-28 border-2 border-primary/25 rounded-full"
                animate={shouldReduceMotion ? {} : { scale: [1, 1.12, 1], opacity: [0.6, 0.9, 0.6] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
              />
              {/* Pulse indicators */}
              <div aria-hidden="true" className="absolute -right-4 top-1/2 -translate-y-1/2 space-y-3">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 rounded-full bg-primary/60 backdrop-blur-sm"
                    animate={shouldReduceMotion ? {} : { scale: [0.55, 1, 0.55], opacity: [0.45, 1, 0.45] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.28 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={variants.container} initial="hidden" animate="visible" className="mt-20 lg:mt-28">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label + i}
                  variants={variants.item}
                  whileHover={{ y: -10, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  className="group relative"
                >
                  <div className="relative rounded-2xl bg-white/8 backdrop-blur-2xl ring-1 ring-white/20 p-6 sm:p-8 shadow-xl hover:ring-primary/35 transition-all duration-300">
                    <div className="flex items-center justify-between mb-5">
                      <div className="p-3 rounded-xl bg-primary/25 backdrop-blur-sm ring-1 ring-primary/30">
                        <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                      </div>
                      <motion.div
                        aria-hidden="true"
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/25 to-transparent"
                        animate={shouldReduceMotion ? {} : { scale: [1, 1.22, 1], opacity: [0.35, 0.75, 0.35] }}
                        transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.25 }}
                      />
                    </div>
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 tracking-tight">
                      <AnimatedCounter value={stat.value} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm sm:text-base font-semibold text-white/90">{stat.label}</h3>
                      {stat.description && <p className="text-xs text-white/55 leading-relaxed">{stat.description}</p>}
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Banner
