"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, BookOpen, FileQuestion, HelpingHand, ShieldCheck, ScrollText, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../ui/button'

const faqData = [
  {
    icon: <HelpingHand className="md:h-5 md:w-5 h-3.5 w-3.5" />,
    question: "Who can receive assistance from the Pro Bono Law Clinic?",
    answer: "Our Law Clinic serves individuals who cannot afford traditional legal representation. To qualify for assistance, your legal issue must fall within our practice areas including family law, tenant disputes, small claims, consumer issues, and civil rights cases. Priority is given to university community members and underserved populations in the surrounding area."
  },
  {
    icon: <ScrollText className="md:h-5 md:w-5 h-3.5 w-3.5" />,
    question: "How do I apply for legal help?",
    answer: "Start by completing our intake form online or in person at the clinic. Our team will review your case to determine eligibility within our practice areas. If eligible, we'll schedule an initial consultation to gather more details. The process typically takes 5-7 business days, though urgent matters may receive expedited review."
  },
  {
    icon: <ShieldCheck className="md:h-5 md:w-5 h-3.5 w-3.5" />,
    question: "Are your services completely free?",
    answer: "Yes, all legal services provided by ABU Law Clinic are completely free of charge. We operate on a pro bono basis, meaning you won't pay for legal counsel or representation. While external costs like court filing fees may still apply, we often help identify fee waivers or reduced-cost options for qualifying individuals."
  },
  {
    icon: <BookOpen className="md:h-5 md:w-5 h-3.5 w-3.5" />,
    question: "Who provides the legal services?",
    answer: "Services are delivered by supervised law students in their final years of legal education, working under licensed attorneys who serve as faculty or volunteer practitioners. This teaching-service model ensures quality legal representation while providing valuable practical experience for future lawyers committed to access to justice."
  },
  {
    icon: <FileQuestion className="md:h-5 md:w-5 h-3.5 w-3.5" />,
    question: "How can I volunteer with the clinic?",
    answer: "We welcome volunteers in multiple roles. Law students can join as part of their coursework, attorneys can supervise or consult, and professionals can assist with outreach and specialized expertise. Please contact our clinic coordinator with your qualifications and interests, or visit our website for current volunteer opportunities."
  }
]

// Animated gradient background SVG
const GradientBgSVG = () => (
  <svg className="absolute inset-0 w-full h-full z-0 opacity-20" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="faqGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3">
          <animate attributeName="stopOpacity" values="0.3;0.5;0.3" dur="8s" repeatCount="indefinite" />
        </stop>
        <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.1">
          <animate attributeName="stopOpacity" values="0.1;0.3;0.1" dur="8s" repeatCount="indefinite" />
        </stop>
      </linearGradient>
      <pattern id="circlePattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <circle cx="20" cy="20" r="1" fill="white" opacity="0.4">
          <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" />
        </circle>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#faqGradient)" />
    <rect width="100%" height="100%" fill="url(#circlePattern)" />
  </svg>
)

interface FaqItemProps {
  icon: React.ReactNode;
  question: string;
  answer: string;
  isOpen: boolean;
  toggleOpen: () => void;
  index: number;
}

const FaqItem = ({ icon, question, answer, isOpen, toggleOpen, index }: FaqItemProps) => {
  return (
    <motion.div 
      className="border border-white/10 bg-white/5 backdrop-blur-sm rounded-lg mb-4 overflow-hidden shadow-lg"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <button
        className="flex justify-between items-center w-full py-5 px-6 text-left focus:outline-none"
        onClick={toggleOpen}
        aria-expanded={isOpen}
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-full bg-primary/20 text-primary">
            {icon}
          </div>
          <h3 className="text-base md:text-lg font-medium text-white">{question}</h3>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0, backgroundColor: isOpen ? "rgba(var(--primary), 0.2)" : "transparent" }}
          transition={{ duration: 0.3 }}
          className={`p-1.5 rounded-full ${isOpen ? "bg-primary/20" : ""} text-primary flex-shrink-0`}
        >
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 text-sm md:text-base pb-6 pt-2 text-white/80 leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Floating particles animation
const FloatingParticles = ({ count = 20 }) => {
  const particles = Array.from({ length: count }, (_, i) => i);
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-primary/30"
          initial={{ 
            x: Math.random() * 100 + "%", 
            y: Math.random() * 100 + "%",
            scale: Math.random() * 0.5 + 0.5,
            opacity: Math.random() * 0.5 + 0.3
          }}
          animate={{ 
            x: [
              Math.random() * 100 + "%",
              Math.random() * 100 + "%",
              Math.random() * 100 + "%"
            ],
            y: [
              Math.random() * 100 + "%",
              Math.random() * 100 + "%",
              Math.random() * 100 + "%"
            ],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{ 
            duration: Math.random() * 20 + 20, 
            repeat: Infinity,
            ease: "linear" 
          }}
        />
      ))}
    </div>
  );
}

// Letter animation for the heading
const AnimatedText = ({ text }: { text: string }) => {
  const words = text?.split(' ');
  
  return (
    <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="mr-3 inline-block">
          {word?.split('').map((char, charIndex) => (
            <motion.span
              key={`${wordIndex}-${charIndex}`}
              className="inline-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.1 + (wordIndex * 0.1) + (charIndex * 0.03),
                duration: 0.6, 
                ease: "easeOut"
              }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </h2>
  );
}

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Default first item open
  
  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative py-24 bg-[#0a0c10] text-white overflow-hidden">
      {/* Background elements */}
      <GradientBgSVG />
      <FloatingParticles />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-2/3 h-1/3 bg-gradient-to-br from-primary/10 to-transparent blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-primary/10 to-transparent blur-3xl"></div>
      </div>
      
      <div className="container max-w-7xl mx-auto px-2 md:px-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
          {/* Left section - Title and CTA */}
          <div className="lg:w-5/12 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              {/* Decorative elements */}
              <motion.div 
                className="absolute -left-6 -top-6 w-12 h-12 border border-primary/20 rounded-full"
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div 
                className="absolute -right-4 bottom-1/3 w-20 h-20 border border-primary/20 rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
              />

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <AnimatedText text="Everything You Need To Know About Law Clinic" />
                
                <motion.p 
                  className="text-white/70 text-lg mb-8 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  We've answered the most commonly asked questions to help you understand how our legal clinic works and how we can support you.
                </motion.p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="relative"
              >
                <Button asChild className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white px-8 py-6 rounded-xl text-lg font-medium group shadow-xl shadow-primary/20">
                  <Link href="/get-help">
                    <span className="flex items-center">
                      Get Legal Assistance
                      <motion.div 
                        className="ml-2"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                      >
                        <ArrowRight className="h-5 w-5" />
                      </motion.div>
                    </span>
                  </Link>
                </Button>
                
                <motion.div 
                  className="absolute -z-10 inset-0 bg-primary/30 rounded-xl blur-xl"
                  animate={{ opacity: [0.5, 0.8, 0.5], scale: [0.95, 1, 0.95] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                />
              </motion.div>
            </motion.div>
          </div>
          
          {/* Right section - FAQs */}
          <div className="lg:w-7/12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white/5 backdrop-blur-md rounded-2xl p-3.5 md:p-8 shadow-2xl border border-white/10 relative overflow-hidden"
            >
              {/* Shiny accent elements */}
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
              <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-2xl"></div>
              
              {faqData.map((faq, index) => (
                <FaqItem
                  key={index}
                  icon={faq.icon}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openIndex === index}
                  toggleOpen={() => toggleFaq(index)}
                  index={index}
                />
              ))}

              <motion.div
                className="mt-8 flex justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                <p className="text-center text-white/60 text-sm flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse text-xs md:text-base"></span> 
                  Our legal team is constantly updating these resources for you
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FAQs
