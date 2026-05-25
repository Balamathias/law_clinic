import React, { PropsWithChildren } from "react"
import { redirect } from "next/navigation"
import { ThemeProvider } from "next-themes"
import DashboardSidebar from "@/components/dashboard/sidebar"
import DashboardTopbar from "@/components/dashboard/navbar"
import { CommandPaletteProvider } from "@/components/dashboard/command-palette"
import { getUser } from "@/services/server/auth"

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
      <div className="dashboard min-h-screen bg-background text-foreground">
        <DashboardSidebar user={user} />
        <CommandPaletteProvider user={user}>
          <DashboardTopbar user={user} />
          <main className="lg:pl-60 pt-14">
            <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6 lg:py-8">{children}</div>
          </main>
        </CommandPaletteProvider>
      </div>
    </ThemeProvider>
  )
}

export default Layout
