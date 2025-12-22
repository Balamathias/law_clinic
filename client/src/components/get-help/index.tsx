'use client'

import React, { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { z } from "zod"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import Link from 'next/link'
import {
  ArrowRight,
  CalendarClock,
  HelpCircle,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Scale,
  User,
  CheckCircle2,
  Info,
  Clock,
  Shield
} from 'lucide-react'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCreateHelpRequest } from '@/services/client/help-requests'
import { CreateHelpRequestPayload } from '@/services/server/help-requests'

const helpFormSchema = z.object({
  full_name: z.string().min(2, { message: 'Please enter your full name' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone_number: z.string().min(10, { message: 'Please enter a valid phone number' }),
  legal_issue_type: z.string({ required_error: 'Please select a legal issue type' }),
  had_previous_help: z.string({ required_error: 'Please select an option' }),
  description: z.string().min(20, { message: 'Please provide a brief description of at least 20 characters' })
})

type HelpFormValues = z.infer<typeof helpFormSchema>

const legalIssueTypes = [
  "Family Law",
  "Housing & Tenancy",
  "Employment Law",
  "Consumer Protection",
  "Human Rights",
  "Criminal Law",
  "Civil Litigation",
  "Administrative Law",
  "Property Law",
  "Other"
]

const benefits = [
  {
    icon: Shield,
    title: "100% Confidential",
    description: "Your information is protected and kept strictly confidential"
  },
  {
    icon: Scale,
    title: "Free Legal Aid",
    description: "All our services are provided at no cost to eligible clients"
  },
  {
    icon: Clock,
    title: "Quick Response",
    description: "We aim to respond to all requests within 24-48 hours"
  }
]

const GetHelp = () => {
  const [submitted, setSubmitted] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  const { mutate: createRequest, isPending: isSubmitting } = useCreateHelpRequest()

  const form = useForm<HelpFormValues>({
    resolver: zodResolver(helpFormSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone_number: "",
      legal_issue_type: "",
      had_previous_help: "",
      description: ""
    },
  })

  const onSubmit = async (data: HelpFormValues) => {
    const _data = { ...data, had_previous_help: data.had_previous_help.toLowerCase() } as CreateHelpRequestPayload

    createRequest(_data, {
      onSuccess: (response) => {
        if (response?.data) {
          setSubmitted(true)
          toast.success("Request submitted successfully!")
          form.reset()
        } else {
          toast.error(response?.message || "Failed to submit request")
        }
      },
      onError: (error) => {
        toast.error(error?.message || "An error occurred while submitting the request")
      }
    })
  }

  const resetForm = () => {
    setSubmitted(false)
    form.reset()
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
    }
  }

  // Success State
  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-12 px-4">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full"
        >
          <div className="relative bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-xl overflow-hidden text-center">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />

            <div className="relative">
              <motion.div
                initial={shouldReduceMotion ? false : { scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </motion.div>

              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                Request Submitted!
              </h2>

              <p className="text-muted-foreground mb-8">
                Thank you for reaching out to ABU Law Clinic. Our team will review your request
                and contact you within 24-48 business hours.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Button onClick={resetForm} variant="outline" className="rounded-full h-11 px-6">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Submit Another Request
                </Button>

                <Button asChild className="rounded-full h-11 px-6">
                  <Link href="/faq">
                    <Info className="w-4 h-4 mr-2" />
                    Visit Our FAQ
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative py-8 sm:py-12">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          className="grid lg:grid-cols-5 gap-8 lg:gap-12"
          variants={shouldReduceMotion ? {} : containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Column - Info */}
          <motion.div variants={shouldReduceMotion ? {} : itemVariants} className="lg:col-span-2">
            <div className="sticky top-24">
              {/* Badge */}
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
                <Scale className="h-4 w-4" />
                Free Legal Assistance
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4">
                Get Legal Help
              </h1>

              <div className="h-1 w-16 bg-primary rounded-full mb-6" />

              <p className="text-muted-foreground text-base sm:text-lg mb-8 leading-relaxed">
                At ABU Law Clinic, we provide free legal assistance to those who cannot afford legal
                representation. Fill out the form and our team will review your case.
              </p>

              {/* Benefits */}
              <div className="space-y-4 mb-8">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{benefit.title}</h3>
                        <p className="text-sm text-muted-foreground">{benefit.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Contact Info */}
              <div className="bg-[var(--slate-50)] rounded-2xl p-6 space-y-4">
                <h3 className="font-semibold text-foreground mb-4">Contact Information</h3>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Office Address</p>
                    <address className="text-sm text-muted-foreground not-italic">
                      2nd Floor, Faculty of Law,<br />
                      Ahmadu Bello University,<br />
                      Kongo Campus, Zaria
                    </address>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Email</p>
                    <a href="mailto:hello@abulawclinic.com" className="text-sm text-primary hover:underline">
                      hello@abulawclinic.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CalendarClock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Office Hours</p>
                    <p className="text-sm text-muted-foreground">
                      Mon - Fri: 9:00 AM - 4:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Form */}
          <motion.div variants={shouldReduceMotion ? {} : itemVariants} className="lg:col-span-3">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 sm:p-8">
              {/* Form header */}
              <div className="mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Request Legal Assistance</h2>
                <p className="text-muted-foreground text-sm">
                  Fields marked with <span className="text-destructive">*</span> are required
                </p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Full Name */}
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Full Name <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              placeholder="Enter your full name"
                              className="h-12 pl-11 rounded-xl bg-[var(--slate-50)] border-gray-200 focus:border-primary focus:ring-primary"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email and Phone */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Email Address <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                              <Input
                                placeholder="you@example.com"
                                type="email"
                                className="h-12 pl-11 rounded-xl bg-[var(--slate-50)] border-gray-200 focus:border-primary focus:ring-primary"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Phone Number <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                              <Input
                                placeholder="09012345678"
                                className="h-12 pl-11 rounded-xl bg-[var(--slate-50)] border-gray-200 focus:border-primary focus:ring-primary"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Legal Issue Type and Previous Help */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="legal_issue_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Legal Issue Type <span className="text-destructive">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 rounded-xl bg-[var(--slate-50)] border-gray-200 focus:border-primary focus:ring-primary">
                                <SelectValue placeholder="Select issue type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {legalIssueTypes.map((issue) => (
                                <SelectItem key={issue} value={issue}>
                                  {issue}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="had_previous_help"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Had pro bono help before? <span className="text-destructive">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 rounded-xl bg-[var(--slate-50)] border-gray-200 focus:border-primary focus:ring-primary">
                                <SelectValue placeholder="Select option" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Yes">Yes</SelectItem>
                              <SelectItem value="No">No</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Brief Description <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please describe your legal issue in detail. Include relevant dates, parties involved, and any previous legal actions taken..."
                            className="min-h-32 resize-none rounded-xl bg-[var(--slate-50)] border-gray-200 focus:border-primary focus:ring-primary"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 rounded-full font-semibold text-base shadow-lg shadow-primary/25"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Request
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>

              {/* FAQ Link */}
              <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                <p className="text-sm text-muted-foreground">
                  Have questions?{' '}
                  <Link href="/faq" className="text-primary font-medium hover:underline">
                    Visit our FAQ
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default GetHelp
