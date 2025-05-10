'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Users, UserCheck, Shield } from "lucide-react";
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import type { UsersOverview } from '@/@types/db';

interface UsersOverviewProps extends UsersOverview {
}

const UsersOverview = ({ 
  totalUsers, 
  activeUsers = 0, 
  staffUsers = 0,
  adminUsers = 0 
}: UsersOverviewProps) => {
  const router = useRouter();
  
  // Calculate percentages
  const activePercentage = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;
  const staffPercentage = totalUsers > 0 ? Math.round((staffUsers / totalUsers) * 100) : 0;
  const adminPercentage = totalUsers > 0 ? Math.round((adminUsers / totalUsers) * 100) : 0;

  return (
    <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="overflow-hidden shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-primary/5">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{totalUsers.toLocaleString()}</div>
            <div className="mt-1 flex items-center text-xs text-muted-foreground">
              <span>Registered accounts</span>
            </div>
            <div className="mt-3 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '100%' }} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="overflow-hidden shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-green-500/5">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{activeUsers.toLocaleString()}</div>
            <div className="mt-1 flex items-center text-xs text-muted-foreground">
              <span>{activePercentage}% of total users</span>
            </div>
            <div className="mt-3 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 rounded-full transition-all duration-500" 
                style={{ width: `${activePercentage}%` }} 
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="overflow-hidden shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-blue-500/5">
            <CardTitle className="text-sm font-medium">Staff & Admin</CardTitle>
            <Shield className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{(staffUsers + adminUsers).toLocaleString()}</div>
            <div className="mt-1 flex items-center text-xs text-muted-foreground">
              <span>{staffPercentage}% of total users</span>
            </div>
            <div className="mt-3 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                style={{ width: `${staffPercentage}%` }} 
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="relative"
      >
        <Card className="overflow-hidden h-full shadow-sm border-dashed">
          <CardHeader className="pb-2 bg-muted/30">
            <CardTitle className="text-sm font-medium">User Management</CardTitle>
            <CardDescription className="text-xs">
              Add or manage system users
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col justify-center h-[calc(100%-70px)] items-center py-6">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full"
            >
              <Button 
                onClick={() => router.push('/admin/users/new')}
                className="w-full flex items-center justify-center group relative overflow-hidden bg-primary"
                size="lg"
              >
                <span className="absolute inset-0 bg-white/10 group-hover:translate-y-0 translate-y-full transition-transform duration-300 ease-in-out"></span>
                <UserPlus 
                  className="mr-2 h-4 w-4 transition-transform group-hover:rotate-12 duration-300" 
                />
                <span>Add New User</span>
              </Button>
            </motion.div>
          </CardContent>
        </Card>
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
                <Card className="overflow-hidden shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-primary/5">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent className="pt-4">
                        <Skeleton className="h-8 w-20 mb-1" />
                        <div className="mt-1 flex items-center text-xs text-muted-foreground">
                            <span>Registered accounts</span>
                        </div>
                        <div className="mt-3 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                            <Skeleton className="h-full w-full rounded-full" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Active Users Card */}
            <div>
                <Card className="overflow-hidden shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-green-500/5">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <UserCheck className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent className="pt-4">
                        <Skeleton className="h-8 w-20 mb-1" />
                        <div className="mt-1 flex items-center text-xs text-muted-foreground">
                            <Skeleton className="h-3 w-28" />
                        </div>
                        <div className="mt-3 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                            <Skeleton className="h-full w-3/4 rounded-full" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Staff & Admin Card */}
            <div>
                <Card className="overflow-hidden shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-blue-500/5">
                        <CardTitle className="text-sm font-medium">Staff & Admin</CardTitle>
                        <Shield className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent className="pt-4">
                        <Skeleton className="h-8 w-20 mb-1" />
                        <div className="mt-1 flex items-center text-xs text-muted-foreground">
                            <Skeleton className="h-3 w-28" />
                        </div>
                        <div className="mt-3 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                            <Skeleton className="h-full w-1/4 rounded-full" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* User Management Card */}
            <div>
                <Card className="overflow-hidden h-full shadow-sm border-dashed">
                    <CardHeader className="pb-2 bg-muted/30">
                        <CardTitle className="text-sm font-medium">User Management</CardTitle>
                        <CardDescription className="text-xs">
                            Add or manage system users
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col justify-center h-[calc(100%-70px)] items-center py-6">
                        <Button 
                            disabled
                            className="w-full flex items-center justify-center bg-primary"
                            size="lg"
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