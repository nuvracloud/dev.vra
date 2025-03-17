import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { SettingsTabs } from "@/components/settings/settings-tabs"

export const metadata: Metadata = {
  title: "Configurações | AI Agent Platform",
  description: "Gerencie as configurações da sua conta e plataforma",
}

export default function SettingsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Configurações" text="Gerencie as configurações da sua conta e plataforma." />
      <SettingsTabs />
    </DashboardShell>
  )
}

