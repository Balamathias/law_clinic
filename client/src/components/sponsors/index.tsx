'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Building2, Users, ExternalLink, ArrowRight, Handshake, Globe } from 'lucide-react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { Sponsor } from '@/@types/db'

interface Props {
  sponsors: Sponsor[],
}

const Sponsors: React.FC<Props> = ({ sponsors }) => {
  const [activeFilter, setActiveFilter] = useState('all')

  const organizationSponsors = sponsors.filter(sponsor => sponsor.type === 'organization')
  const individualSponsors = sponsors.filter(sponsor => sponsor.type === 'person')
  
  const filteredOrganizations = activeFilter === 'all' 
    ? organizationSponsors 
    : organizationSponsors.filter(org => org.name.toLowerCase().includes(activeFilter.toLowerCase()))

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  return (
    <div className="relative py-16 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10">
        <svg className="absolute right-0 top-0 h-full w-full stroke-primary/5" aria-hidden="true">
          <defs>
            <pattern
              id="grid-pattern"
              width={40}
              height={40}
              patternUnits="userSpaceOnUse"
            >
              <path d="M.5 40V.5H40" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" strokeWidth={0} fill="url(#grid-pattern)" />
        </svg>
        <div className="absolute top-1/4 left-0 w-full h-64 bg-gradient-to-r from-primary/5 via-primary/10 to-transparent opacity-60 blur-3xl -z-10" />
        <div className="absolute bottom-1/4 right-0 w-2/3 h-64 bg-gradient-to-l from-primary/5 via-primary/10 to-transparent opacity-60 blur-3xl -z-10" />
      </div>

      <div className="container px-4 mx-auto max-w-7xl">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-4 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Handshake className="w-4 h-4 mr-2" />
            Partnerships & Collaborations
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Our Partner Organizations</h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full mb-6"></div>
          <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
            Want to join our partners and collaborate with us? We are open to welcome you.
          </p>
          
          <div className="mt-8">
            <Button asChild className="rounded-full px-8 gap-2 group">
              <a href="#contact-form">
                Partner With Us <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </div>
        </motion.div>

        {/* Filter Categories */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {['all', 'Human Rights', 'Legal Services', 'Legal Education', 'Governance & Democracy', 'International Development'].map((category) => (
            <Button
              key={category}
              variant={activeFilter === category ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(category)}
              className="rounded-full capitalize"
            >
              {category}
            </Button>
          ))}
        </motion.div>

        {/* Organization Sponsors Section */}
        <div className="mb-24">
          <motion.div 
            className="flex items-center gap-3 mb-8"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Building2 className="w-6 h-6 text-primary" />
            <h3 className="text-2xl font-semibold">Organization Partners</h3>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {filteredOrganizations.map((org) => (
              <motion.div
                key={org.id}
                variants={fadeInUp}
                className="bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="h-52 p-8 bg-gradient-to-b from-primary/5 to-transparent flex items-center justify-center overflow-hidden">
                  <motion.img 
                    src={org.image!} 
                    alt={org.name}
                    className="max-h-full max-w-full object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform duration-500" 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 line-clamp-1">{org.name}</h3>
                  <p className="text-muted-foreground text-sm mb-5 line-clamp-3">
                    {org.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Partner Organization</span>
                    {org.url && (
                      <Button size="sm" variant="ghost" className="h-8 gap-2" asChild>
                        <a href={org.url} target="_blank" rel="noopener noreferrer">
                          Visit <ExternalLink className="w-3 h-3" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Individual Sponsors Section */}
        <div className="mb-24">
          <motion.div 
            className="flex items-center gap-3 mb-8"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Users className="w-6 h-6 text-primary" />
            <h3 className="text-2xl font-semibold">Individual Sponsors & Partners</h3>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {individualSponsors.map((person) => (
              <motion.div
                key={person.id}
                variants={fadeInUp}
                className="bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all group relative"
                whileHover={{ 
                  y: -5,
                  transition: { duration: 0.3 }
                }}
              >
                <div className="aspect-[3/4] overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
                  <motion.img 
                    src={person?.image || '/placeholder-person.jpg'} 
                    alt={person.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1 }}
                  />
                  {/* Elegant gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  
                  {/* Decorative accent line */}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-xl font-semibold text-white mb-1 group-hover:opacity-90 transition-colors">
                    {person.name}
                  </h3>
                  {person.description && (
                    <p className="text-sm text-white/90 line-clamp-3 group-hover:text-white transition-colors">
                      {person.description}
                    </p>
                  )}
                  
                  {/* Optional URL link */}
                  {person.url && (
                    <a 
                      href={person.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center mt-3 text-xs text-white/70 hover:text-primary transition-colors gap-1"
                    >
                      <span>Visit profile</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                
                {/* Hover state reveal button */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:text-white"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {individualSponsors.length > 8 && (
            <motion.div 
              className="flex justify-center mt-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Button variant="outline" size="lg" className="rounded-full px-8 group">
                View All Individual Sponsors
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          )}
        </div>

        {/* Partner With Us Form Section */}
        <motion.div
          id="contact-form"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-2xl p-8 md:p-12 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/10 overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -z-10"></div>
          <div className="absolute top-10 left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl -z-10"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-6 h-6 text-primary" />
              <h3 className="text-2xl font-semibold">Partner With Us</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h4 className="text-xl font-semibold mb-4">Join Our Mission For Justice</h4>
                <p className="text-muted-foreground mb-6">
                  We welcome partnerships with organizations and individuals committed to advancing access to justice and legal education. Together, we can make a significant impact in ensuring justice for all.
                </p>
                <ul className="space-y-3 mb-6">
                  {[
                    "Support legal aid initiatives for underserved communities",
                    "Contribute to clinical legal education programs",
                    "Sponsor legal awareness and literacy campaigns",
                    "Provide resources for pro bono representation"
                  ].map((item, index) => (
                    <motion.li 
                      key={index} 
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
                    >
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                        <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-card p-6 rounded-xl shadow-lg border border-border">
                <h4 className="text-lg font-medium mb-6">Get In Touch</h4>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1.5">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        className="w-full px-4 py-2.5 rounded-lg bg-background border border-input focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1.5">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-2.5 rounded-lg bg-background border border-input focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="Your email"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="organization" className="block text-sm font-medium mb-1.5">Organization</label>
                    <input
                      type="text"
                      id="organization"
                      className="w-full px-4 py-2.5 rounded-lg bg-background border border-input focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="Your organization (if applicable)"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1.5">Message</label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full px-4 py-2.5 rounded-lg bg-background border border-input focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="How would you like to partner with us?"
                    ></textarea>
                  </div>
                  <Button className="w-full">Submit Partnership Request</Button>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Sponsors