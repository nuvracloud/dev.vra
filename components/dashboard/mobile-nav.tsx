"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Bot,
  CreditCard,
  Headphones,
  Layers,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Settings,
  Users,
  Workflow,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function MobileNav() {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()

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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2" onClick={() => setOpen(false)}>
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
          </Link>
        </div>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6" type="always" scrollHideDelay={0}>
          <div className="flex flex-col space-y-3">
            {navItems.map((item, index) => (
              <div key={index}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center text-sm font-medium text-muted-foreground",
                    pathname === item.href && "text-foreground",
                  )}
                >
                  <item.icon className="mr-2 h-5 w-5" />
                  {item.title}
                </Link>

                {item.children && (
                  <div className="ml-4 mt-2 flex flex-col space-y-2">
                    {item.children.map((child, childIndex) => (
                      <Link
                        key={childIndex}
                        href={child.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center text-sm font-medium text-muted-foreground",
                          pathname === child.href && "text-foreground",
                        )}
                      >
                        <child.icon className="mr-2 h-4 w-4" />
                        {child.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

