import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { AutomationBuilder } from "@/components/automations/automation-builder"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Automações | AI Agent Platform",
  description: "Crie e gerencie fluxos de automação para conectar seus serviços",
}

export default function AutomationsPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Automações"
        text="Crie fluxos de trabalho automatizados entre seus serviços e aplicativos."
      >
        <Link href="/automations/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Automação
          </Button>
        </Link>
      </DashboardHeader>
      <div className="grid gap-4">
        <AutomationBuilder />
      </div>
    </DashboardShell>
  )
}

