"use client"

import { useState } from "react"
import { Search, MoreHorizontal, Bot, Trash2, Edit, Copy, MessageSquare } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
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
const agents = [
  {
    id: "1",
    name: "Assistente de Vendas",
    description: "Agente especializado em responder dúvidas sobre produtos e auxiliar no processo de vendas.",
    model: "gpt-4",
    status: "active",
    createdAt: "2023-10-15",
    lastModified: "2023-11-02",
    messageCount: 1245,
    avatar: "/placeholder.svg?height=80&width=80",
    workspace: "Meu Workspace",
  },
  {
    id: "2",
    name: "Suporte Técnico",
    description: "Agente para resolver problemas técnicos e fornecer suporte aos usuários.",
    model: "gpt-3.5-turbo",
    status: "active",
    createdAt: "2023-09-20",
    lastModified: "2023-10-25",
    messageCount: 3782,
    avatar: "/placeholder.svg?height=80&width=80",
    workspace: "Meu Workspace",
  },
  {
    id: "3",
    name: "Assistente de RH",
    description: "Agente para responder dúvidas sobre políticas de RH, benefícios e processos internos.",
    model: "gpt-4",
    status: "inactive",
    createdAt: "2023-11-01",
    lastModified: "2023-11-01",
    messageCount: 156,
    avatar: "/placeholder.svg?height=80&width=80",
    workspace: "Acme Inc.",
  },
]

export function AgentsList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [workspaceFilter, setWorkspaceFilter] = useState("all")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [agentToDelete, setAgentToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  const filteredAgents = agents.filter((agent) => {
    // Search filter
    const matchesSearch =
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase())

    // Status filter
    const matchesStatus = statusFilter === "all" || agent.status === statusFilter

    // Workspace filter
    const matchesWorkspace = workspaceFilter === "all" || agent.workspace === workspaceFilter

    return matchesSearch && matchesStatus && matchesWorkspace
  })

  const handleDeleteAgent = () => {
    // In a real app, this would be an API call
    toast({
      title: "Agente excluído",
      description: "O agente foi excluído com sucesso.",
    })
    setShowDeleteDialog(false)
    setAgentToDelete(null)
  }

  const handleToggleStatus = (agentId: string, currentStatus: string) => {
    // In a real app, this would be an API call
    const newStatus = currentStatus === "active" ? "inactive" : "active"
    toast({
      title: `Agente ${newStatus === "active" ? "ativado" : "desativado"}`,
      description: `O status do agente foi alterado para ${newStatus === "active" ? "ativo" : "inativo"}.`,
    })
  }

  const handleDuplicateAgent = (agentId: string) => {
    // In a real app, this would be an API call
    toast({
      title: "Agente duplicado",
      description: "Uma cópia do agente foi criada com sucesso.",
    })
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Seus Agentes</CardTitle>
          <CardDescription>
            Gerencie seus agentes de IA. Você está utilizando 2 de 3 agentes disponíveis no seu plano.
          </CardDescription>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar agentes..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
            <Select value={workspaceFilter} onValueChange={setWorkspaceFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Workspace" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os workspaces</SelectItem>
                <SelectItem value="Meu Workspace">Meu Workspace</SelectItem>
                <SelectItem value="Acme Inc.">Acme Inc.</SelectItem>
                <SelectItem value="Startup X">Startup X</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAgents.length === 0 ? (
              <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
                <div className="text-center">
                  <h3 className="text-lg font-medium">Nenhum agente encontrado</h3>
                  <p className="text-sm text-muted-foreground">Tente ajustar seus filtros ou criar um novo agente.</p>
                  <Link href="/agents/new">
                    <Button className="mt-4">
                      <Bot className="mr-2 h-4 w-4" />
                      Criar Agente
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredAgents.map((agent) => (
                  <Card key={agent.id} className="overflow-hidden">
                    <div className={`h-2 w-full ${agent.status === "active" ? "bg-green-500" : "bg-gray-300"}`} />
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-2">
                          <div className="relative">
                            <img
                              src={agent.avatar || "/placeholder.svg"}
                              alt={agent.name}
                              className="h-10 w-10 rounded-full"
                            />
                            <div
                              className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${agent.status === "active" ? "bg-green-500" : "bg-gray-300"}`}
                            />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{agent.name}</CardTitle>
                            <p className="text-xs text-muted-foreground">{agent.model}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={agent.status === "active"}
                            onCheckedChange={() => handleToggleStatus(agent.id, agent.status)}
                          />
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
                                <Link href={`/agents/${agent.id}`}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDuplicateAgent(agent.id)}>
                                <Copy className="mr-2 h-4 w-4" />
                                Duplicar
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/agents/${agent.id}/chat`}>
                                  <MessageSquare className="mr-2 h-4 w-4" />
                                  Conversar
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => {
                                  setAgentToDelete(agent.id)
                                  setShowDeleteDialog(true)
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{agent.description}</p>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <div>
                          <p>Criado em: {agent.createdAt}</p>
                          <p>Última modificação: {agent.lastModified}</p>
                        </div>
                        <div className="text-right">
                          <p>Mensagens: {agent.messageCount}</p>
                          <p>Workspace: {agent.workspace}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Agente</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este agente? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteAgent}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

