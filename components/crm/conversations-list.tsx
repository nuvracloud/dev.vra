"use client"

import { useState } from "react"
import { MoreHorizontal, Search, User } from "lucide-react"

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
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data - in a real app, this would come from an API
const conversations = [
  {
    id: "1",
    contact: {
      name: "João Silva",
      email: "joao@exemplo.com",
      avatar: "/placeholder.svg",
    },
    lastMessage: "Olá, gostaria de saber mais sobre os planos de assinatura.",
    timestamp: "10:23",
    unread: true,
    priority: "high",
    assignedTo: "Maria",
    tags: ["lead", "pricing"],
    status: "open",
  },
  {
    id: "2",
    contact: {
      name: "Ana Souza",
      email: "ana@exemplo.com",
      avatar: "/placeholder.svg",
    },
    lastMessage: "Obrigado pelo suporte, resolveu meu problema!",
    timestamp: "Ontem",
    unread: false,
    priority: "normal",
    assignedTo: "Carlos",
    tags: ["support", "resolved"],
    status: "closed",
  },
  {
    id: "3",
    contact: {
      name: "Pedro Oliveira",
      email: "pedro@exemplo.com",
      avatar: "/placeholder.svg",
    },
    lastMessage: "Quando vocês vão lançar a nova funcionalidade?",
    timestamp: "Ontem",
    unread: true,
    priority: "normal",
    assignedTo: null,
    tags: ["feature-request"],
    status: "open",
  },
  {
    id: "4",
    contact: {
      name: "Carla Mendes",
      email: "carla@exemplo.com",
      avatar: "/placeholder.svg",
    },
    lastMessage: "Estou com problemas para configurar o agente de IA.",
    timestamp: "Seg",
    unread: false,
    priority: "high",
    assignedTo: "Maria",
    tags: ["support", "technical"],
    status: "in-progress",
  },
]

export function ConversationsList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [assigneeFilter, setAssigneeFilter] = useState("all")

  const filteredConversations = conversations.filter((conversation) => {
    // Search filter
    const matchesSearch =
      conversation.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    // Status filter
    const matchesStatus = statusFilter === "all" || conversation.status === statusFilter

    // Priority filter
    const matchesPriority = priorityFilter === "all" || conversation.priority === priorityFilter

    // Assignee filter
    const matchesAssignee =
      assigneeFilter === "all" ||
      (assigneeFilter === "unassigned" && !conversation.assignedTo) ||
      conversation.assignedTo === assigneeFilter

    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversas</CardTitle>
        <CardDescription>Gerencie suas conversas com clientes e leads.</CardDescription>
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar conversas..."
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
              <SelectItem value="open">Aberto</SelectItem>
              <SelectItem value="in-progress">Em andamento</SelectItem>
              <SelectItem value="closed">Fechado</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="low">Baixa</SelectItem>
            </SelectContent>
          </Select>
          <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Responsável" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="unassigned">Não atribuído</SelectItem>
              <SelectItem value="Maria">Maria</SelectItem>
              <SelectItem value="Carlos">Carlos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredConversations.length === 0 ? (
            <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
              <div className="text-center">
                <h3 className="text-lg font-medium">Nenhuma conversa encontrada</h3>
                <p className="text-sm text-muted-foreground">
                  Tente ajustar seus filtros ou iniciar uma nova conversa.
                </p>
              </div>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent"
              >
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={conversation.contact.avatar} alt={conversation.contact.name} />
                    <AvatarFallback>{conversation.contact.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-medium">{conversation.contact.name}</h4>
                      {conversation.unread && (
                        <Badge variant="secondary" className="ml-2">
                          Não lida
                        </Badge>
                      )}
                      {conversation.priority === "high" && (
                        <Badge variant="destructive" className="ml-2">
                          Prioridade Alta
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{conversation.lastMessage}</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {conversation.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                  <div className="flex items-center space-x-2">
                    {conversation.assignedTo ? (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span className="text-xs">{conversation.assignedTo}</span>
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        Não atribuído
                      </Badge>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Mais opções</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem>Abrir conversa</DropdownMenuItem>
                        <DropdownMenuItem>Marcar como lida</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Atribuir a</DropdownMenuLabel>
                        <DropdownMenuItem>Maria</DropdownMenuItem>
                        <DropdownMenuItem>Carlos</DropdownMenuItem>
                        <DropdownMenuItem>Eu</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Prioridade</DropdownMenuLabel>
                        <DropdownMenuItem>Alta</DropdownMenuItem>
                        <DropdownMenuItem>Normal</DropdownMenuItem>
                        <DropdownMenuItem>Baixa</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

