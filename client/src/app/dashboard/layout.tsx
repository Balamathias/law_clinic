'use client'

import React, { PropsWithChildren, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ThemeProvider } from "next-themes"
import { useUser } from "@/services/client/auth"
import Loader from '@/components/loader'

import { SidebarProvider } from "@/components/dashboard/sidebar-context"
import { DashboardLayoutContent } from "@/components/dashboard/layout-content"

const Layout = ({ children }: PropsWithChildren) => {
  const { data: userResponse, isLoading } = useUser()
  const router = useRouter()
  const user = userResponse?.data

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login?next=/dashboard")
      } else if (!user.is_staff) {
        router.push("/forbidden")
      }
    }
  }, [user, isLoading, router])

  if (isLoading || !user || !user.is_staff) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader variant="dots" size={64} text="Verifying credentials..." />
      </div>
    )
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="dashboard-theme"
      disableTransitionOnChange
    >
      <SidebarProvider>
        <DashboardLayoutContent user={user}>
          {children}
        </DashboardLayoutContent>
      </SidebarProvider>
    </ThemeProvider>
  )
}

export default Layout
