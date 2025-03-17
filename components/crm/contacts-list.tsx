"use client"

import { useState } from "react"
import { Download, MoreHorizontal, Plus, Search, Upload } from "lucide-react"

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

// Mock data - in a real app, this would come from an API
const contacts = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@exemplo.com",
    phone: "(11) 98765-4321",
    company: "Acme Inc.",
    status: "lead",
    tags: ["interessado", "plano-pro"],
    lastContact: "2 dias atrás",
    avatar: "/placeholder.svg",
  },
  {
    id: "2",
    name: "Ana Souza",
    email: "ana@exemplo.com",
    phone: "(21) 98765-4321",
    company: "Tech Solutions",
    status: "customer",
    tags: ["plano-enterprise", "suporte-vip"],
    lastContact: "1 semana atrás",
    avatar: "/placeholder.svg",
  },
  {
    id: "3",
    name: "Pedro Oliveira",
    email: "pedro@exemplo.com",
    phone: "(31) 98765-4321",
    company: "Startup X",
    status: "lead",
    tags: ["trial", "feature-request"],
    lastContact: "3 dias atrás",
    avatar: "/placeholder.svg",
  },
  {
    id: "4",
    name: "Carla Mendes",
    email: "carla@exemplo.com",
    phone: "(41) 98765-4321",
    company: "Consultoria Y",
    status: "opportunity",
    tags: ["negociação", "demo-agendada"],
    lastContact: "Hoje",
    avatar: "/placeholder.svg",
  },
]

export function ContactsList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showAddContactDialog, setShowAddContactDialog] = useState(false)

  const filteredContacts = contacts.filter((contact) => {
    // Search filter
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    // Status filter
    const matchesStatus = statusFilter === "all" || contact.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Contatos</CardTitle>
            <CardDescription>Gerencie seus contatos e leads.</CardDescription>
          </div>
          <div className="flex space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  Exportar CSV
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  Exportar Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Importar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Upload className="mr-2 h-4 w-4" />
                  Importar CSV
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Upload className="mr-2 h-4 w-4" />
                  Importar Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Dialog open={showAddContactDialog} onOpenChange={setShowAddContactDialog}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Contato
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Contato</DialogTitle>
                  <DialogDescription>Preencha os dados do novo contato.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Nome
                    </Label>
                    <Input id="name" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input id="email" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">
                      Telefone
                    </Label>
                    <Input id="phone" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="company" className="text-right">
                      Empresa
                    </Label>
                    <Input id="company" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                      Status
                    </Label>
                    <Select>
                      <SelectTrigger id="status" className="col-span-3">
                        <SelectValue placeholder="Selecione um status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lead">Lead</SelectItem>
                        <SelectItem value="opportunity">Oportunidade</SelectItem>
                        <SelectItem value="customer">Cliente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddContactDialog(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Salvar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar contatos..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="lead">Lead</SelectItem>
              <SelectItem value="opportunity">Oportunidade</SelectItem>
              <SelectItem value="customer">Cliente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredContacts.length === 0 ? (
            <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
              <div className="text-center">
                <h3 className="text-lg font-medium">Nenhum contato encontrado</h3>
                <p className="text-sm text-muted-foreground">
                  Tente ajustar seus filtros ou adicionar um novo contato.
                </p>
              </div>
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={contact.avatar} alt={contact.name} />
                    <AvatarFallback>{contact.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-medium">{contact.name}</h4>
                      {contact.status === "lead" && <Badge className="ml-2">Lead</Badge>}
                      {contact.status === "opportunity" && (
                        <Badge variant="secondary" className="ml-2">
                          Oportunidade
                        </Badge>
                      )}
                      {contact.status === "customer" && (
                        <Badge variant="outline" className="ml-2 bg-green-100">
                          Cliente
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {contact.email} • {contact.phone}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {contact.company} • Último contato: {contact.lastContact}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {contact.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Mais opções</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                    <DropdownMenuItem>Editar contato</DropdownMenuItem>
                    <DropdownMenuItem>Iniciar conversa</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Status</DropdownMenuLabel>
                    <DropdownMenuItem>Marcar como Lead</DropdownMenuItem>
                    <DropdownMenuItem>Marcar como Oportunidade</DropdownMenuItem>
                    <DropdownMenuItem>Marcar como Cliente</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">Excluir contato</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

