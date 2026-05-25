'use client'

import React, { useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  Check,
  Clock,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Scale,
  Shield,
  User,
} from 'lucide-react'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useCreateHelpRequest } from '@/services/client/help-requests'
import type { CreateHelpRequestPayload } from '@/services/server/help-requests'
import { cn } from '@/lib/utils'

const personalDetailsSchema = z.object({
  full_name: z.string().min(2, { message: 'Please enter your full name.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone_number: z.string().min(10, { message: 'Please enter a valid phone number.' }),
})

const legalIssueSchema = z.object({
  legal_issue_type: z.string().min(1, { message: 'Please select a legal issue type.' }),
  had_previous_help: z.enum(['yes', 'no'], {
    required_error: 'Please select an option.',
  }),
})

const descriptionSchema = z.object({
  description: z
    .string()
    .min(20, { message: 'Please describe the issue in at least 20 characters.' }),
})

const helpFormSchema = personalDetailsSchema.merge(legalIssueSchema).merge(descriptionSchema)

type HelpFormValues = z.infer<typeof helpFormSchema>
type HelpFormField = keyof HelpFormValues

const steps: {
  title: string
  description: string
  fields: HelpFormField[]
}[] = [
  {
    title: 'Personal details',
    description: 'Tell us who to contact after the intake review.',
    fields: ['full_name', 'email', 'phone_number'],
  },
  {
    title: 'Legal issue',
    description: 'Help us route your request to the right clinic team.',
    fields: ['legal_issue_type', 'had_previous_help'],
  },
  {
    title: 'Description',
    description: 'Share the facts, dates, people involved, and any urgent deadlines.',
    fields: ['description'],
  },
]

const legalIssueTypes = [
  'Family Law',
  'Housing & Tenancy',
  'Employment Law',
  'Consumer Protection',
  'Human Rights',
  'Criminal Law',
  'Civil Litigation',
  'Administrative Law',
  'Property Law',
  'Other',
]

const benefits = [
  {
    icon: Shield,
    title: 'Confidential review',
    description: 'Your information is handled carefully by the clinic intake team.',
  },
  {
    icon: Scale,
    title: 'Free legal aid',
    description: 'Eligible matters are reviewed and supported at no legal fee.',
  },
  {
    icon: Clock,
    title: 'Clear next step',
    description: 'The team will contact you after reviewing your submission.',
  },
]

export default function GetHelp() {
  const router = useRouter()
  const shouldReduceMotion = useReducedMotion()
  const [step, setStep] = useState(0)
  const { mutate: createRequest, isPending: isSubmitting } = useCreateHelpRequest()

  const form = useForm<HelpFormValues>({
    resolver: zodResolver(helpFormSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone_number: '',
      legal_issue_type: '',
      had_previous_help: 'no',
      description: '',
    },
    mode: 'onTouched',
  })

  const currentStep = steps[step]
  const progress = useMemo(() => ((step + 1) / steps.length) * 100, [step])

  const nextStep = async () => {
    const valid = await form.trigger(currentStep.fields, { shouldFocus: true })
    if (valid) setStep((value) => Math.min(value + 1, steps.length - 1))
  }

  const previousStep = () => {
    setStep((value) => Math.max(value - 1, 0))
  }

  const onSubmit = (data: HelpFormValues) => {
    const payload: CreateHelpRequestPayload = {
      full_name: data.full_name,
      email: data.email,
      phone_number: data.phone_number,
      legal_issue_type: data.legal_issue_type,
      had_previous_help: data.had_previous_help,
      description: data.description,
    }

    createRequest(payload, {
      onSuccess: (response) => {
        if (response?.data) {
          toast.success('Request submitted successfully.')
          form.reset()
          router.push('/get-help/submitted')
          return
        }

        toast.error(response?.message || 'Failed to submit request.')
      },
      onError: (error) => {
        toast.error(error?.message || 'An error occurred while submitting the request.')
      },
    })
  }

  return (
    <section className="bg-background py-20 md:py-28 lg:py-36">
      <div className="container-editorial">
        <motion.div
          className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <span className="text-eyebrow inline-flex items-center gap-2">
              <Scale className="size-4 text-primary" />
              Free Legal Assistance
            </span>
            <h1 className="text-h1-editorial mt-5 text-foreground">Get Legal Help</h1>
            <p className="text-lede mt-5">
              Complete the intake in three short steps. The clinic team will review your request
              and contact you with the next available pathway.
            </p>

            <div className="mt-8 space-y-4">
              {benefits.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden />
                  </div>
                  <div>
                    <h2 className="font-serif text-lg font-semibold text-foreground">{title}</h2>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-xl border border-border bg-card p-6">
              <h2 className="font-serif text-xl font-semibold text-foreground">Contact Information</h2>
              <div className="mt-5 space-y-4 text-sm text-muted-foreground">
                <div className="flex gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                  <address className="not-italic">
                    2nd Floor, Faculty of Law, Ahmadu Bello University, Kongo Campus, Zaria
                  </address>
                </div>
                <a href="mailto:hello@abulawclinic.com" className="flex gap-3 text-primary hover:underline">
                  <Mail className="mt-0.5 size-4 shrink-0" />
                  hello@abulawclinic.com
                </a>
                <div className="flex gap-3">
                  <CalendarClock className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>Monday to Friday, 9:00 AM - 4:00 PM</span>
                </div>
              </div>
            </div>
          </aside>

          <div className="rounded-xl border border-border bg-card p-6 md:p-8">
            <div className="mb-8">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="font-medium text-primary">Step {step + 1} of {steps.length}</span>
                <span className="text-muted-foreground">{currentStep.title}</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <ol className="mt-6 grid gap-3 sm:grid-cols-3">
                {steps.map((item, index) => (
                  <li
                    key={item.title}
                    className={cn(
                      'rounded-lg border p-3',
                      index === step
                        ? 'border-primary bg-primary/5'
                        : index < step
                          ? 'border-primary/30 bg-primary/5'
                          : 'border-border bg-background',
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'flex size-6 items-center justify-center rounded-full text-xs font-semibold',
                          index <= step
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground',
                        )}
                      >
                        {index < step ? <Check className="size-3.5" /> : index + 1}
                      </span>
                      <span className="text-sm font-medium text-foreground">{item.title}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-foreground">
                    {currentStep.title}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">{currentStep.description}</p>
                </div>

                {step === 0 && (
                  <div className="space-y-5">
                    <FormField
                      control={form.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                              <Input placeholder="Enter your full name" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid gap-5 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input placeholder="you@example.com" type="email" className="pl-10" {...field} />
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
                            <FormLabel>Phone Number <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input placeholder="09012345678" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="legal_issue_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Legal Issue Type <span className="text-destructive">*</span></FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
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
                          <FormLabel>Had pro bono help before? <span className="text-destructive">*</span></FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select option" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {step === 2 && (
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brief Description <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your legal issue. Include relevant dates, parties involved, urgent deadlines, and any previous action taken."
                            className="min-h-44 resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={previousStep}
                    disabled={step === 0 || isSubmitting}
                  >
                    <ArrowLeft className="size-4" />
                    Back
                  </Button>

                  {step < steps.length - 1 ? (
                    <Button type="button" onClick={nextStep}>
                      Continue
                      <ArrowRight className="size-4" />
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Submitting
                        </>
                      ) : (
                        <>
                          Submit request
                          <FileText className="size-4" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
