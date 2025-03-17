"use client"

import { MessageSquare, Users, Bot, CreditCard, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { DateRange } from "react-day-picker"

interface KpiCardsProps {
  dateRange: DateRange
}

export function KpiCards({ dateRange }: KpiCardsProps) {
  // Em uma aplicação real, esses dados viriam de uma API com base no dateRange
  const kpis = [
    {
      title: "Total de Conversas",
      value: "3,245",
      change: "+12.5%",
      trend: "up",
      icon: MessageSquare,
    },
    {
      title: "Usuários Ativos",
      value: "1,876",
      change: "+5.2%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Interações com Agentes",
      value: "12,543",
      change: "+18.7%",
      trend: "up",
      icon: Bot,
    },
    {
      title: "Receita",
      value: "R$ 24.350",
      change: "-2.5%",
      trend: "down",
      icon: CreditCard,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
            <kpi.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.value}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              {kpi.trend === "up" ? (
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
              )}
              <span className={kpi.trend === "up" ? "text-green-500" : "text-red-500"}>{kpi.change}</span>
              <span className="ml-1">em relação ao período anterior</span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

