"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  LabelList,
} from "recharts"
import type { DateRange } from "react-day-picker"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface SalesFunnelProps {
  dateRange: DateRange
}

export function SalesFunnel({ dateRange }: SalesFunnelProps) {
  // Em uma aplicação real, esses dados viriam de uma API com base no dateRange
  const funnelData = [
    { name: "Visitantes", value: 5000, fill: "#8884d8" },
    { name: "Leads", value: 2500, fill: "#83a6ed" },
    { name: "Oportunidades", value: 1250, fill: "#8dd1e1" },
    { name: "Propostas", value: 600, fill: "#82ca9d" },
    { name: "Vendas", value: 300, fill: "#a4de6c" },
  ]

  const revenueData = [
    { name: "Jan", value: 12000 },
    { name: "Fev", value: 15000 },
    { name: "Mar", value: 18000 },
    { name: "Abr", value: 16000 },
    { name: "Mai", value: 21000 },
    { name: "Jun", value: 19000 },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Funil de Vendas</CardTitle>
          <CardDescription>Conversão em cada etapa do funil de vendas.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
                <Tooltip />
                <Funnel dataKey="value" data={funnelData} isAnimationActive>
                  <LabelList position="right" fill="#000" stroke="none" dataKey="name" />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Receita Mensal</CardTitle>
          <CardDescription>Evolução da receita ao longo dos meses.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `R$ ${value}`} />
                <Legend />
                <Bar dataKey="value" name="Receita (R$)" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

