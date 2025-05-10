'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Scale, Users, BookOpen, GraduationCap, ShieldCheck, GlobeIcon } from 'lucide-react'
import { Button } from '../ui/button'
import Link from 'next/link'

const About = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  }
  
  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  return (
    <div className="relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <svg
          className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="e813992c-7d03-4cc4-a2bd-151760b470a0"
              width={200}
              height={200}
              x="50%"
              y={-1}
              patternUnits="userSpaceOnUse"
            >
              <path d="M100 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" strokeWidth={0} fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)" />
        </svg>
      </div>

      {/* Hero section */}
      <section className="py-20 md:py-28">
        <div className="container px-4 md:px-6">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial="initial"
            animate="animate"
            variants={staggerChildren}
          >
            <motion.p 
              className="text-sm font-medium text-primary uppercase tracking-wider mb-4"
              variants={fadeInUp}
            >
              WE ARE THE LAW CLINIC
            </motion.p>
            
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
              variants={fadeInUp}
            >
              A FUNDAMENTAL RIGHT THAT IS ACCESSIBLE TO ALL
            </motion.h1>
            
            <motion.div 
              className="relative mb-12"
              variants={fadeInUp}
            >
              <div className="absolute left-1/2 -translate-x-1/2 top-0 h-1 w-20 bg-primary rounded-full" />
            </motion.div>
            
            <motion.p 
              className="text-lg text-muted-foreground leading-relaxed mb-10"
              variants={fadeInUp}
            >
              At Ahmadu Bello University Pro Bono Law Clinic, we believe that justice is a fundamental 
              right that should be accessible to all, regardless of financial circumstances. Our mission is 
              to provide free legal assistance to individuals who cannot afford legal representation, 
              ensuring that everyone has the opportunity to understand and defend their rights.
            </motion.p>
            
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap justify-center gap-4"
            >
              <Button asChild size="lg" className="rounded-full px-8">
                <Link href="/get-help">Get Legal Assistance</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-8">
                <Link href="/services">Our Services</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission and Visions Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-2 md:px-6">
          <motion.div 
            className="grid md:grid-cols-2 gap-12 items-start"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="relative bg-card rounded-xl shadow-lg overflow-hidden border border-border/50">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary to-primary/30"></div>
                <div className="p-3.5 md:p-8">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <Scale className="w-7 h-7 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-6">OUR MISSIONS AND VISIONS</h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    The Ahmadu Bello University Law Clinic envisions becoming a leading center of excellence in clinical legal education in Nigeria, recognized for producing competent, compassionate, and socially responsible legal practitioners who significantly contribute to access to justice and the development of the legal system. Committed to this vision, the Clinic provides high-quality legal services to underserved communities while ensuring practical hands-on experience to law students. By bridging the gap between legal education and practice, we aim to foster a strong sense of social responsibility, ethical conduct, and professional excellence among future legal professionals.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="relative bg-card rounded-xl shadow-lg overflow-hidden border border-border/50">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary/30 to-primary"></div>
                <div className="p-8">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <ShieldCheck className="w-7 h-7 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-6">OUR OBJECTIVES</h2>
                  <ul className="space-y-4 text-muted-foreground">
                    <li className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                        <GlobeIcon className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <p><span className="font-medium text-foreground">Access to Justice:</span> To offer pro bono legal services to those who cannot afford legal representation, ensuring equal access to justice regardless of socioeconomic status.</p>
                    </li>
                    <li className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                        <GraduationCap className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <p><span className="font-medium text-foreground">Legal Education:</span> To provide practical legal training and experiential learning opportunities for law students, equipping them with essential skills and preparing them for professional practice.</p>
                    </li>
                    <li className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                        <Users className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <p><span className="font-medium text-foreground">Community Outreach:</span> To raise awareness about legal rights, responsibilities, and procedures through community outreach programs and legal literacy initiatives.</p>
                    </li>
                    <li className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                        <BookOpen className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <p><span className="font-medium text-foreground">Policy Advocacy:</span> To collaborate with local organizations, government agencies, and stakeholders to address systemic legal issues and advocate for policy reforms.</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="max-w-4xl mx-auto"
          >
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">OUR HISTORY</h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
        </div>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-1/2"></div>
          
          {/* Timeline entries */}
          <div className="space-y-8 md:space-y-12">
            <motion.div 
          className="relative grid md:grid-cols-2 gap-4 md:gap-8 items-start md:items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
            >
          <div className="pl-12 md:pl-0 md:text-right md:pr-12">
            <h3 className="text-lg md:text-xl font-bold text-primary mb-2">2005</h3>
            <p className="text-sm md:text-base text-muted-foreground">The Ahmadu Bello University Law Clinic was established, marking a significant milestone in practical legal education at Ahmadu Bello University.</p>
          </div>
          <div className="md:pl-12">
            <div className="absolute left-4 md:left-1/2 top-0 w-4 h-4 rounded-full bg-primary md:-translate-x-1/2"></div>
          </div>
            </motion.div>
            
            <motion.div 
          className="relative grid md:grid-cols-2 gap-4 md:gap-8 items-start md:items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
            >
          <div className="order-2 pl-12 md:order-2 md:pl-12 md:text-left">
            <h3 className="text-lg md:text-xl font-bold text-primary mb-2">Initial Growth</h3>
            <p className="text-sm md:text-base text-muted-foreground">Our founders recognized that access to justice is a fundamental right and aimed to create a platform for law students to gain practical experience while providing free legal support to those in need.</p>
          </div>
          <div className="order-1 md:order-1 md:pr-12">
            <div className="absolute left-4 md:left-1/2 top-0 w-4 h-4 rounded-full bg-primary md:-translate-x-1/2"></div>
          </div>
            </motion.div>
            
            <motion.div 
          className="relative grid md:grid-cols-2 gap-4 md:gap-8 items-start md:items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
            >
          <div className="pl-12 md:pl-0 md:text-right md:pr-12">
            <h3 className="text-lg md:text-xl font-bold text-primary mb-2">Service Expansion</h3>
            <p className="text-sm md:text-base text-muted-foreground">Initially operating with a small team of dedicated faculty and enthusiastic students, we began by offering basic legal advice to the local community. Over the years, we've expanded our services to include full representation in court, mediation, and community legal education programs.</p>
          </div>
          <div className="md:pl-12">
            <div className="absolute left-4 md:left-1/2 top-0 w-4 h-4 rounded-full bg-primary md:-translate-x-1/2"></div>
          </div>
            </motion.div>
            
            <motion.div 
          className="relative grid md:grid-cols-2 gap-4 md:gap-8 items-start md:items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
            >
          <div className="order-2 pl-12 md:order-2 md:pl-12 md:text-left">
            <h3 className="text-lg md:text-xl font-bold text-primary mb-2">Present Day</h3>
            <p className="text-sm md:text-base text-muted-foreground">Our approach combines legal assistance with education, empowering clients to understand their rights and navigate the legal system effectively. We've also organized workshops and outreach programs to inform and empower community members about their legal rights through partnerships with local organizations and legal professionals.</p>
          </div>
          <div className="order-1 md:order-1 md:pr-12">
            <div className="absolute left-4 md:left-1/2 top-0 w-4 h-4 rounded-full bg-primary md:-translate-x-1/2"></div>
          </div>
            </motion.div>
          </div>
        </div>
        
        <motion.div 
          className="mt-12 md:mt-16 text-center px-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <p className="text-base md:text-lg font-medium">
            Today, the ABU Law Clinic stands as a testament to innovation in legal education and a beacon of hope for those seeking justice in our community. As we look to the future, we remain committed to our founding principles of practical learning and public service, continually adapting to meet the evolving legal needs of our society, we strive for a more equitable legal system for all, upholding our commitment to social justice.
          </p>
        </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="container px-2 md:px-4 md:px-6">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Join Us In Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Whether you're seeking legal assistance, interested in volunteering, or want to support our cause, we welcome you to be part of our community dedicated to making justice accessible for all.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="rounded-full px-8">
                <Link href="/contact">Get In Touch</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-8">
                <Link href="/get-involved">Get Involved</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* SVG background effect */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 -z-10 overflow-hidden">
        <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" className="opacity-10">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path 
            fill="url(#grad1)" 
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,218.7C672,235,768,245,864,229.3C960,213,1056,171,1152,154.7C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>
    </div>
  )
}

export default About