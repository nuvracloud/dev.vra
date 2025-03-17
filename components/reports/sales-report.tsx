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
  PieChart,
  Pie,
  Cell,
  FunnelChart,
  Funnel,
  LabelList,
} from "recharts"
import { Download, Filter, CreditCard, TrendingUp, Users, ShoppingCart } from "lucide-react"

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

export function SalesReport() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  })
  const { toast } = useToast()

  // Em uma aplicação real, esses dados viriam de uma API com base no dateRange
  const revenueData = [
    { name: "Jan", value: 12000 },
    { name: "Fev", value: 15000 },
    { name: "Mar", value: 18000 },
    { name: "Abr", value: 16000 },
    { name: "Mai", value: 21000 },
    { name: "Jun", value: 19000 },
  ]

  const funnelData = [
    { name: "Visitantes", value: 5000, fill: "#8884d8" },
    { name: "Leads", value: 2500, fill: "#83a6ed" },
    { name: "Oportunidades", value: 1250, fill: "#8dd1e1" },
    { name: "Propostas", value: 600, fill: "#82ca9d" },
    { name: "Vendas", value: 300, fill: "#a4de6c" },
  ]

  const productData = [
    { name: "Plano Básico", value: 40 },
    { name: "Plano Pro", value: 30 },
    { name: "Plano Enterprise", value: 20 },
    { name: "Serviços Adicionais", value: 10 },
  ]

  const salesData = [
    {
      id: "1",
      cliente: "Acme Inc.",
      produto: "Plano Enterprise",
      valor: "R$ 5.990,00",
      data: "15/11/2023",
      status: "Pago",
      origem: "Website",
    },
    {
      id: "2",
      cliente: "Tech Solutions",
      produto: "Plano Pro",
      valor: "R$ 1.990,00",
      data: "14/11/2023",
      status: "Pago",
      origem: "Indicação",
    },
    {
      id: "3",
      cliente: "Startup X",
      produto: "Plano Básico",
      valor: "R$ 990,00",
      data: "14/11/2023",
      status: "Pendente",
      origem: "Google Ads",
    },
    {
      id: "4",
      cliente: "Consultoria Y",
      produto: "Plano Pro",
      valor: "R$ 1.990,00",
      data: "13/11/2023",
      status: "Pago",
      origem: "LinkedIn",
    },
    {
      id: "5",
      cliente: "Empresa Z",
      produto: "Serviços Adicionais",
      valor: "R$ 2.500,00",
      data: "12/11/2023",
      status: "Pago",
      origem: "Email Marketing",
    },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

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
              <DropdownMenuItem>Produto</DropdownMenuItem>
              <DropdownMenuItem>Status</DropdownMenuItem>
              <DropdownMenuItem>Origem</DropdownMenuItem>
              <DropdownMenuItem>Cliente</DropdownMenuItem>
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
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 24.350,00</div>
            <p className="text-xs text-muted-foreground mt-1">+15% em relação ao período anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 1.950,00</div>
            <p className="text-xs text-muted-foreground mt-1">+5% em relação ao período anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6%</div>
            <p className="text-xs text-muted-foreground mt-1">+1.5% em relação ao período anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novos Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">+3 em relação ao período anterior</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="revenue">Receita</TabsTrigger>
          <TabsTrigger value="funnel">Funil de Vendas</TabsTrigger>
          <TabsTrigger value="details">Detalhes</TabsTrigger>
        </TabsList>
        <TabsContent value="revenue" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Receita Mensal</CardTitle>
              <CardDescription>Evolução da receita ao longo dos meses.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
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
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Produto</CardTitle>
              <CardDescription>Distribuição da receita por produto ou plano.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={productData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {productData.map((entry, index) => (
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
        </TabsContent>
        <TabsContent value="funnel" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Funil de Vendas</CardTitle>
              <CardDescription>Conversão em cada etapa do funil de vendas.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
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
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Taxa de Conversão</CardTitle>
                <CardDescription>Taxa de conversão entre as etapas do funil.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Visitantes para Leads</span>
                      <span className="text-sm font-medium">50%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "50%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Leads para Oportunidades</span>
                      <span className="text-sm font-medium">50%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "50%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Oportunidades para Propostas</span>
                      <span className="text-sm font-medium">48%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-yellow-600 h-2.5 rounded-full" style={{ width: "48%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Propostas para Vendas</span>
                      <span className="text-sm font-medium">50%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: "50%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Origem das Vendas</CardTitle>
                <CardDescription>Distribuição das vendas por canal de origem.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Website", value: 40 },
                          { name: "Google Ads", value: 25 },
                          { name: "Indicação", value: 15 },
                          { name: "LinkedIn", value: 10 },
                          { name: "Email Marketing", value: 10 },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {productData.map((entry, index) => (
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
              <CardTitle>Detalhes das Vendas</CardTitle>
              <CardDescription>Lista detalhada de todas as vendas no período selecionado.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Origem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesData.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>{sale.id}</TableCell>
                      <TableCell>{sale.cliente}</TableCell>
                      <TableCell>{sale.produto}</TableCell>
                      <TableCell>{sale.valor}</TableCell>
                      <TableCell>{sale.data}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            sale.status === "Pago" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {sale.status}
                        </span>
                      </TableCell>
                      <TableCell>{sale.origem}</TableCell>
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

