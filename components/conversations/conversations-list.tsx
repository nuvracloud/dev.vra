"use client"

import { useState } from "react"
import { Search, Filter, Plus, MoreVertical, Phone, Mail, MessageSquare } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

// Mock data - in a real app, this would come from an API
const conversations = [
  {
    id: "1",
    contact: {
      id: "c1",
      name: "João Silva",
      email: "joao@exemplo.com",
      phone: "+5511987654321",
      avatar: "/placeholder.svg?height=40&width=40",
      company: "Acme Inc.",
      tags: ["cliente", "premium"],
      lastSeen: "Agora",
      status: "online",
    },
    lastMessage: {
      content: "Olá, gostaria de saber mais sobre os planos de assinatura.",
      timestamp: "10:23",
      sender: "contact",
      read: false,
    },
    unreadCount: 1,
    channel: "whatsapp",
    assignedTo: {
      id: "a1",
      name: "Maria",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    priority: "high",
    status: "active",
  },
  {
    id: "2",
    contact: {
      id: "c2",
      name: "Ana Souza",
      email: "ana@exemplo.com",
      phone: "+5521987654321",
      avatar: "/placeholder.svg?height=40&width=40",
      company: "Tech Solutions",
      tags: ["lead", "trial"],
      lastSeen: "5 min atrás",
      status: "online",
    },
    lastMessage: {
      content: "Obrigado pelo suporte, resolveu meu problema!",
      timestamp: "Ontem",
      sender: "user",
      read: true,
    },
    unreadCount: 0,
    channel: "website",
    assignedTo: {
      id: "a2",
      name: "Carlos",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    priority: "normal",
    status: "active",
  },
  {
    id: "3",
    contact: {
      id: "c3",
      name: "Pedro Oliveira",
      email: "pedro@exemplo.com",
      phone: "+5531987654321",
      avatar: "/placeholder.svg?height=40&width=40",
      company: "Startup X",
      tags: ["prospect"],
      lastSeen: "1 hora atrás",
      status: "away",
    },
    lastMessage: {
      content: "Quando vocês vão lançar a nova funcionalidade?",
      timestamp: "Ontem",
      sender: "contact",
      read: false,
    },
    unreadCount: 3,
    channel: "email",
    assignedTo: null,
    priority: "normal",
    status: "active",
  },
  {
    id: "4",
    contact: {
      id: "c4",
      name: "Carla Mendes",
      email: "carla@exemplo.com",
      phone: "+5541987654321",
      avatar: "/placeholder.svg?height=40&width=40",
      company: "Consultoria Y",
      tags: ["cliente"],
      lastSeen: "3 horas atrás",
      status: "offline",
    },
    lastMessage: {
      content: "Estou com problemas para configurar o agente de IA.",
      timestamp: "Seg",
      sender: "contact",
      read: true,
    },
    unreadCount: 0,
    channel: "whatsapp",
    assignedTo: {
      id: "a1",
      name: "Maria",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    priority: "high",
    status: "active",
  },
  {
    id: "5",
    contact: {
      id: "c5",
      name: "Roberto Almeida",
      email: "roberto@exemplo.com",
      phone: "+5551987654321",
      avatar: "/placeholder.svg?height=40&width=40",
      company: "Empresa Z",
      tags: ["cliente", "enterprise"],
      lastSeen: "2 dias atrás",
      status: "offline",
    },
    lastMessage: {
      content: "Precisamos agendar uma reunião para discutir a renovação do contrato.",
      timestamp: "Seg",
      sender: "user",
      read: true,
    },
    unreadCount: 0,
    channel: "email",
    assignedTo: {
      id: "a3",
      name: "Paulo",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    priority: "normal",
    status: "closed",
  },
]

// Mock data for agents
const agents = [
  {
    id: "a1",
    name: "Assistente de Vendas",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "a2",
    name: "Suporte Técnico",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "a3",
    name: "Assistente de RH",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

// Mock data for team members
const teamMembers = [
  {
    id: "t1",
    name: "Maria",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Atendente",
  },
  {
    id: "t2",
    name: "Carlos",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Suporte Técnico",
  },
  {
    id: "t3",
    name: "Paulo",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Gerente de Contas",
  },
]

interface ConversationsListProps {
  selectedConversationId: string | null
  onSelectConversation: (id: string) => void
}

export function ConversationsList({ selectedConversationId, onSelectConversation }: ConversationsListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [showNewConversationDialog, setShowNewConversationDialog] = useState(false)
  const [showFilterDialog, setShowFilterDialog] = useState(false)
  const [filterAssignee, setFilterAssignee] = useState("all")
  const [filterChannel, setFilterChannel] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const { toast } = useToast()

  const filteredConversations = conversations.filter((conversation) => {
    // Search filter
    const matchesSearch =
      conversation.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase())

    // Tab filter
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "unassigned" && !conversation.assignedTo) ||
      (activeTab === "unread" && conversation.unreadCount > 0) ||
      (activeTab === "closed" && conversation.status === "closed")

    // Assignee filter
    const matchesAssignee =
      filterAssignee === "all" ||
      (filterAssignee === "unassigned" && !conversation.assignedTo) ||
      (conversation.assignedTo && conversation.assignedTo.id === filterAssignee)

    // Channel filter
    const matchesChannel = filterChannel === "all" || conversation.channel === filterChannel

    // Status filter
    const matchesStatus = filterStatus === "all" || conversation.status === filterStatus

    return matchesSearch && matchesTab && matchesAssignee && matchesChannel && matchesStatus
  })

  const handleStartNewConversation = () => {
    // In a real app, this would create a new conversation
    toast({
      title: "Nova conversa iniciada",
      description: "A conversa foi iniciada com sucesso.",
    })
    setShowNewConversationDialog(false)
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "whatsapp":
        return <Phone className="h-3 w-3" />
      case "email":
        return <Mail className="h-3 w-3" />
      case "website":
        return <MessageSquare className="h-3 w-3" />
      default:
        return <MessageSquare className="h-3 w-3" />
    }
  }

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      case "offline":
        return "bg-gray-400"
      default:
        return "bg-gray-400"
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Conversas</h2>
          <div className="flex space-x-1">
            <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Filtrar</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Filtrar Conversas</DialogTitle>
                  <DialogDescription>Selecione os filtros para as conversas.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="assignee">Atribuído a</Label>
                    <Select value={filterAssignee} onValueChange={setFilterAssignee}>
                      <SelectTrigger id="assignee">
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="unassigned">Não atribuído</SelectItem>
                        <SelectItem value="a1">Maria</SelectItem>
                        <SelectItem value="a2">Carlos</SelectItem>
                        <SelectItem value="a3">Paulo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="channel">Canal</Label>
                    <Select value={filterChannel} onValueChange={setFilterChannel}>
                      <SelectTrigger id="channel">
                        <SelectValue placeholder="Todos os canais" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os canais</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="website">Website</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Todos os status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os status</SelectItem>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="closed">Fechado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFilterAssignee("all")
                      setFilterChannel("all")
                      setFilterStatus("all")
                    }}
                  >
                    Limpar Filtros
                  </Button>
                  <Button onClick={() => setShowFilterDialog(false)}>Aplicar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={showNewConversationDialog} onOpenChange={setShowNewConversationDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Nova conversa</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nova Conversa</DialogTitle>
                  <DialogDescription>Inicie uma nova conversa com um contato ou cliente.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="contact">Contato</Label>
                    <Select>
                      <SelectTrigger id="contact">
                        <SelectValue placeholder="Selecione um contato" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="c1">João Silva</SelectItem>
                        <SelectItem value="c2">Ana Souza</SelectItem>
                        <SelectItem value="c3">Pedro Oliveira</SelectItem>
                        <SelectItem value="c4">Carla Mendes</SelectItem>
                        <SelectItem value="c5">Roberto Almeida</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="channel">Canal</Label>
                    <Select defaultValue="whatsapp">
                      <SelectTrigger id="channel">
                        <SelectValue placeholder="Selecione um canal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="website">Website</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="message">Mensagem Inicial</Label>
                    <Textarea
                      id="message"
                      placeholder="Digite uma mensagem inicial (opcional)"
                      className="min-h-[100px]"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="assignee">Atribuir a</Label>
                    <Select>
                      <SelectTrigger id="assignee">
                        <SelectValue placeholder="Selecione um responsável" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="human">Atendente Humano</SelectItem>
                        <SelectItem value="a1">Assistente de Vendas (IA)</SelectItem>
                        <SelectItem value="a2">Suporte Técnico (IA)</SelectItem>
                        <SelectItem value="a3">Assistente de RH (IA)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowNewConversationDialog(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleStartNewConversation}>Iniciar Conversa</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Mais opções</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Opções</DropdownMenuLabel>
                <DropdownMenuItem>Marcar todas como lidas</DropdownMenuItem>
                <DropdownMenuItem>Exportar conversas</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Configurações</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar conversas..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-3 pt-2">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="unassigned">Não Atribuídas</TabsTrigger>
            <TabsTrigger value="unread">Não Lidas</TabsTrigger>
            <TabsTrigger value="closed">Fechadas</TabsTrigger>
          </TabsList>
        </div>
      </Tabs>

      <div className="flex-1 overflow-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex h-full items-center justify-center p-4">
            <div className="text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="mt-2 text-lg font-medium">Nenhuma conversa encontrada</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Tente ajustar seus filtros ou iniciar uma nova conversa.
              </p>
              <Button className="mt-4" onClick={() => setShowNewConversationDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Conversa
              </Button>
            </div>
          </div>
        ) : (
          <div className="divide-y">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-3 hover:bg-muted/50 cursor-pointer transition-colors ${
                  selectedConversationId === conversation.id ? "bg-muted" : ""
                }`}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={conversation.contact.avatar} alt={conversation.contact.name} />
                      <AvatarFallback>{conversation.contact.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${getStatusIndicator(conversation.contact.status)}`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <h3 className="font-medium text-sm truncate">{conversation.contact.name}</h3>
                        <Badge variant="outline" className="h-5 flex items-center space-x-1 text-xs">
                          {getChannelIcon(conversation.channel)}
                          <span>{conversation.channel}</span>
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {conversation.lastMessage.timestamp}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-1">
                      <p
                        className={`text-sm truncate ${
                          !conversation.lastMessage.read && conversation.lastMessage.sender === "contact"
                            ? "font-medium"
                            : "text-muted-foreground"
                        }`}
                      >
                        {conversation.lastMessage.sender === "user" ? "Você: " : ""}
                        {conversation.lastMessage.content}
                      </p>

                      {conversation.unreadCount > 0 && (
                        <Badge className="ml-2 h-5 w-5 flex items-center justify-center rounded-full p-0">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center mt-1 space-x-1">
                      {conversation.assignedTo ? (
                        <div className="flex items-center">
                          <div className="flex -space-x-2 mr-1">
                            <Avatar className="h-5 w-5 border-2 border-background">
                              <AvatarImage src={conversation.assignedTo.avatar} alt={conversation.assignedTo.name} />
                              <AvatarFallback className="text-[10px]">
                                {conversation.assignedTo.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <span className="text-xs text-muted-foreground">{conversation.assignedTo.name}</span>
                        </div>
                      ) : (
                        <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-200">
                          Não atribuído
                        </Badge>
                      )}

                      {conversation.priority === "high" && (
                        <Badge variant="destructive" className="text-xs">
                          Prioridade Alta
                        </Badge>
                      )}

                      {conversation.contact.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

