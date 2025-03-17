"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Bot,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Headphones,
  Layers,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Users,
  Workflow,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface DashboardNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DashboardNav({ className, ...props }: DashboardNavProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed)
  }

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Agentes",
      href: "/agents",
      icon: Bot,
    },
    {
      title: "CRM",
      href: "/crm",
      icon: Users,
      children: [
        {
          title: "Conversas",
          href: "/crm/conversations",
          icon: MessageSquare,
        },
        {
          title: "Contatos",
          href: "/crm/contacts",
          icon: Users,
        },
        {
          title: "Kanban",
          href: "/crm/kanban",
          icon: Layers,
        },
      ],
    },
    {
      title: "Automações",
      href: "/automations",
      icon: Workflow,
    },
    {
      title: "Integrações",
      href: "/integrations",
      icon: Headphones,
    },
    {
      title: "Relatórios",
      href: "/reports",
      icon: BarChart3,
    },
    {
      title: "Assinatura",
      href: "/billing",
      icon: CreditCard,
    },
    {
      title: "Configurações",
      href: "/settings",
      icon: Settings,
    },
  ]

  return (
    <TooltipProvider>
      <div className={cn("relative border-r bg-background", className)} {...props}>
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center px-4 py-2">
            <Link href="/" className="flex items-center space-x-2">
              {!isCollapsed && (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                  </svg>
                  <span className="font-bold">AI Agent Platform</span>
                </>
              )}
              {isCollapsed && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                </svg>
              )}
            </Link>
          </div>
          <ScrollArea className="flex-1 py-2">
            <nav className="grid gap-1 px-2">
              {navItems.map((item, index) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

                return (
                  <div key={index}>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                            isActive ? "bg-accent" : "transparent",
                            isCollapsed ? "justify-center" : "justify-start",
                          )}
                        >
                          <item.icon className={cn("h-5 w-5", isCollapsed ? "mr-0" : "mr-2")} />
                          {!isCollapsed && <span>{item.title}</span>}
                        </Link>
                      </TooltipTrigger>
                      {isCollapsed && <TooltipContent side="right">{item.title}</TooltipContent>}
                    </Tooltip>

                    {!isCollapsed && item.children && (
                      <div className="ml-4 mt-1 grid gap-1">
                        {item.children.map((child, childIndex) => {
                          const isChildActive = pathname === child.href

                          return (
                            <Link
                              key={childIndex}
                              href={child.href}
                              className={cn(
                                "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                                isChildActive ? "bg-accent" : "transparent",
                              )}
                            >
                              <child.icon className="mr-2 h-4 w-4" />
                              <span>{child.title}</span>
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>
          </ScrollArea>
          <div className="sticky bottom-0 border-t bg-background p-2">
            <Button variant="outline" size="icon" className="w-full" onClick={toggleCollapsed}>
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

