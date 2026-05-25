import React, { PropsWithChildren } from "react"
import { redirect } from "next/navigation"
import { ThemeProvider } from "next-themes"
import { getUser } from "@/services/server/auth"

import { SidebarProvider } from "@/components/dashboard/sidebar-context"
import { DashboardLayoutContent } from "@/components/dashboard/layout-content"

const Layout = async ({ children }: PropsWithChildren) => {
  const { data: user } = await getUser()

  if (!user) {
    redirect("/login?next=/dashboard")
  }
  if (!user.is_staff) {
    redirect("/forbidden")
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
