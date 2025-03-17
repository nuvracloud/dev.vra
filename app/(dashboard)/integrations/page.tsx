import type { Metadata } from "next"
import { IntegrationsTabs } from "@/components/integrations/integrations-tabs"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export const metadata: Metadata = {
  title: "Integrações | AI Agent Platform",
  description: "Conecte sua plataforma com serviços externos e expanda suas funcionalidades",
}

export default function IntegrationsPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Integrações"
        text="Conecte sua plataforma com serviços externos e expanda suas funcionalidades."
      />
      <IntegrationsTabs />
    </DashboardShell>
  )
}

