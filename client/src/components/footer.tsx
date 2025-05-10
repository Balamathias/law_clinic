"use client"

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  ArrowRight, 
  MapPin, 
  Mail, 
  Phone, 
  Clock, 
  ChevronRight 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const footerLinks = [
  {
    title: "Services",
    links: [
      { label: "Legal Consultation", href: "/services/consultation" },
      { label: "Legal Education", href: "/services/education" },
      { label: "Representation", href: "/services/representation" },
      { label: "Community Outreach", href: "/services/outreach" },
      { label: "Pro Bono Cases", href: "/services/pro-bono" },
    ]
  },
  {
    title: "Resources",
    links: [
      { label: "Legal Articles", href: "/resources/articles" },
      { label: "Research Papers", href: "/resources/papers" },
      { label: "Case Studies", href: "/resources/cases" },
      { label: "Legal Templates", href: "/resources/templates" },
      { label: "FAQs", href: "/faq" },
    ]
  },
  {
    title: "Organization",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Our Team", href: "/excos" },
      { label: "Events", href: "/events" },
      { label: "Testimonials", href: "/testimonials" },
      { label: "Contact", href: "/contact" },
    ]
  }
];

interface FooterProps {
  className?: string;
  variant?: "default" | "dark";
}

// SVG pattern for the footer background
const FooterPattern = () => (
  <div className="absolute inset-0 overflow-hidden opacity-5 pointer-events-none">
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"></path>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)"></rect>
    </svg>
  </div>
);

// Animated dot grid for visual interest
const AnimatedDots = () => {
  return (
    <div className="absolute right-0 bottom-0 w-48 h-48 xl:w-96 xl:h-96 opacity-20 pointer-events-none">
      {Array.from({ length: 10 }).map((_, y) => (
        <div key={y} className="flex">
          {Array.from({ length: 10 }).map((_, x) => (
            <motion.div
              key={`${x}-${y}`}
              className="w-1.5 h-1.5 m-4 rounded-full bg-current"
              initial={{ opacity: 0.1, scale: 0.5 }}
              animate={{ 
                opacity: [0.1, 0.5, 0.1],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 4,
                delay: (x * 0.1) + (y * 0.1),
                repeat: Infinity,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export function Footer({ className, variant = "dark" }: FooterProps) {
  const isDark = variant === "dark";
  
  const containerClasses = cn(
    "relative overflow-hidden",
    isDark 
      ? "bg-[#0a0c10] text-gray-300" 
      : "bg-gray-900 text-gray-300",
    className
  );

  const itemAppearAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0, 
      transition: { 
        delay: 0.05 * i,
        duration: 0.5
      }
    })
  };
  
  return (
    <footer className={containerClasses}>
      {/* Background elements */}
      <FooterPattern />
      <AnimatedDots />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
      
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-20">
          {/* Column 1: Logo and description */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="inline-block">
              <div className="mb-6 text-2xl font-bold text-primary">
                ABU Law Clinic
              </div>
            </Link>
            <p className="mb-6 text-gray-400">
              Providing free legal services to those in need while training the next generation of legal advocates 
              committed to access to justice and the rule of law.
            </p>
            
            <div className="flex space-x-4 mb-8">
              {[
                { icon: <Facebook size={18} />, href: "https://facebook.com/abu-law-clinic" },
                { icon: <Twitter size={18} />, href: "https://twitter.com/abu_law_clinic" },
                { icon: <Instagram size={18} />, href: "https://instagram.com/abu_lawclinic" },
                { icon: <Linkedin size={18} />, href: "https://linkedin.com/abu_law_clinic" },
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center h-9 w-9 rounded-full border border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-primary transition-colors"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
            
            <div className="space-y-4">
              {[
                { icon: <MapPin size={16} />, text: "Faculty of Law, Ahmadu Bello University, Zaria, Nigeria" },
                { icon: <Mail size={16} />, text: "contact@abulawclinic.org" },
                { icon: <Phone size={16} />, text: "+234 123 456 7890" },
                { icon: <Clock size={16} />, text: "Mon-Fri: 9AM - 5PM" },
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  className="flex items-start"
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={itemAppearAnimation}
                >
                  <div className="mr-3 mt-0.5 text-primary">{item.icon}</div>
                  <span className="text-sm">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Middle columns: Links */}
          {footerLinks.map((group, groupIndex) => (
            <motion.div 
              key={group.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 + (groupIndex * 0.1) }}
              className="max-md:p-2.5 lg:col-span-1"
            >
              <h3 className="font-semibold text-lg mb-5 text-white text-left">
                {group.title}
              </h3>
              <ul className="space-y-3">
                {group.links.map((link, linkIndex) => (
                  <motion.li 
                    key={link.label}
                    custom={linkIndex}
                    initial="hidden"
                    whileInView="visible" 
                    viewport={{ once: true }}
                    variants={itemAppearAnimation}
                  >
                    <Link 
                      href={link.href}
                      className="text-sm flex items-center group transition-colors hover:text-primary"
                    >
                      <ChevronRight className="h-3 w-0 opacity-0 -ml-3 group-hover:w-3 group-hover:opacity-100 group-hover:mr-1 transition-all text-primary" />
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
          
          {/* Last column: Newsletter */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="font-semibold text-lg mb-5 text-white">
              Subscribe to our Newsletter
            </h3>
            <p className="mb-4 text-sm text-gray-400">
              Stay updated with our latest news, events, and legal resources.
            </p>
            
            <form className="space-y-3"
              onSubmit={e => {
                e.preventDefault()
                toast.info("This feature is coming soon!")
              }}
            >
              <div className="flex max-w-md items-center">
                <Input 
                  type="email" 
                  placeholder="Your email address" 
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 rounded-l-lg rounded-r-none border-r-0 focus-visible:ring-1 focus-visible:ring-primary border-none"
                  required
                />
                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-primary/90 text-white rounded-l-none border-none"
                  size="lg"
                >
                  <ArrowRight size={16} />
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                By subscribing, you agree to our Privacy Policy.
              </p>
            </form>
            
            {/* Badge */}
            <motion.div 
              className="mt-8 inline-block rounded-xl border border-gray-700 px-3 py-2"
              whileHover={{ y: -3 }}
            >
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-1.5 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h1"></path>
                    <path d="M17 17h1a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2h-1"></path>
                    <path d="M12 22v-8.3a4 4 0 0 0-1.73-3.3L8 9"></path>
                    <path d="M16 9l-2.27 1.4A4 4 0 0 0 12 13.7V22"></path>
                    <path d="M8 7a4 4 0 1 0 8 0 4 4 0 1 0-8 0"></path>
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-xs text-white">Accredited Legal Clinic</div>
                  <div className="text-[10px] text-gray-500">Since 1986</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Bottom bar */}
        <motion.div 
          className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} ABU Law Clinic. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center md:justify-end gap-x-4 gap-y-2 text-sm">
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="/cookies-policy" className="hover:text-primary transition-colors">Cookies Policy</Link>
          </div>
        </motion.div>
      </div>
      
      {/* Background gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
      <div className="absolute -z-10 top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 bg-primary/10"></div>
    </footer>
  );
}

export default Footer;
