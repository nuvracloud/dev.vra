import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardCards } from "@/components/dashboard/dashboard-cards"

export const metadata: Metadata = {
  title: "Dashboard | AI Agent Platform",
  description: "Dashboard da AI Agent Platform",
}

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Bem-vindo ao seu painel de controle." />
      <DashboardCards />
    </DashboardShell>
  )
}

