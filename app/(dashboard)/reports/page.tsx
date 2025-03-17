import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ReportsDashboard } from "@/components/reports/reports-dashboard"

export const metadata: Metadata = {
  title: "Relatórios | AI Agent Platform",
  description: "Visualize e analise dados de desempenho da sua plataforma",
}

export default function ReportsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Relatórios" text="Visualize e analise dados de desempenho da sua plataforma." />
      <ReportsDashboard />
    </DashboardShell>
  )
}

