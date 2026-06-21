"use client"

import React, { useState } from 'react'
import { User } from '@/@types/db'
import { z } from "zod"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useUpdateUser } from '@/services/client/users'
import { 
  LucideLoader2,
  Mail, 
  User as UserIcon, 
  Phone,
  Shield,
  Eye,
  EyeOff,
  Save,
  X,
  UserCheck,
  Lock
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import LoadingOverlay from '@/components/loading-overlay'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface EditUserFormProps {
  user: User
}

const UpdateUserSchema = z.object({
  username: z.string().min(3, { message: 'Username must be at least 3 characters' }).optional(),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  first_name: z.string().min(2, { message: 'First name must be at least 2 characters' }).optional().nullable(),
  last_name: z.string().min(2, { message: 'Last name must be at least 2 characters' }).optional().nullable(),
  phone: z.string().optional().nullable(),
  avatar: z.string().url({ message: 'Please enter a valid URL for the avatar' }).optional().nullable(),
  is_active: z.boolean().optional(),
  is_staff: z.boolean().optional(),
  is_superuser: z.boolean().optional(),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }).optional(),
})

const EditUserForm = ({ user }: EditUserFormProps) => {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [changePassword, setChangePassword] = useState(false)
  
  const { mutate: updateUser, isPending } = useUpdateUser()

  const getInitials = (user: User) => {
    return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase() || user.email[0].toUpperCase()
  }

  const form = useForm({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      username: user.username,
      email: user.email,
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      phone: user.phone || '',
      avatar: user.avatar || '',
      is_active: user.is_active,
      is_staff: user.is_staff,
      is_superuser: user.is_superuser,
      password: '',
    },
  })

  const onSubmit = (values: any) => {
    const submitValues = { ...values }
    if (!changePassword) {
      delete submitValues.password
    }

    const payload = Object.fromEntries(
      Object.entries(submitValues).filter(([_, v]) => v !== undefined && v !== '')
    )

    updateUser(
      { id: user.id, payload }, 
      {
        onSuccess: () => {
          router.push('/dashboard/users')
        },
        onError: (error) => {
          toast.error(error?.message || 'Failed to update user')
        }
      }
    )
  }

  return (
    <div className="w-full relative">
      {isPending && <LoadingOverlay />}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Section 1: Profile Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-zinc-400" />
              Profile Information
            </h3>
            
            <div className="flex flex-col md:flex-row gap-6 items-start pt-2">
              <div className="flex-shrink-0">
                <Avatar className="h-24 w-24 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                  <AvatarImage src={user.avatar || ''} alt={user.username} className="object-cover"/>
                  <AvatarFallback className="text-xl bg-primary/10 text-primary font-medium">
                    {getInitials(user)}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="flex-grow space-y-5 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-zinc-500">Username</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="username" 
                            className="h-10 rounded-lg"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-zinc-500">Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="email@example.com" 
                            className="h-10 rounded-lg"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-zinc-500">First Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="First Name" 
                            className="h-10 rounded-lg" 
                            {...field} 
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-zinc-500">Last Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Last Name" 
                            className="h-10 rounded-lg"
                            {...field} 
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-zinc-500">Phone Number</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Phone Number (optional)" 
                            className="h-10 rounded-lg"
                            {...field} 
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="avatar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-zinc-500">Avatar URL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://example.com/avatar.jpg" 
                            className="h-10 rounded-lg"
                            {...field} 
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormDescription className="text-[11px] font-medium text-muted-foreground">
                          Enter a direct URL for the user's profile image.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-zinc-200/60 dark:bg-zinc-800/60" />
          
          {/* Section 2: Permissions */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Shield className="h-4 w-4 text-zinc-400" />
              Role & Permissions
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className={`flex flex-row items-start space-x-3 space-y-0 rounded-xl border p-4 transition-colors ${field.value ? 'border-emerald-200 bg-emerald-500/5 dark:border-emerald-800/40' : 'border-zinc-200 dark:border-zinc-800'}`}>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-semibold">Active Account</FormLabel>
                      <FormDescription className="text-xs font-medium">
                        User can log in and access the system.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="is_staff"
                render={({ field }) => (
                  <FormItem className={`flex flex-row items-start space-x-3 space-y-0 rounded-xl border p-4 transition-colors ${field.value ? 'border-blue-200 bg-blue-500/5 dark:border-blue-800/40' : 'border-zinc-200 dark:border-zinc-800'}`}>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-semibold">Staff Member</FormLabel>
                      <FormDescription className="text-xs font-medium">
                        User has access to the admin dashboard.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="is_superuser"
                render={({ field }) => (
                  <FormItem className={`flex flex-row items-start space-x-3 space-y-0 rounded-xl border p-4 transition-colors ${field.value ? 'border-primary/30 bg-primary/5' : 'border-zinc-200 dark:border-zinc-800'}`}>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-semibold">Administrator</FormLabel>
                      <FormDescription className="text-xs font-medium">
                        Full system access and all permissions.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator className="bg-zinc-200/60 dark:bg-zinc-800/60" />
          
          {/* Section 3: Password Update */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <Lock className="h-4 w-4 text-zinc-400" />
                Security Credentials
              </h3>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => setChangePassword(!changePassword)}
                className="h-7 px-3 text-xs rounded-lg"
              >
                {changePassword ? (
                  <>
                    <X className="h-3.5 w-3.5 mr-1" />
                    Cancel
                  </>
                ) : (
                  'Change Password'
                )}
              </Button>
            </div>
            
            {changePassword && (
              <div className="max-w-lg pt-1">
                <Alert className="mb-4 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl">
                  <AlertDescription className="text-xs text-zinc-500 dark:text-zinc-400">
                    Enter a new password for this user. They will need to use this password the next time they log in.
                  </AlertDescription>
                </Alert>
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-zinc-500">New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showPassword ? "text" : "password"}
                            placeholder="New password" 
                            className="h-10 pr-10 rounded-lg"
                            {...field} 
                          />
                          <button 
                            type="button" 
                            className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600 transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormDescription className="text-[11px] font-medium text-muted-foreground">
                        Password must be at least 8 characters long.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              className="h-10 rounded-lg px-5"
              onClick={() => router.push('/dashboard/users')}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isPending || !form.formState.isDirty}
              className="h-10 rounded-lg px-5 gap-2"
            >
              {isPending ? (
                <>
                  <LucideLoader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default EditUserForm
