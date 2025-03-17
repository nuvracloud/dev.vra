"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { MoreHorizontal, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data - in a real app, this would come from an API
const initialColumns = {
  new: {
    id: "new",
    title: "Novos Leads",
    leadIds: ["1", "3"],
  },
  contacted: {
    id: "contacted",
    title: "Contato Realizado",
    leadIds: ["4"],
  },
  proposal: {
    id: "proposal",
    title: "Em Proposta",
    leadIds: [],
  },
  negotiation: {
    id: "negotiation",
    title: "Em Negociação",
    leadIds: [],
  },
  "closed-won": {
    id: "closed-won",
    title: "Fechado (Ganho)",
    leadIds: ["2"],
  },
  "closed-lost": {
    id: "closed-lost",
    title: "Fechado (Perdido)",
    leadIds: [],
  },
}

const leadsData = {
  "1": {
    id: "1",
    name: "João Silva",
    company: "Acme Inc.",
    email: "joao@exemplo.com",
    phone: "(11) 98765-4321",
    tags: ["interessado", "plano-pro"],
    assignedTo: "Maria",
    lastContact: "2 dias atrás",
    avatar: "/placeholder.svg",
  },
  "2": {
    id: "2",
    name: "Ana Souza",
    company: "Tech Solutions",
    email: "ana@exemplo.com",
    phone: "(21) 98765-4321",
    tags: ["plano-enterprise", "suporte-vip"],
    assignedTo: "Carlos",
    lastContact: "1 semana atrás",
    avatar: "/placeholder.svg",
  },
  "3": {
    id: "3",
    name: "Pedro Oliveira",
    company: "Startup X",
    email: "pedro@exemplo.com",
    phone: "(31) 98765-4321",
    tags: ["trial", "feature-request"],
    assignedTo: null,
    lastContact: "3 dias atrás",
    avatar: "/placeholder.svg",
  },
  "4": {
    id: "4",
    name: "Carla Mendes",
    company: "Consultoria Y",
    email: "carla@exemplo.com",
    phone: "(41) 98765-4321",
    tags: ["negociação", "demo-agendada"],
    assignedTo: "Maria",
    lastContact: "Hoje",
    avatar: "/placeholder.svg",
  },
}

export function LeadsKanban() {
  const [columns, setColumns] = useState(initialColumns)
  const [leads, setLeads] = useState(leadsData)

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result

    // If there's no destination or the item was dropped back to its original position
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    // Get source and destination columns
    const sourceColumn = columns[source.droppableId]
    const destColumn = columns[destination.droppableId]

    // If moving within the same column
    if (sourceColumn.id === destColumn.id) {
      const newLeadIds = Array.from(sourceColumn.leadIds)
      newLeadIds.splice(source.index, 1)
      newLeadIds.splice(destination.index, 0, draggableId)

      const newColumn = {
        ...sourceColumn,
        leadIds: newLeadIds,
      }

      setColumns({
        ...columns,
        [newColumn.id]: newColumn,
      })

      return
    }

    // Moving from one column to another
    const sourceLeadIds = Array.from(sourceColumn.leadIds)
    sourceLeadIds.splice(source.index, 1)

    const newSourceColumn = {
      ...sourceColumn,
      leadIds: sourceLeadIds,
    }

    const destLeadIds = Array.from(destColumn.leadIds)
    destLeadIds.splice(destination.index, 0, draggableId)

    const newDestColumn = {
      ...destColumn,
      leadIds: destLeadIds,
    }

    setColumns({
      ...columns,
      [newSourceColumn.id]: newSourceColumn,
      [newDestColumn.id]: newDestColumn,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kanban de Leads</CardTitle>
        <CardDescription>Arraste e solte os leads entre as colunas para atualizar seu status.</CardDescription>
      </CardHeader>
      <CardContent>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {Object.values(columns).map((column) => (
              <div key={column.id} className="flex-shrink-0 w-72">
                <div className="bg-muted rounded-md p-2">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-sm">{column.title}</h3>
                    <Badge variant="secondary">{column.leadIds.length}</Badge>
                  </div>
                  <Droppable droppableId={column.id}>
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="min-h-[200px]">
                        {column.leadIds.map((leadId, index) => {
                          const lead = leads[leadId]
                          return (
                            <Draggable key={lead.id} draggableId={lead.id} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="bg-background rounded-md p-3 mb-2 border shadow-sm"
                                >
                                  <div className="flex justify-between items-start">
                                    <div className="flex items-center space-x-2">
                                      <Avatar className="h-8 w-8">
                                        <AvatarImage src={lead.avatar} alt={lead.name} />
                                        <AvatarFallback>{lead.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <h4 className="font-medium text-sm">{lead.name}</h4>
                                        <p className="text-xs text-muted-foreground">{lead.company}</p>
                                      </div>
                                    </div>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-6 w-6">
                                          <MoreHorizontal className="h-4 w-4" />
                                          <span className="sr-only">Mais opções</span>
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                        <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                                        <DropdownMenuItem>Iniciar conversa</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuLabel>Atribuir a</DropdownMenuLabel>
                                        <DropdownMenuItem>Maria</DropdownMenuItem>
                                        <DropdownMenuItem>Carlos</DropdownMenuItem>
                                        <DropdownMenuItem>Eu</DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                  <div className="mt-2">
                                    <p className="text-xs text-muted-foreground">Último contato: {lead.lastContact}</p>
                                    {lead.assignedTo && (
                                      <p className="text-xs text-muted-foreground">Responsável: {lead.assignedTo}</p>
                                    )}
                                    <div className="mt-1 flex flex-wrap gap-1">
                                      {lead.tags.map((tag) => (
                                        <Badge key={tag} variant="outline" className="text-xs">
                                          {tag}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          )
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                  <Button variant="ghost" size="sm" className="w-full mt-2">
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar Lead
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </DragDropContext>
      </CardContent>
    </Card>
  )
}

