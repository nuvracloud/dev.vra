import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { AgentsList } from "@/components/agents/agents-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Agentes | AI Agent Platform",
  description: "Gerencie seus agentes de IA",
}

export default function AgentsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Agentes" text="Crie e gerencie seus agentes de IA.">
        <Link href="/agents/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Agente
          </Button>
        </Link>
      </DashboardHeader>
      <AgentsList />
    </DashboardShell>
  )
}

