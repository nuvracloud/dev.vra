import type { Metadata } from "next"
import { CrmTabs } from "@/components/crm/crm-tabs"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export const metadata: Metadata = {
  title: "CRM | AI Agent Platform",
  description: "Gerenciamento de relacionamento com clientes",
}

export default function CrmPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="CRM" text="Gerencie suas conversas, contatos e leads." />
      <CrmTabs />
    </DashboardShell>
  )
}

