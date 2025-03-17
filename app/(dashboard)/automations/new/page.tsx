import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { FlowBuilder } from "@/components/automations/flow-builder"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Nova Automação | AI Agent Platform",
  description: "Crie um novo fluxo de automação",
}

export default function NewAutomationPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Nova Automação"
        text="Crie um fluxo de trabalho automatizado arrastando e conectando os módulos."
      >
        <Link href="/automations">
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>
      </DashboardHeader>
      <div className="h-[calc(100vh-220px)]">
        <FlowBuilder />
      </div>
    </DashboardShell>
  )
}

