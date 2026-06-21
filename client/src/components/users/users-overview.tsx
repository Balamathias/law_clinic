'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Users, UserCheck, Shield, Key, Eye, EyeOff, Save, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import type { UsersOverview as UsersOverviewType } from '@/@types/db';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCreateUser } from '@/services/client/users';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface UsersOverviewProps extends UsersOverviewType {
}

const CreateUserSchema = z.object({
  username: z.string().min(3, { message: 'Username must be at least 3 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  is_active: z.boolean().default(true),
  is_staff: z.boolean().default(false),
  is_superuser: z.boolean().default(false),
});

const UsersOverview = ({ 
  totalUsers, 
  activeUsers = 0, 
  staffUsers = 0,
  adminUsers = 0 
}: UsersOverviewProps) => {
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: createUser, isPending } = useCreateUser();

  // Calculate percentages
  const activePercentage = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;
  const staffPercentage = totalUsers > 0 ? Math.round((staffUsers / totalUsers) * 100) : 0;

  const form = useForm({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      is_active: true,
      is_staff: false,
      is_superuser: false,
    }
  });

  const onSubmit = (values: z.infer<typeof CreateUserSchema>) => {
    createUser(values, {
      onSuccess: (res) => {
        if (res?.data) {
          setOpen(false);
          form.reset();
        }
      }
    });
  };

  return (
    <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <Card className="overflow-hidden border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-950 shadow-sm rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-primary/5">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Total Users</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{totalUsers.toLocaleString()}</div>
            <div className="mt-1 flex items-center text-xs text-muted-foreground font-medium">
              <span>Registered accounts</span>
            </div>
            <div className="mt-4.5 h-1 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '100%' }} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.05 }}
      >
        <Card className="overflow-hidden border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-950 shadow-sm rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-emerald-500/5">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{activeUsers.toLocaleString()}</div>
            <div className="mt-1 flex items-center text-xs text-muted-foreground font-medium">
              <span>{activePercentage}% of total users</span>
            </div>
            <div className="mt-4.5 h-1 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                style={{ width: `${activePercentage}%` }} 
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.1 }}
      >
        <Card className="overflow-hidden border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-950 shadow-sm rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-blue-500/5">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Staff & Admin</CardTitle>
            <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{(staffUsers + adminUsers).toLocaleString()}</div>
            <div className="mt-1 flex items-center text-xs text-muted-foreground font-medium">
              <span>{staffPercentage}% of total users</span>
            </div>
            <div className="mt-4.5 h-1 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                style={{ width: `${staffPercentage}%` }} 
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.15 }}
        className="relative"
      >
        <Dialog open={open} onOpenChange={setOpen}>
          <Card className="overflow-hidden h-full border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50/10 dark:bg-zinc-900/10 shadow-none rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-500">User Management</CardTitle>
              <CardDescription className="text-[11px] font-medium text-muted-foreground">
                Add or manage system users
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col justify-center h-[calc(100%-60px)] items-center py-4">
              <DialogTrigger asChild>
                <Button 
                  className="w-full flex items-center justify-center h-10 rounded-lg bg-primary text-primary-foreground font-medium"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  <span>Add New User</span>
                </Button>
              </DialogTrigger>
            </CardContent>
          </Card>

          <DialogContent className="sm:max-w-[500px] border border-zinc-200/80 dark:border-zinc-800/80 shadow-lg rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Create New User</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Provide credentials and system privilege levels for the new user.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4.5 mt-2">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-zinc-500">First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="First Name" className="h-9 rounded-lg" {...field} />
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
                          <Input placeholder="Last Name" className="h-9 rounded-lg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-zinc-500">Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Username" className="h-9 rounded-lg" {...field} />
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
                          <Input placeholder="email@example.com" className="h-9 rounded-lg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-zinc-500">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showPassword ? "text" : "password"}
                            placeholder="Password (min 8 chars)" 
                            className="h-9 pr-10 rounded-lg"
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-3 gap-3 border border-zinc-200/60 dark:border-zinc-800/60 rounded-xl p-3.5 bg-zinc-50/30 dark:bg-zinc-900/10">
                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-300">Active</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="is_staff"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-300">Staff</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="is_superuser"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-300">Admin</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <Button type="button" variant="outline" className="h-9 rounded-lg" onClick={() => setOpen(false)} disabled={isPending}>
                    Cancel
                  </Button>
                  <Button type="submit" className="h-9 rounded-lg gap-2" disabled={isPending}>
                    {isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Create User
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
};

export default UsersOverview;


const UsersOverviewSkeleton = () => {
    return (
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-6">
            {/* Total Users Card */}
            <div>
                <Card className="overflow-hidden border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-950 shadow-sm rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-primary/5">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-505">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent className="pt-4">
                        <Skeleton className="h-8 w-20 mb-1" />
                        <div className="mt-1 flex items-center text-xs text-muted-foreground">
                            <span>Registered accounts</span>
                        </div>
                        <div className="mt-3 h-1 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <Skeleton className="h-full w-full rounded-full" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Active Users Card */}
            <div>
                <Card className="overflow-hidden border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-950 shadow-sm rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-green-500/5">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-505">Active Users</CardTitle>
                        <UserCheck className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent className="pt-4">
                        <Skeleton className="h-8 w-20 mb-1" />
                        <div className="mt-1 flex items-center text-xs text-muted-foreground">
                            <Skeleton className="h-3 w-28" />
                        </div>
                        <div className="mt-3 h-1 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <Skeleton className="h-full w-3/4 rounded-full" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Staff & Admin Card */}
            <div>
                <Card className="overflow-hidden border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-950 shadow-sm rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-blue-500/5">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-505">Staff & Admin</CardTitle>
                        <Shield className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent className="pt-4">
                        <Skeleton className="h-8 w-20 mb-1" />
                        <div className="mt-1 flex items-center text-xs text-muted-foreground">
                            <Skeleton className="h-3 w-28" />
                        </div>
                        <div className="mt-3 h-1 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <Skeleton className="h-full w-1/4 rounded-full" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* User Management Card */}
            <div>
                <Card className="overflow-hidden h-full border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50/10 dark:bg-zinc-900/10 shadow-none rounded-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-505">User Management</CardTitle>
                        <CardDescription className="text-[11px] font-medium text-muted-foreground">
                            Add or manage system users
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col justify-center h-[calc(100%-60px)] items-center py-4">
                        <Button 
                            disabled
                            className="w-full flex items-center justify-center bg-primary h-10 rounded-lg"
                        >
                            <UserPlus className="mr-2 h-4 w-4" />
                            <span>Add New User</span>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export { UsersOverviewSkeleton };