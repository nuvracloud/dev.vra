"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import type { DateRange } from "react-day-picker"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface OverviewChartProps {
  dateRange: DateRange
}

export function OverviewChart({ dateRange }: OverviewChartProps) {
  const [chartType, setChartType] = useState("bar")

  // Em uma aplicação real, esses dados viriam de uma API com base no dateRange
  const data = [
    {
      name: "Jan",
      conversas: 4000,
      usuarios: 2400,
      receita: 2400,
    },
    {
      name: "Fev",
      conversas: 3000,
      usuarios: 1398,
      receita: 2210,
    },
    {
      name: "Mar",
      conversas: 2000,
      usuarios: 9800,
      receita: 2290,
    },
    {
      name: "Abr",
      conversas: 2780,
      usuarios: 3908,
      receita: 2000,
    },
    {
      name: "Mai",
      conversas: 1890,
      usuarios: 4800,
      receita: 2181,
    },
    {
      name: "Jun",
      conversas: 2390,
      usuarios: 3800,
      receita: 2500,
    },
    {
      name: "Jul",
      conversas: 3490,
      usuarios: 4300,
      receita: 2100,
    },
    {
      name: "Ago",
      conversas: 3490,
      usuarios: 4300,
      receita: 2100,
    },
    {
      name: "Set",
      conversas: 3490,
      usuarios: 4300,
      receita: 2100,
    },
    {
      name: "Out",
      conversas: 3490,
      usuarios: 4300,
      receita: 2100,
    },
    {
      name: "Nov",
      conversas: 3490,
      usuarios: 4300,
      receita: 2100,
    },
    {
      name: "Dez",
      conversas: 3490,
      usuarios: 4300,
      receita: 2100,
    },
  ]

  return (
    <Card className="col-span-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Visão Geral</CardTitle>
            <CardDescription>Comparativo de métricas principais ao longo do tempo.</CardDescription>
          </div>
          <Tabs value={chartType} onValueChange={setChartType}>
            <TabsList>
              <TabsTrigger value="bar">Barras</TabsTrigger>
              <TabsTrigger value="line">Linhas</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "bar" ? (
              <BarChart
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="conversas" fill="#8884d8" name="Conversas" />
                <Bar dataKey="usuarios" fill="#82ca9d" name="Usuários" />
                <Bar dataKey="receita" fill="#ffc658" name="Receita (R$)" />
              </BarChart>
            ) : (
              <LineChart
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="conversas" stroke="#8884d8" name="Conversas" />
                <Line type="monotone" dataKey="usuarios" stroke="#82ca9d" name="Usuários" />
                <Line type="monotone" dataKey="receita" stroke="#ffc658" name="Receita (R$)" />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

