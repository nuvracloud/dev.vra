import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { SalesReport } from "@/components/reports/sales-report"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Relatório de Vendas | AI Agent Platform",
  description: "Análise de vendas, conversões e receita",
}

export default function SalesReportPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Relatório de Vendas" text="Análise de vendas, conversões e receita.">
        <Link href="/reports">
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>
      </DashboardHeader>
      <SalesReport />
    </DashboardShell>
  )
}

