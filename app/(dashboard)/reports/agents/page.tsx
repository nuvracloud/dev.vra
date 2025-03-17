import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { AgentsReport } from "@/components/reports/agents-report"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Relatório de Agentes | AI Agent Platform",
  description: "Análise de desempenho dos agentes de IA",
}

export default function AgentsReportPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Relatório de Agentes" text="Análise de desempenho dos agentes de IA.">
        <Link href="/reports">
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>
      </DashboardHeader>
      <AgentsReport />
    </DashboardShell>
  )
}

