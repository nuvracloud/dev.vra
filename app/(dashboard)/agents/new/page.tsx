import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { AgentForm } from "@/components/agents/agent-form"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Novo Agente | AI Agent Platform",
  description: "Crie um novo agente de IA",
}

export default function NewAgentPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Novo Agente" text="Configure e crie um novo agente de IA.">
        <Link href="/agents">
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>
      </DashboardHeader>
      <AgentForm />
    </DashboardShell>
  )
}

