"use client"

import { useState } from "react"
import { Download, Search, Filter, FileText, CheckCircle2, AlertCircle, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

export function InvoiceHistory() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const { toast } = useToast()

  // Em uma aplicação real, esses dados viriam de uma API
  const invoices = [
    {
      id: "INV-001",
      date: "15/11/2023",
      amount: "R$ 99,90",
      status: "paid",
      plan: "Pro",
      billingCycle: "Mensal",
      paymentMethod: "Cartão de Crédito",
    },
    {
      id: "INV-002",
      date: "15/10/2023",
      amount: "R$ 99,90",
      status: "paid",
      plan: "Pro",
      billingCycle: "Mensal",
      paymentMethod: "Cartão de Crédito",
    },
    {
      id: "INV-003",
      date: "15/09/2023",
      amount: "R$ 99,90",
      status: "paid",
      plan: "Pro",
      billingCycle: "Mensal",
      paymentMethod: "Cartão de Crédito",
    },
    {
      id: "INV-004",
      date: "15/08/2023",
      amount: "R$ 79,90",
      status: "paid",
      plan: "Básico",
      billingCycle: "Mensal",
      paymentMethod: "PIX",
    },
    {
      id: "INV-005",
      date: "15/12/2023",
      amount: "R$ 99,90",
      status: "pending",
      plan: "Pro",
      billingCycle: "Mensal",
      paymentMethod: "Cartão de Crédito",
    },
  ]

  const filteredInvoices = invoices.filter((invoice) => {
    // Search filter
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.plan.toLowerCase().includes(searchQuery.toLowerCase())

    // Status filter
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleDownloadInvoice = (invoiceId: string) => {
    // Em uma aplicação real, isso faria o download da fatura
    toast({
      title: "Download iniciado",
      description: `A fatura ${invoiceId} está sendo baixada.`,
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Pago
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pendente
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Falhou
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Histórico de Faturas</CardTitle>
            <CardDescription>Visualize e baixe suas faturas anteriores</CardDescription>
          </div>
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar faturas..."
                className="pl-8 w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Filtrar</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filtrar por Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>Todos</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("paid")}>Pagos</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("pending")}>Pendentes</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("failed")}>Falhas</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fatura</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Plano</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Método</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <FileText className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Nenhuma fatura encontrada</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>
                    {invoice.plan} ({invoice.billingCycle})
                  </TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell>{invoice.paymentMethod}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownloadInvoice(invoice.id)}
                      disabled={invoice.status === "pending"}
                    >
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

