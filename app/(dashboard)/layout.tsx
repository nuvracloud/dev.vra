import type React from "react"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { WorkspaceSwitcher } from "@/components/dashboard/workspace-switcher"
import { MobileNav } from "@/components/dashboard/mobile-nav"
import { UserNav } from "@/components/dashboard/user-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="flex h-16 items-center px-4">
          <MobileNav />
          <WorkspaceSwitcher className="mr-4" />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <DashboardNav className="hidden lg:block" />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

