"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import type { DateRange } from "react-day-picker"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ConversationsTrendProps {
  dateRange: DateRange
}

export function ConversationsTrend({ dateRange }: ConversationsTrendProps) {
  // Em uma aplicação real, esses dados viriam de uma API com base no dateRange
  const trendData = [
    { name: "Seg", conversas: 400, resolvidas: 380 },
    { name: "Ter", conversas: 300, resolvidas: 290 },
    { name: "Qua", conversas: 500, resolvidas: 470 },
    { name: "Qui", conversas: 450, resolvidas: 420 },
    { name: "Sex", conversas: 600, resolvidas: 550 },
    { name: "Sáb", conversas: 350, resolvidas: 320 },
    { name: "Dom", conversas: 200, resolvidas: 190 },
  ]

  const channelData = [
    { name: "WhatsApp", value: 45 },
    { name: "Website", value: 30 },
    { name: "Email", value: 15 },
    { name: "Telefone", value: 10 },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Tendência de Conversas</CardTitle>
          <CardDescription>Volume de conversas e taxa de resolução ao longo do tempo.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={trendData}
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
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="conversas" stroke="#8884d8" name="Total de Conversas" />
                <Line type="monotone" dataKey="resolvidas" stroke="#82ca9d" name="Conversas Resolvidas" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conversas por Canal</CardTitle>
          <CardDescription>Distribuição de conversas por canal de comunicação.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

