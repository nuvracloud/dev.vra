import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ConversationsReport } from "@/components/reports/conversations-report"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Relatório de Conversas | AI Agent Platform",
  description: "Análise detalhada das conversas e interações com clientes",
}

export default function ConversationsReportPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Relatório de Conversas"
        text="Análise detalhada das conversas e interações com clientes."
      >
        <Link href="/reports">
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>
      </DashboardHeader>
      <ConversationsReport />
    </DashboardShell>
  )
}

