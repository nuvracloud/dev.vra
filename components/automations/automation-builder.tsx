"use client"

import React from "react"

import { useState } from "react"
import { Search, MoreHorizontal, Play, Pause, Calendar, Clock, ArrowRight, Plus } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

// Mock data - in a real app, this would come from an API
const automations = [
  {
    id: "1",
    name: "Novo Lead para CRM",
    description: "Quando um novo lead é capturado, adiciona ao CRM e envia email de boas-vindas",
    status: "active",
    createdAt: "2023-10-15",
    lastRun: "2023-11-14T15:45:00",
    schedule: "trigger",
    runs: 245,
    errors: 2,
    modules: ["webhook", "crm", "email"],
  },
  {
    id: "2",
    name: "Sincronização de Contatos",
    description: "Sincroniza contatos entre o CRM e a plataforma de email marketing",
    status: "active",
    createdAt: "2023-09-20",
    lastRun: "2023-11-13T10:30:00",
    schedule: "daily",
    runs: 32,
    errors: 0,
    modules: ["crm", "mailchimp", "filter"],
  },
  {
    id: "3",
    name: "Alerta de Inatividade",
    description: "Envia alerta quando um cliente fica inativo por mais de 30 dias",
    status: "inactive",
    createdAt: "2023-11-01",
    lastRun: null,
    schedule: "daily",
    runs: 0,
    errors: 0,
    modules: ["database", "filter", "slack"],
  },
  {
    id: "4",
    name: "Processamento de Pagamentos",
    description: "Processa pagamentos e atualiza status de assinatura",
    status: "active",
    createdAt: "2023-08-15",
    lastRun: "2023-11-14T08:15:00",
    schedule: "trigger",
    runs: 189,
    errors: 5,
    modules: ["stripe", "database", "email"],
  },
]

export function AutomationBuilder() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [automationToDelete, setAutomationToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  const filteredAutomations = automations.filter((automation) => {
    // Search filter
    const matchesSearch =
      automation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      automation.description.toLowerCase().includes(searchQuery.toLowerCase())

    // Status filter
    const matchesStatus = statusFilter === "all" || automation.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleDeleteAutomation = () => {
    // In a real app, this would be an API call
    toast({
      title: "Automação excluída",
      description: "A automação foi excluída com sucesso.",
    })
    setShowDeleteDialog(false)
    setAutomationToDelete(null)
  }

  const handleToggleStatus = (automationId: string, currentStatus: string) => {
    // In a real app, this would be an API call
    const newStatus = currentStatus === "active" ? "inactive" : "active"
    toast({
      title: `Automação ${newStatus === "active" ? "ativada" : "desativada"}`,
      description: `O status da automação foi alterado para ${newStatus === "active" ? "ativo" : "inativo"}.`,
    })
  }

  const handleRunNow = (automationId: string) => {
    // In a real app, this would be an API call
    toast({
      title: "Automação iniciada",
      description: "A automação foi iniciada manualmente com sucesso.",
    })
  }

  const formatLastRun = (lastRun: string | null) => {
    if (!lastRun) return "Nunca executada"

    const date = new Date(lastRun)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return "Hoje às " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffDays === 1) {
      return "Ontem às " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else {
      return `${diffDays} dias atrás`
    }
  }

  const getModuleIcon = (module: string) => {
    switch (module) {
      case "webhook":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            Webhook
          </Badge>
        )
      case "crm":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
            CRM
          </Badge>
        )
      case "email":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            Email
          </Badge>
        )
      case "mailchimp":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Mailchimp
          </Badge>
        )
      case "filter":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
            Filtro
          </Badge>
        )
      case "database":
        return (
          <Badge variant="outline" className="bg-indigo-100 text-indigo-800 border-indigo-200">
            Database
          </Badge>
        )
      case "slack":
        return (
          <Badge variant="outline" className="bg-pink-100 text-pink-800 border-pink-200">
            Slack
          </Badge>
        )
      case "stripe":
        return (
          <Badge variant="outline" className="bg-teal-100 text-teal-800 border-teal-200">
            Stripe
          </Badge>
        )
      default:
        return <Badge variant="outline">{module}</Badge>
    }
  }

  return (
    <>
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar automações..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="inactive">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Link href="/automations/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Automação
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAutomations.length === 0 ? (
          <div className="col-span-full flex h-[300px] items-center justify-center rounded-md border border-dashed">
            <div className="text-center">
              <h3 className="text-lg font-medium">Nenhuma automação encontrada</h3>
              <p className="text-sm text-muted-foreground">Tente ajustar seus filtros ou criar uma nova automação.</p>
              <Link href="/automations/new">
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Automação
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          filteredAutomations.map((automation) => (
            <Card key={automation.id} className={automation.status === "inactive" ? "opacity-70" : ""}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{automation.name}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Mais opções</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/automations/${automation.id}`}>Editar</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRunNow(automation.id)}>Executar agora</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleStatus(automation.id, automation.status)}>
                        {automation.status === "active" ? "Desativar" : "Ativar"}
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/automations/${automation.id}/history`}>Ver histórico</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => {
                          setAutomationToDelete(automation.id)
                          setShowDeleteDialog(true)
                        }}
                      >
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription>{automation.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  {automation.modules.map((module, index) => (
                    <React.Fragment key={module}>
                      {getModuleIcon(module)}
                      {index < automation.modules.length - 1 && (
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{automation.schedule === "trigger" ? "Baseado em evento" : `Diariamente`}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Última execução: {formatLastRun(automation.lastRun)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  {automation.runs} execuções • {automation.errors} erros
                </div>
                <Button
                  variant={automation.status === "active" ? "destructive" : "default"}
                  size="sm"
                  onClick={() => handleToggleStatus(automation.id, automation.status)}
                >
                  {automation.status === "active" ? (
                    <>
                      <Pause className="mr-2 h-4 w-4" />
                      Pausar
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Ativar
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Automação</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta automação? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteAutomation}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

