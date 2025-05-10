'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { z } from "zod"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import Link from 'next/link'
import { 
  ArrowRight, 
  Building2, 
  CalendarClock, 
  FileText, 
  HelpCircle, 
  Loader2, 
  LucideLoader2,
  Mail, 
  MapPin, 
  Phone, 
  Scale, 
  User, 
  CheckCircle2, 
  Info
} from 'lucide-react'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
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

// Define the form schema with Zod
const helpFormSchema = z.object({
  full_name: z.string().min(2, { message: 'Please enter your full name' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone_number: z.string().min(10, { message: 'Please enter a valid phone number' }),
  legal_issue_type: z.string({ required_error: 'Please select a legal issue type' }),
  had_previous_help: z.string({ required_error: 'Please select an option' }),
  description: z.string().min(20, { message: 'Please provide a brief description of at least 20 characters' })
});

type HelpFormValues = z.infer<typeof helpFormSchema>;

// Legal issue types
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
];

const GetHelp = () => {
  const [submitted, setSubmitted] = useState(false)

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
  });

  const onSubmit = async (data: HelpFormValues) => {

  const _data = { ...data, had_previous_help: data.had_previous_help.toLowerCase() } as CreateHelpRequestPayload
    
  createRequest(_data, {
      onSuccess: (response) => {
        if (response?.data) {
          setSubmitted(true)
          toast.success("Request submitted successfully!")
            form.reset();
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
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto py-12 px-4"
      >
        <div className="relative overflow-hidden backdrop-blur-sm border border-border rounded-2xl w-full p-8 shadow-lg bg-card/70">
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-primary/5 pointer-events-none" />
          <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6"
            >
              <CheckCircle2 className="w-14 h-14 text-primary" />
            </motion.div>
            
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold mb-4"
            >
              Request Submitted Successfully
            </motion.h2>
            
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground max-w-lg mb-8"
            >
              Thank you for reaching out to ABU Law Clinic. Our team will review your request and contact you within 24-48 business hours. Your case number has been sent to your email.
            </motion.p>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button onClick={resetForm} variant="outline" className="gap-2">
                <HelpCircle className="w-4 h-4" />
                Submit Another Request
              </Button>
              
              <Button asChild className="gap-2">
                <Link href="/faq">
                  <Info className="w-4 h-4" />
                  Visit Our FAQ
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 relative">
      {/* Background patterns */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-3/4 top-0 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute left-1/4 bottom-0 h-60 w-60 rounded-full bg-primary/5 blur-3xl" />
        <svg 
          className="absolute top-0 left-0 w-full h-full opacity-20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 40V0H40" fill="none" stroke="currentColor" strokeOpacity="0.1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>

      <motion.div 
        className="grid lg:grid-cols-2 gap-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left column - Form heading and description */}
        <motion.div variants={itemVariants} className="flex flex-col justify-center">
          <motion.div 
            className="inline-flex items-center bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Scale className="mr-2 h-4 w-4" />
            Free Legal Assistance
          </motion.div>

          <motion.h1 
            className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight"
            variants={itemVariants}
          >
            GET LEGAL HELP!
          </motion.h1>
          
          <motion.div 
            className="h-1 w-20 bg-primary rounded-full mb-6"
            variants={itemVariants}
          />
          
          <motion.p 
            className="text-muted-foreground text-lg mb-8"
            variants={itemVariants}
          >
            At ABU Law Clinic, we provide free legal assistance to those who cannot afford legal representation. Fill out the form to get help with your legal issue.
          </motion.p>
          
          <motion.div 
            className="space-y-6"
            variants={containerVariants}
          >
            <motion.div 
              className="flex items-start gap-4"
              variants={itemVariants}
            >
              <div className="mt-0.5 bg-primary/10 p-2 rounded-lg">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">OUR OFFICE</h3>
                <address className="text-muted-foreground not-italic">
                  2nd Floor, Faculty of Law,<br />
                  Ahmadu Bello University,<br />
                  Kongo Campus, Zaria, Nigeria
                </address>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-start gap-4"
              variants={itemVariants}
            >
              <div className="mt-0.5 bg-primary/10 p-2 rounded-lg">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">EMAIL</h3>
                <a href="mailto:hello@abulawclinic.com" className="text-muted-foreground hover:text-primary transition-colors">
                  hello@abulawclinic.com
                </a>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-start gap-4"
              variants={itemVariants}
            >
              <div className="mt-0.5 bg-primary/10 p-2 rounded-lg">
                <CalendarClock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">OFFICE HOURS</h3>
                <p className="text-muted-foreground">
                  Monday - Friday: 9:00 AM - 4:00 PM<br />
                  Saturday - Sunday: Closed
                </p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right column - Form */}
        <motion.div 
          variants={itemVariants}
          className="relative backdrop-blur-sm border border-border/80 rounded-2xl w-full p-6 sm:p-8 shadow-xl bg-card/60"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl" />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 relative z-10">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium flex items-center gap-1.5">
                      <User className="h-4 w-4" /> Full Name <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="e.g Dominic Praise" 
                          className="h-12 pl-10 bg-background/50 border-border focus:ring-2 focus:ring-ring/20"
                          {...field}
                        />
                        <User className="h-4 w-4 absolute left-3 top-4 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium flex items-center gap-1.5">
                        <Mail className="h-4 w-4" /> Email Address <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder="e.g dom@mail.com" 
                            type="email"
                            className="h-12 pl-10 bg-background/50 border-border focus:ring-2 focus:ring-ring/20"
                            {...field}
                          />
                          <Mail className="h-4 w-4 absolute left-3 top-4 text-muted-foreground" />
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
                      <FormLabel className="text-sm font-medium flex items-center gap-1.5">
                        <Phone className="h-4 w-4" /> Phone Number <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder="e.g 09000000000" 
                            className="h-12 pl-10 bg-background/50 border-border focus:ring-2 focus:ring-ring/20"
                            {...field}
                          />
                          <Phone className="h-4 w-4 absolute left-3 top-4 text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="legal_issue_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium flex items-center gap-1.5">
                        <FileText className="h-4 w-4" /> Legal Issue Type <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 bg-background/50 border-border focus:ring-2 focus:ring-ring/20">
                            <SelectValue placeholder="Choose Legal Issue" />
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
                      <FormLabel className="text-sm font-medium flex items-center gap-1.5">
                        <Building2 className="h-4 w-4" /> Had pro bono help before? <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 bg-background/50 border-border focus:ring-2 focus:ring-ring/20">
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
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium flex items-center gap-1.5">
                      <FileText className="h-4 w-4" /> Brief Description of your legal issue <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Please describe your legal issue in detail..." 
                        className="min-h-32 resize-none bg-background/50 border-border focus:ring-2 focus:ring-ring/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <motion.div className="pt-2 flex flex-col gap-2">
                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full h-12 shadow-lg hover:shadow-primary/20 group"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      GET LEGAL HELP
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-center text-muted-foreground">
                  The field with <span className="text-destructive">*</span> is required.
                </p>
              </motion.div>
            </form>
          </Form>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 pt-6 border-t border-border/50 text-center"
          >
            <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
              <HelpCircle className="h-4 w-4" />
              <span>Need more information?</span>
              <Link href="/faq" className="text-primary hover:underline underline-offset-2">
                Visit our FAQ
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default GetHelp