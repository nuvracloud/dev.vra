import type { Metadata } from "next"
import { WorkspacesList } from "@/components/workspaces/workspaces-list"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export const metadata: Metadata = {
  title: "Workspaces | AI Agent Platform",
  description: "Gerencie seus workspaces na plataforma de agentes de IA",
}

export default function WorkspacesPage() {
  return (
    <DashboardShell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workspaces</h1>
          <p className="text-muted-foreground">Gerencie seus workspaces e colaboradores</p>
        </div>
      </div>
      <WorkspacesList />
    </DashboardShell>
  )
}

