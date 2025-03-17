import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { AgentChat } from "@/components/agents/agent-chat"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Chat com Agente | AI Agent Platform",
  description: "Converse com seu agente de IA",
}

export default function AgentChatPage({ params }: { params: { id: string } }) {
  return (
    <DashboardShell>
      <DashboardHeader heading="Chat com Agente" text="Converse com seu agente de IA para testar seu funcionamento.">
        <Link href="/agents">
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar para Agentes
          </Button>
        </Link>
      </DashboardHeader>
      <AgentChat agentId={params.id} />
    </DashboardShell>
  )
}

