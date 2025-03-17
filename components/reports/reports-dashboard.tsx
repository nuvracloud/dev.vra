"use client"

import { useState } from "react"
import Link from "next/link"
import {
  BarChart3,
  MessageSquare,
  Bot,
  CreditCard,
  Users,
  TrendingUp,
  Calendar,
  Download,
  FileText,
  Share2,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DateRangePicker } from "@/components/reports/date-range-picker"
import { KpiCards } from "@/components/reports/kpi-cards"
import { OverviewChart } from "@/components/reports/overview-chart"
import { ConversationsTrend } from "@/components/reports/conversations-trend"
import { AgentsPerformance } from "@/components/reports/agents-performance"
import { SalesFunnel } from "@/components/reports/sales-funnel"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

export function ReportsDashboard() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  })
  const { toast } = useToast()

  const handleExport = (format: string) => {
    toast({
      title: "Exportando relatório",
      description: `O relatório está sendo exportado em formato ${format.toUpperCase()}.`,
    })
  }

  const handleShare = () => {
    toast({
      title: "Compartilhando relatório",
      description: "O link para compartilhamento foi copiado para a área de transferência.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Formato</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleExport("pdf")}>
                <FileText className="mr-2 h-4 w-4" />
                PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("excel")}>
                <FileText className="mr-2 h-4 w-4" />
                Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("csv")}>
                <FileText className="mr-2 h-4 w-4" />
                CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Compartilhar
          </Button>
        </div>
      </div>

      <KpiCards dateRange={dateRange} />

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="conversations">Conversas</TabsTrigger>
          <TabsTrigger value="agents">Agentes</TabsTrigger>
          <TabsTrigger value="sales">Vendas</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4 pt-4">
          <OverviewChart dateRange={dateRange} />
        </TabsContent>
        <TabsContent value="conversations" className="space-y-4 pt-4">
          <ConversationsTrend dateRange={dateRange} />
          <div className="flex justify-end">
            <Link href="/reports/conversations">
              <Button variant="outline">Ver relatório completo</Button>
            </Link>
          </div>
        </TabsContent>
        <TabsContent value="agents" className="space-y-4 pt-4">
          <AgentsPerformance dateRange={dateRange} />
          <div className="flex justify-end">
            <Link href="/reports/agents">
              <Button variant="outline">Ver relatório completo</Button>
            </Link>
          </div>
        </TabsContent>
        <TabsContent value="sales" className="space-y-4 pt-4">
          <SalesFunnel dateRange={dateRange} />
          <div className="flex justify-end">
            <Link href="/reports/sales">
              <Button variant="outline">Ver relatório completo</Button>
            </Link>
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Relatórios Populares</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link href="/reports/conversations" className="block">
                <Button variant="ghost" className="w-full justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Análise de Conversas
                </Button>
              </Link>
              <Link href="/reports/agents" className="block">
                <Button variant="ghost" className="w-full justify-start">
                  <Bot className="mr-2 h-4 w-4" />
                  Desempenho de Agentes
                </Button>
              </Link>
              <Link href="/reports/sales" className="block">
                <Button variant="ghost" className="w-full justify-start">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Relatório de Vendas
                </Button>
              </Link>
              <Link href="/reports/users" className="block">
                <Button variant="ghost" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Análise de Usuários
                </Button>
              </Link>
              <Link href="/reports/trends" className="block">
                <Button variant="ghost" className="w-full justify-start">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Tendências e Previsões
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Relatórios Agendados</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium">Relatório Semanal de Desempenho</h3>
                    <p className="text-xs text-muted-foreground">Toda segunda-feira às 08:00</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Editar
                  </Button>
                </div>
              </div>
              <div className="border-b pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium">Resumo Mensal de Vendas</h3>
                    <p className="text-xs text-muted-foreground">Primeiro dia do mês às 09:00</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Editar
                  </Button>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <Calendar className="mr-2 h-4 w-4" />
                Agendar Novo Relatório
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Relatórios Personalizados</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium">Análise de Conversão por Canal</h3>
                    <p className="text-xs text-muted-foreground">Criado em 15/10/2023</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Ver
                  </Button>
                </div>
              </div>
              <div className="border-b pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium">Desempenho por Segmento</h3>
                    <p className="text-xs text-muted-foreground">Criado em 05/11/2023</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Ver
                  </Button>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <BarChart3 className="mr-2 h-4 w-4" />
                Criar Relatório Personalizado
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

