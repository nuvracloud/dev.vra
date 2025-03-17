"use client"

import { useState } from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
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
import { Download, Filter, MessageSquare, Clock, ThumbsUp, Users } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { DateRangePicker } from "@/components/reports/date-range-picker"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

export function ConversationsReport() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  })
  const { toast } = useToast()

  // Em uma aplicação real, esses dados viriam de uma API com base no dateRange
  const trendData = [
    { name: "Seg", conversas: 400, resolvidas: 380, satisfacao: 4.8 },
    { name: "Ter", conversas: 300, resolvidas: 290, satisfacao: 4.7 },
    { name: "Qua", conversas: 500, resolvidas: 470, satisfacao: 4.5 },
    { name: "Qui", conversas: 450, resolvidas: 420, satisfacao: 4.6 },
    { name: "Sex", conversas: 600, resolvidas: 550, satisfacao: 4.4 },
    { name: "Sáb", conversas: 350, resolvidas: 320, satisfacao: 4.9 },
    { name: "Dom", conversas: 200, resolvidas: 190, satisfacao: 4.7 },
  ]

  const channelData = [
    { name: "WhatsApp", value: 45 },
    { name: "Website", value: 30 },
    { name: "Email", value: 15 },
    { name: "Telefone", value: 10 },
  ]

  const topicsData = [
    { name: "Dúvidas sobre produtos", value: 35 },
    { name: "Suporte técnico", value: 25 },
    { name: "Reclamações", value: 20 },
    { name: "Informações de conta", value: 15 },
    { name: "Outros", value: 5 },
  ]

  const conversationsData = [
    {
      id: "1",
      cliente: "João Silva",
      canal: "WhatsApp",
      assunto: "Dúvida sobre produto",
      data: "15/11/2023",
      duracao: "5m 23s",
      status: "Resolvida",
      satisfacao: 5,
    },
    {
      id: "2",
      cliente: "Maria Oliveira",
      canal: "Email",
      assunto: "Problema técnico",
      data: "14/11/2023",
      duracao: "12m 05s",
      status: "Resolvida",
      satisfacao: 4,
    },
    {
      id: "3",
      cliente: "Pedro Santos",
      canal: "Website",
      assunto: "Reclamação",
      data: "14/11/2023",
      duracao: "8m 47s",
      status: "Pendente",
      satisfacao: null,
    },
    {
      id: "4",
      cliente: "Ana Costa",
      canal: "WhatsApp",
      assunto: "Informações de conta",
      data: "13/11/2023",
      duracao: "3m 12s",
      status: "Resolvida",
      satisfacao: 5,
    },
    {
      id: "5",
      cliente: "Carlos Mendes",
      canal: "Website",
      assunto: "Dúvida sobre produto",
      data: "12/11/2023",
      duracao: "6m 38s",
      status: "Resolvida",
      satisfacao: 3,
    },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  const handleExport = (format: string) => {
    toast({
      title: "Exportando relatório",
      description: `O relatório está sendo exportado em formato ${format.toUpperCase()}.`,
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
                <Filter className="mr-2 h-4 w-4" />
                Filtros
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Canal</DropdownMenuItem>
              <DropdownMenuItem>Status</DropdownMenuItem>
              <DropdownMenuItem>Agente</DropdownMenuItem>
              <DropdownMenuItem>Assunto</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Formato</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleExport("pdf")}>PDF</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("excel")}>Excel</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("csv")}>CSV</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Conversas</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,245</div>
            <p className="text-xs text-muted-foreground mt-1">+12.5% em relação ao período anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio de Resposta</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2m 15s</div>
            <p className="text-xs text-muted-foreground mt-1">-18.3% em relação ao período anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfação do Cliente</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.7/5.0</div>
            <p className="text-xs text-muted-foreground mt-1">+0.2 em relação ao período anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Resolução</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92.5%</div>
            <p className="text-xs text-muted-foreground mt-1">+3.8% em relação ao período anterior</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="channels">Canais e Tópicos</TabsTrigger>
          <TabsTrigger value="details">Detalhes</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Tendência de Conversas</CardTitle>
              <CardDescription>Volume de conversas e taxa de resolução ao longo do tempo.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
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
              <CardTitle>Satisfação do Cliente</CardTitle>
              <CardDescription>Nível de satisfação do cliente ao longo do tempo.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
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
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="satisfacao" name="Satisfação (0-5)" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="channels" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2">
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
            <Card>
              <CardHeader>
                <CardTitle>Tópicos de Conversas</CardTitle>
                <CardDescription>Distribuição de conversas por tópico ou assunto.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={topicsData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {topicsData.map((entry, index) => (
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
        </TabsContent>
        <TabsContent value="details" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Detalhes das Conversas</CardTitle>
              <CardDescription>Lista detalhada de todas as conversas no período selecionado.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Canal</TableHead>
                    <TableHead>Assunto</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Duração</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Satisfação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {conversationsData.map((conversation) => (
                    <TableRow key={conversation.id}>
                      <TableCell>{conversation.id}</TableCell>
                      <TableCell>{conversation.cliente}</TableCell>
                      <TableCell>{conversation.canal}</TableCell>
                      <TableCell>{conversation.assunto}</TableCell>
                      <TableCell>{conversation.data}</TableCell>
                      <TableCell>{conversation.duracao}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            conversation.status === "Resolvida"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {conversation.status}
                        </span>
                      </TableCell>
                      <TableCell>{conversation.satisfacao ? `${conversation.satisfacao}/5` : "N/A"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

