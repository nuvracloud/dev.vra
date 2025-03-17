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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import type { DateRange } from "react-day-picker"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface AgentsPerformanceProps {
  dateRange: DateRange
}

export function AgentsPerformance({ dateRange }: AgentsPerformanceProps) {
  // Em uma aplicação real, esses dados viriam de uma API com base no dateRange
  const agentsData = [
    { name: "Assistente de Vendas", conversas: 120, satisfacao: 4.8, resolucao: 92 },
    { name: "Suporte Técnico", conversas: 85, satisfacao: 4.5, resolucao: 88 },
    { name: "Assistente de RH", conversas: 45, satisfacao: 4.7, resolucao: 95 },
    { name: "Atendimento", conversas: 150, satisfacao: 4.2, resolucao: 85 },
  ]

  const metricsData = [
    { subject: "Tempo de Resposta", A: 90, B: 85, C: 95, D: 75, fullMark: 100 },
    { subject: "Satisfação", A: 96, B: 90, C: 94, D: 84, fullMark: 100 },
    { subject: "Taxa de Resolução", A: 92, B: 88, C: 95, D: 85, fullMark: 100 },
    { subject: "Precisão", A: 88, B: 92, C: 90, D: 82, fullMark: 100 },
    { subject: "Eficiência", A: 94, B: 87, C: 91, D: 80, fullMark: 100 },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Volume de Conversas por Agente</CardTitle>
          <CardDescription>Número total de conversas gerenciadas por cada agente.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={agentsData}
                layout="vertical"
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip />
                <Legend />
                <Bar dataKey="conversas" fill="#8884d8" name="Conversas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Métricas de Desempenho</CardTitle>
          <CardDescription>Comparativo de métricas de desempenho entre agentes.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={metricsData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Assistente de Vendas" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Radar name="Suporte Técnico" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                <Radar name="Assistente de RH" dataKey="C" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                <Radar name="Atendimento" dataKey="D" stroke="#ff8042" fill="#ff8042" fillOpacity={0.6} />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

