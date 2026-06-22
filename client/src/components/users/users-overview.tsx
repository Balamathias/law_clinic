'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Users, UserCheck, Shield, Key, Eye, EyeOff, Save, Loader2, Sparkles } from "lucide-react";
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
import { cn } from "@/lib/utils";

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
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {/* Total Users Card */}
      <div 
        className="group relative flex min-h-[140px] flex-col justify-between rounded-2xl border border-border bg-card p-5 text-foreground transition-all duration-300 shadow-xs hover:shadow-md hover:-translate-y-0.5 hover:bg-indigo-50/10 dark:hover:bg-indigo-950/5 hover:border-indigo-500/20"
      >
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="flex items-start justify-between gap-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Total Users
          </span>
          <div className="size-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center transition-all duration-300 group-hover:scale-105">
            <Users className="size-4.5" aria-hidden />
          </div>
        </div>
        <div className="mt-3 flex flex-col gap-1.5">
          <span className="font-serif text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
            {totalUsers.toLocaleString()}
          </span>
          <span className="text-[10px] text-muted-foreground font-medium">
            Registered accounts
          </span>
        </div>
      </div>

      {/* Active Users Card */}
      <div 
        className="group relative flex min-h-[140px] flex-col justify-between rounded-2xl border border-border bg-card p-5 text-foreground transition-all duration-300 shadow-xs hover:shadow-md hover:-translate-y-0.5 hover:bg-emerald-50/10 dark:hover:bg-emerald-950/5 hover:border-emerald-500/20"
      >
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="flex items-start justify-between gap-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Active Users
          </span>
          <div className="size-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition-all duration-300 group-hover:scale-105">
            <UserCheck className="size-4.5" aria-hidden />
          </div>
        </div>
        <div className="mt-3 flex flex-col gap-1.5">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
              {activeUsers.toLocaleString()}
            </span>
            <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
              {activePercentage}% of total
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground font-medium">
            Active clinical users
          </span>
        </div>
      </div>

      {/* Staff & Admin Card */}
      <div 
        className="group relative flex min-h-[140px] flex-col justify-between rounded-2xl border border-border bg-card p-5 text-foreground transition-all duration-300 shadow-xs hover:shadow-md hover:-translate-y-0.5 hover:bg-blue-50/10 dark:hover:bg-blue-950/5 hover:border-blue-500/20"
      >
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="flex items-start justify-between gap-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Staff & Admin
          </span>
          <div className="size-8 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-all duration-300 group-hover:scale-105">
            <Shield className="size-4.5" aria-hidden />
          </div>
        </div>
        <div className="mt-3 flex flex-col gap-1.5">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
              {(staffUsers + adminUsers).toLocaleString()}
            </span>
            <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-400">
              {staffPercentage}% of total
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground font-medium">
            Elevated system privileges
          </span>
        </div>
      </div>

      {/* User Management Card */}
      <div className="relative">
        <Dialog open={open} onOpenChange={setOpen}>
          <div className="flex flex-col justify-between rounded-2xl border border-dashed border-border bg-muted/30 p-5 text-foreground h-full min-h-[140px]">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <Sparkles className="size-3.5 text-primary" />
                User Management
              </div>
              <p className="mt-1 text-[10px] text-muted-foreground font-medium leading-relaxed">
                Add or manage system users and privilege rosters.
              </p>
            </div>
            
            <div className="mt-4">
              <DialogTrigger asChild>
                <Button 
                  className="w-full flex items-center justify-center h-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs shadow-xs transition-colors"
                >
                  <UserPlus className="mr-1.5 h-4 w-4" />
                  <span>Add New User</span>
                </Button>
              </DialogTrigger>
            </div>
          </div>

          <DialogContent className="sm:max-w-[500px] border-border bg-card rounded-2xl shadow-lg">
            <DialogHeader>
              <DialogTitle className="font-serif text-lg font-bold">Create New User</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Provide credentials and system privilege levels for the new user.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mt-2">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" className="h-10 rounded-xl border-border focus-visible:ring-primary/20" {...field} />
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
                        <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" className="h-10 rounded-xl border-border focus-visible:ring-primary/20" {...field} />
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
                        <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Username *</FormLabel>
                        <FormControl>
                          <Input placeholder="johndoe" className="h-10 rounded-xl border-border focus-visible:ring-primary/20" {...field} />
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
                        <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Email Address *</FormLabel>
                        <FormControl>
                          <Input placeholder="email@example.com" className="h-10 rounded-xl border-border focus-visible:ring-primary/20" {...field} />
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
                      <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Password *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showPassword ? "text" : "password"}
                            placeholder="Password (min 8 characters)" 
                            className="h-10 pr-10 rounded-xl border-border focus-visible:ring-primary/20"
                            {...field} 
                          />
                          <button 
                            type="button" 
                            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
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

                <div className="grid grid-cols-3 gap-3 border border-border rounded-xl p-3.5 bg-muted/20">
                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} className="rounded-md" />
                        </FormControl>
                        <FormLabel className="text-xs font-semibold text-foreground cursor-pointer">Active</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="is_staff"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} className="rounded-md" />
                        </FormControl>
                        <FormLabel className="text-xs font-semibold text-foreground cursor-pointer">Staff</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="is_superuser"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} className="rounded-md" />
                        </FormControl>
                        <FormLabel className="text-xs font-semibold text-foreground cursor-pointer">Admin</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-border/60">
                  <Button type="button" variant="outline" className="h-10 rounded-xl border-border font-bold text-xs" onClick={() => setOpen(false)} disabled={isPending}>
                    Cancel
                  </Button>
                  <Button type="submit" className="h-10 rounded-xl gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs shadow-xs" disabled={isPending}>
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
      </div>
    </div>
  );
};

export default UsersOverview;

const UsersOverviewSkeleton = () => {
  return (
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="min-h-[140px] rounded-2xl border border-border bg-card p-5 animate-pulse space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="h-3 w-24 rounded bg-muted" />
            <div className="size-4.5 rounded bg-muted" />
          </div>
          <div className="h-8 w-16 rounded bg-muted" />
          <div className="h-3 w-32 rounded bg-muted" />
        </div>
      ))}
    </div>
  );
};

export { UsersOverviewSkeleton };