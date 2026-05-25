"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-context";
import DashboardSidebar from "./sidebar";
import DashboardTopbar from "./navbar";
import { CommandPaletteProvider } from "./command-palette";
import type { User } from "@/@types/db";

interface DashboardLayoutContentProps {
  user: User;
  children: React.ReactNode;
}

export function DashboardLayoutContent({ user, children }: DashboardLayoutContentProps) {
  const { collapsed, mounted } = useSidebar();

  return (
    <div 
      className="dashboard min-h-screen bg-background text-foreground"
      style={{
        // Define CSS Custom Variables for dynamic layout sizing
        "--sidebar-width": !mounted ? "240px" : collapsed ? "64px" : "240px",
      } as React.CSSProperties}
    >
      <DashboardSidebar user={user} />
      
      <CommandPaletteProvider user={user}>
        <DashboardTopbar user={user} />
        
        {/* Main Content Area has dynamic left padding matching the sidebar width */}
        <main 
          className={cn(
            "pt-14 transition-[padding] duration-200 ease-in-out",
            // Large screens get dynamic left padding based on the sidebar width
            "lg:pl-[var(--sidebar-width)]"
          )}
        >
          <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
            {children}
          </div>
        </main>
      </CommandPaletteProvider>
    </div>
  );
}
