"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../ui/button'

const faqData = [
  {
    question: "Who can receive assistance from the Law Clinic?",
    answer: "Our Law Clinic serves individuals who cannot afford traditional legal representation. Your legal issue must fall within our practice areas including family law, tenant disputes, small claims, consumer issues, and civil rights cases. Priority is given to university community members and underserved populations."
  },
  {
    question: "How do I apply for legal help?",
    answer: "Start by completing our intake form online or in person at the clinic. Our team will review your case to determine eligibility within 5-7 business days. If eligible, we'll schedule an initial consultation to gather more details."
  },
  {
    question: "Are your services completely free?",
    answer: "Yes, all legal services provided by ABU Law Clinic are completely free of charge. We operate on a pro bono basis, meaning you won't pay for legal counsel or representation. External costs like court filing fees may still apply, though we help identify fee waivers when possible."
  },
  {
    question: "Who provides the legal services?",
    answer: "Services are delivered by supervised law students in their final years, working under licensed attorneys who serve as faculty or volunteer practitioners. This ensures quality legal representation while providing practical experience for future lawyers."
  },
  {
    question: "How can I volunteer with the clinic?",
    answer: "We welcome volunteers in multiple roles. Law students can join as part of coursework, attorneys can supervise or consult, and professionals can assist with outreach. Contact our clinic coordinator with your qualifications and interests."
  }
]

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="relative py-16 md:py-24 bg-[var(--navy-900)]" aria-labelledby="faq-heading">
      {/* Background decoration */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />
      </div>

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column - Title */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:sticky lg:top-32"
            >
              <span className="inline-block text-primary font-semibold text-sm tracking-wider uppercase mb-4">
                FAQ
              </span>
              <h2 id="faq-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                Frequently Asked Questions
              </h2>
              <div className="h-1 w-16 bg-primary mt-6 rounded-full" />
              <p className="mt-6 text-white/60 text-base leading-relaxed">
                Find answers to common questions about our legal services and how we can help you.
              </p>

              <div className="mt-8">
                <p className="text-white/50 text-sm mb-4">
                  Can't find what you're looking for?
                </p>
                <Button asChild className="rounded-full bg-white text-[var(--navy-900)] hover:bg-white/90">
                  <Link href="/contact" className="flex items-center gap-2">
                    Contact Us
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Right Column - FAQ Items */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-4"
            >
              {faqData.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-5 sm:p-6 text-left"
                    aria-expanded={openIndex === index}
                  >
                    <span className="text-white font-medium text-base sm:text-lg pr-4">
                      {faq.question}
                    </span>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${openIndex === index ? 'bg-primary text-white' : 'bg-white/10 text-white/70'}`}>
                      {openIndex === index ? (
                        <Minus className="h-4 w-4" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                          <p className="text-white/70 text-sm sm:text-base leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FAQs
