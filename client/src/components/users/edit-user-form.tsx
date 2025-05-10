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
  X
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

// Create a schema for updating user information
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

  const form = useForm<z.infer<typeof UpdateUserSchema>>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      avatar: user.avatar,
      is_active: user.is_active,
      is_staff: user.is_staff,
      is_superuser: user.is_superuser,
      password: '',
    },
  })

  const onSubmit = (values: z.infer<typeof UpdateUserSchema>) => {
    // If not changing password, remove it from the payload
    if (!changePassword) {
      delete values.password
    }

    // Remove any undefined or empty string values to avoid unnecessary updates
    const payload = Object.fromEntries(
      Object.entries(values).filter(([_, v]) => v !== undefined && v !== '')
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
    <div className="w-full">
      {isPending && <LoadingOverlay />}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* User Profile Section */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-shrink-0">
              <Avatar className="h-24 w-24 border-2 border-border">
                <AvatarImage src={user.avatar || ''} alt={user.username} className="object-cover"/>
                <AvatarFallback className="text-xl bg-primary/10 text-primary">
                  {getInitials(user)}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="flex-grow space-y-6 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                        Username
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Username" 
                          className="h-10"
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Email address" 
                          className="h-10"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="First name" 
                          className="h-10" 
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
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Last name" 
                          className="h-10"
                          {...field} 
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Phone number (optional)" 
                          className="h-10"
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
                      <FormLabel>Avatar URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://example.com/avatar.jpg" 
                          className="h-10"
                          {...field} 
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Enter a URL for the user's profile image
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <Separator className="my-6" />
          
          {/* User Status Section */}
          <div className="space-y-4">
            <h3 className="text-md font-medium flex items-center gap-2">
              <Shield className="h-4 w-4" />
              User Permissions
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Active Account</FormLabel>
                      <FormDescription className="text-xs">
                        User can log in and access the system
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="is_staff"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Staff Member</FormLabel>
                      <FormDescription className="text-xs">
                        User has access to the admin dashboard
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="is_superuser"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 border-primary/20 bg-primary/5">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Administrator</FormLabel>
                      <FormDescription className="text-xs">
                        Full system access and all permissions
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator className="my-6" />
          
          {/* Password Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h3 className="text-md font-medium">Change Password</h3>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => setChangePassword(!changePassword)}
                className="h-7 px-2 text-xs"
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
              <div className="max-w-lg">
                <Alert className="mb-4 bg-muted/50 text-foreground">
                  <AlertDescription className="text-sm">
                    Enter a new password for this user. They will need to use this password the next time they log in.
                  </AlertDescription>
                </Alert>
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showPassword ? "text" : "password"}
                            placeholder="New password" 
                            className="h-10 pr-10"
                            {...field} 
                          />
                          <button 
                            type="button" 
                            className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Password must be at least 8 characters long
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
              onClick={() => router.push('/dashboard/users')}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isPending || !form.formState.isDirty}
              className="gap-2"
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
