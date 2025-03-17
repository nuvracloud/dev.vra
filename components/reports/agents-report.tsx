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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
} from "recharts"
import { Download, Filter, Bot, Clock, ThumbsUp, MessageSquare } from "lucide-react"

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

export function AgentsReport() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  })
  const { toast } = useToast()

  // Em uma aplicação real, esses dados viriam de uma API com base no dateRange
  const agentsData = [
    { name: "Assistente de Vendas", conversas: 120, satisfacao: 4.8, resolucao: 92, tempoResposta: 45 },
    { name: "Suporte Técnico", conversas: 85, satisfacao: 4.5, resolucao: 88, tempoResposta: 60 },
    { name: "Assistente de RH", conversas: 45, satisfacao: 4.7, resolucao: 95, tempoResposta: 30 },
    { name: "Atendimento", conversas: 150, satisfacao: 4.2, resolucao: 85, tempoResposta: 75 },
  ]

  const metricsData = [
    { subject: "Tempo de Resposta", A: 90, B: 85, C: 95, D: 75, fullMark: 100 },
    { subject: "Satisfação", A: 96, B: 90, C: 94, D: 84, fullMark: 100 },
    { subject: "Taxa de Resolução", A: 92, B: 88, C: 95, D: 85, fullMark: 100 },
    { subject: "Precisão", A: 88, B: 92, C: 90, D: 82, fullMark: 100 },
    { subject: "Eficiência", A: 94, B: 87, C: 91, D: 80, fullMark: 100 },
  ]

  const trendData = [
    { name: "Semana 1", vendas: 85, suporte: 90, rh: 92, atendimento: 78 },
    { name: "Semana 2", vendas: 88, suporte: 87, rh: 95, atendimento: 80 },
    { name: "Semana 3", vendas: 92, suporte: 89, rh: 93, atendimento: 82 },
    { name: "Semana 4", vendas: 90, suporte: 92, rh: 94, atendimento: 85 },
  ]

  const agentDetailsData = [
    {
      id: "1",
      nome: "Assistente de Vendas",
      tipo: "IA",
      conversas: 120,
      satisfacao: 4.8,
      resolucao: "92%",
      tempoResposta: "45s",
      status: "Ativo",
    },
    {
      id: "2",
      nome: "Suporte Técnico",
      tipo: "IA",
      conversas: 85,
      satisfacao: 4.5,
      resolucao: "88%",
      tempoResposta: "60s",
      status: "Ativo",
    },
    {
      id: "3",
      nome: "Assistente de RH",
      tipo: "IA",
      conversas: 45,
      satisfacao: 4.7,
      resolucao: "95%",
      tempoResposta: "30s",
      status: "Ativo",
    },
    {
      id: "4",
      nome: "Atendimento",
      tipo: "Humano",
      conversas: 150,
      satisfacao: 4.2,
      resolucao: "85%",
      tempoResposta: "75s",
      status: "Ativo",
    },
    {
      id: "5",
      nome: "Assistente Financeiro",
      tipo: "IA",
      conversas: 0,
      satisfacao: 0,
      resolucao: "0%",
      tempoResposta: "0s",
      status: "Inativo",
    },
  ]

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
              <DropdownMenuItem>Tipo de Agente</DropdownMenuItem>
              <DropdownMenuItem>Status</DropdownMenuItem>
              <DropdownMenuItem>Desempenho</DropdownMenuItem>
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
            <CardTitle className="text-sm font-medium">Total de Agentes</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground mt-1">+1 em relação ao período anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio de Resposta</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">52s</div>
            <p className="text-xs text-muted-foreground mt-1">-8s em relação ao período anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfação Média</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.6/5.0</div>
            <p className="text-xs text-muted-foreground mt-1">+0.2 em relação ao período anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Conversas</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">400</div>
            <p className="text-xs text-muted-foreground mt-1">+15% em relação ao período anterior</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="performance">Desempenho</TabsTrigger>
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
          <TabsTrigger value="details">Detalhes</TabsTrigger>
        </TabsList>
        <TabsContent value="performance" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Volume de Conversas por Agente</CardTitle>
              <CardDescription>Número total de conversas gerenciadas por cada agente.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
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
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Satisfação do Cliente</CardTitle>
                <CardDescription>Nível de satisfação do cliente por agente.</CardDescription>
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
                      <XAxis type="number" domain={[0, 5]} />
                      <YAxis dataKey="name" type="category" width={150} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="satisfacao" fill="#82ca9d" name="Satisfação (0-5)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Tempo de Resposta</CardTitle>
                <CardDescription>Tempo médio de resposta por agente (em segundos).</CardDescription>
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
                      <Bar dataKey="tempoResposta" fill="#ffc658" name="Tempo (segundos)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="metrics" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Métricas de Desempenho</CardTitle>
              <CardDescription>Comparativo de métricas de desempenho entre agentes.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
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
          <Card>
            <CardHeader>
              <CardTitle>Tendência de Desempenho</CardTitle>
              <CardDescription>Evolução do desempenho dos agentes ao longo do tempo.</CardDescription>
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
                    <YAxis domain={[70, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="vendas" name="Assistente de Vendas" stroke="#8884d8" />
                    <Line type="monotone" dataKey="suporte" name="Suporte Técnico" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="rh" name="Assistente de RH" stroke="#ffc658" />
                    <Line type="monotone" dataKey="atendimento" name="Atendimento" stroke="#ff8042" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="details" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Detalhes dos Agentes</CardTitle>
              <CardDescription>Lista detalhada de todos os agentes e suas métricas.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Conversas</TableHead>
                    <TableHead>Satisfação</TableHead>
                    <TableHead>Taxa de Resolução</TableHead>
                    <TableHead>Tempo de Resposta</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agentDetailsData.map((agent) => (
                    <TableRow key={agent.id}>
                      <TableCell>{agent.id}</TableCell>
                      <TableCell>{agent.nome}</TableCell>
                      <TableCell>{agent.tipo}</TableCell>
                      <TableCell>{agent.conversas}</TableCell>
                      <TableCell>{agent.satisfacao ? `${agent.satisfacao}/5` : "N/A"}</TableCell>
                      <TableCell>{agent.resolucao}</TableCell>
                      <TableCell>{agent.tempoResposta}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            agent.status === "Ativo" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {agent.status}
                        </span>
                      </TableCell>
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

