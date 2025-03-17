"use client"

import { useState } from "react"
import { X, Mail, Phone, Building, Tag, Clock, Edit, Plus, Trash2, Calendar } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
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
import { useToast } from "@/hooks/use-toast"

// Mock data - in a real app, this would come from an API
const contactsData = {
  "1": {
    id: "c1",
    name: "João Silva",
    email: "joao@exemplo.com",
    phone: "+5511987654321",
    avatar: "/placeholder.svg?height=40&width=40",
    company: "Acme Inc.",
    position: "Diretor de Tecnologia",
    tags: ["cliente", "premium"],
    lastSeen: "Agora",
    status: "online",
    notes: [
      {
        id: "n1",
        content: "Cliente interessado em expandir para o plano Enterprise.",
        createdAt: "2023-11-10T14:30:00",
        createdBy: "Maria",
      },
      {
        id: "n2",
        content: "Mencionou que está considerando adicionar mais 5 usuários no próximo mês.",
        createdAt: "2023-11-05T10:15:00",
        createdBy: "Carlos",
      },
    ],
    activities: [
      {
        id: "a1",
        type: "email",
        description: "Email enviado: Proposta comercial",
        date: "2023-11-12T09:30:00",
      },
      {
        id: "a2",
        type: "call",
        description: "Chamada realizada: Apresentação do produto",
        date: "2023-11-08T15:45:00",
      },
      {
        id: "a3",
        type: "meeting",
        description: "Reunião agendada: Demonstração do produto",
        date: "2023-11-20T14:00:00",
      },
    ],
    deals: [
      {
        id: "d1",
        title: "Upgrade para plano Enterprise",
        value: "R$ 5.990,00",
        stage: "Proposta",
        probability: 70,
        expectedCloseDate: "2023-12-15",
      },
    ],
    customFields: {
      Origem: "Indicação",
      Segmento: "Tecnologia",
      "Tamanho da Empresa": "Média (50-200 funcionários)",
    },
  },
  "2": {
    id: "c2",
    name: "Ana Souza",
    email: "ana@exemplo.com",
    phone: "+5521987654321",
    avatar: "/placeholder.svg?height=40&width=40",
    company: "Tech Solutions",
    position: "Gerente de Produto",
    tags: ["lead", "trial"],
    lastSeen: "5 min atrás",
    status: "online",
    notes: [
      {
        id: "n1",
        content: "Está avaliando nossa solução para substituir o sistema atual.",
        createdAt: "2023-11-14T11:20:00",
        createdBy: "Carlos",
      },
    ],
    activities: [
      {
        id: "a1",
        type: "email",
        description: "Email enviado: Material informativo",
        date: "2023-11-13T10:30:00",
      },
      {
        id: "a2",
        type: "meeting",
        description: "Demo realizada",
        date: "2023-11-14T14:00:00",
      },
    ],
    deals: [],
    customFields: {
      Origem: "Website",
      Segmento: "SaaS",
      "Tamanho da Empresa": "Pequena (10-50 funcionários)",
    },
  },
  "3": {
    id: "c3",
    name: "Pedro Oliveira",
    email: "pedro@exemplo.com",
    phone: "+5531987654321",
    avatar: "/placeholder.svg?height=40&width=40",
    company: "Startup X",
    position: "CEO",
    tags: ["prospect"],
    lastSeen: "1 hora atrás",
    status: "away",
    notes: [],
    activities: [
      {
        id: "a1",
        type: "email",
        description: "Email recebido: Solicitação de informações",
        date: "2023-11-14T09:15:00",
      },
    ],
    deals: [],
    customFields: {
      Origem: "LinkedIn",
      Segmento: "Fintech",
      "Tamanho da Empresa": "Startup (< 10 funcionários)",
    },
  },
}

interface ContactInfoPanelProps {
  conversationId: string
  onClose: () => void
}

export function ContactInfoPanel({ conversationId, onClose }: ContactInfoPanelProps) {
  const [newNote, setNewNote] = useState("")
  const [newTag, setNewTag] = useState("")
  const [showAddTagDialog, setShowAddTagDialog] = useState(false)
  const [showEditContactDialog, setShowEditContactDialog] = useState(false)
  const { toast } = useToast()

  // Find the contact based on the conversation ID
  // In a real app, this would be more direct
  const conversationContact =
    Object.values(contactsData).find((contact) => contact.id === `c${conversationId}`) || contactsData["1"] // Fallback to first contact if not found

  const handleAddNote = () => {
    if (!newNote.trim()) return

    // In a real app, this would add the note to the API
    toast({
      title: "Nota adicionada",
      description: "A nota foi adicionada com sucesso.",
    })

    setNewNote("")
  }

  const handleAddTag = () => {
    if (!newTag.trim()) return

    // In a real app, this would add the tag to the API
    toast({
      title: "Tag adicionada",
      description: "A tag foi adicionada com sucesso.",
    })

    setNewTag("")
    setShowAddTagDialog(false)
  }

  const handleSaveContact = () => {
    // In a real app, this would save the contact to the API
    toast({
      title: "Contato atualizado",
      description: "As informações do contato foram atualizadas com sucesso.",
    })

    setShowEditContactDialog(false)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " às " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-3 flex items-center justify-between">
        <h2 className="font-semibold">Informações do Contato</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
          <span className="sr-only">Fechar</span>
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-20 w-20 mb-2">
              <AvatarImage src={conversationContact.avatar} alt={conversationContact.name} />
              <AvatarFallback>{conversationContact.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-semibold">{conversationContact.name}</h3>
            <p className="text-sm text-muted-foreground">
              {conversationContact.position} em {conversationContact.company}
            </p>
            <div className="flex mt-2 space-x-2">
              <Button variant="outline" size="sm">
                <Phone className="mr-2 h-4 w-4" />
                Ligar
              </Button>
              <Button variant="outline" size="sm">
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Button>
              <Dialog open={showEditContactDialog} onOpenChange={setShowEditContactDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Editar Contato</DialogTitle>
                    <DialogDescription>Atualize as informações do contato.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Nome</Label>
                      <Input id="name" defaultValue={conversationContact.name} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" defaultValue={conversationContact.email} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input id="phone" defaultValue={conversationContact.phone} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="company">Empresa</Label>
                      <Input id="company" defaultValue={conversationContact.company} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="position">Cargo</Label>
                      <Input id="position" defaultValue={conversationContact.position} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowEditContactDialog(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSaveContact}>Salvar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Tags</h4>
              <Dialog open={showAddTagDialog} onOpenChange={setShowAddTagDialog}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Adicionar tag</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Tag</DialogTitle>
                    <DialogDescription>Adicione uma nova tag para este contato.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="tag">Tag</Label>
                      <Input
                        id="tag"
                        placeholder="Ex: cliente, premium, etc."
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowAddTagDialog(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleAddTag}>Adicionar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex flex-wrap gap-2">
              {conversationContact.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  <Tag className="mr-1 h-3 w-3" />
                  {tag}
                </Badge>
              ))}
              {conversationContact.tags.length === 0 && (
                <p className="text-sm text-muted-foreground">Nenhuma tag adicionada</p>
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Informações de Contato</h4>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{conversationContact.email}</span>
              </div>
              <div className="flex items-center text-sm">
                <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{conversationContact.phone}</span>
              </div>
              <div className="flex items-center text-sm">
                <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{conversationContact.company}</span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Visto por último: {conversationContact.lastSeen}</span>
              </div>
            </div>
          </div>

          <Separator />

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="notes">
              <AccordionTrigger className="text-sm font-medium">Notas</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Adicionar uma nota..."
                      className="min-h-[80px]"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                    />
                    <Button onClick={handleAddNote} disabled={!newNote.trim()} size="sm">
                      Adicionar Nota
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {conversationContact.notes.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Nenhuma nota adicionada</p>
                    ) : (
                      conversationContact.notes.map((note) => (
                        <div key={note.id} className="rounded-md border p-3">
                          <p className="text-sm">{note.content}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground">
                              Por {note.createdBy} em {formatDate(note.createdAt)}
                            </span>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Trash2 className="h-3 w-3" />
                              <span className="sr-only">Excluir nota</span>
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="activities">
              <AccordionTrigger className="text-sm font-medium">Atividades</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  {conversationContact.activities.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhuma atividade registrada</p>
                  ) : (
                    conversationContact.activities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-2">
                        <div className="mt-0.5">
                          {activity.type === "email" ? (
                            <Mail className="h-4 w-4 text-blue-500" />
                          ) : activity.type === "call" ? (
                            <Phone className="h-4 w-4 text-green-500" />
                          ) : (
                            <Calendar className="h-4 w-4 text-purple-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{activity.description}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(activity.date)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="deals">
              <AccordionTrigger className="text-sm font-medium">Negociações</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  {conversationContact.deals.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhuma negociação em andamento</p>
                  ) : (
                    conversationContact.deals.map((deal) => (
                      <div key={deal.id} className="rounded-md border p-3">
                        <h5 className="font-medium text-sm">{deal.title}</h5>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Valor</p>
                            <p className="text-sm">{deal.value}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Estágio</p>
                            <p className="text-sm">{deal.stage}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Probabilidade</p>
                            <p className="text-sm">{deal.probability}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Previsão de Fechamento</p>
                            <p className="text-sm">{new Date(deal.expectedCloseDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <Button size="sm" className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Negociação
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="custom-fields">
              <AccordionTrigger className="text-sm font-medium">Campos Personalizados</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {Object.entries(conversationContact.customFields).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-sm text-muted-foreground">{key}</span>
                      <span className="text-sm">{value}</span>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </ScrollArea>
    </div>
  )
}

