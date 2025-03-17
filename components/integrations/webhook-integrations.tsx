"use client"

import { useState } from "react"
import { Copy, Plus, Trash2, ExternalLink, Check } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useToast } from "@/hooks/use-toast"

// Mock data for webhooks
const webhooks = [
  {
    id: "wh1",
    name: "Notificação de Nova Conversa",
    url: "https://exemplo.com/webhooks/nova-conversa",
    events: ["conversation.created"],
    status: "active",
    createdAt: "2023-10-15T10:30:00",
    lastTriggered: "2023-11-14T15:45:00",
    secret: "whsec_a1b2c3d4e5f6g7h8i9j0",
    version: "v1",
  },
  {
    id: "wh2",
    name: "Atualização de Status de Conversa",
    url: "https://exemplo.com/webhooks/status-conversa",
    events: ["conversation.updated", "conversation.closed"],
    status: "active",
    createdAt: "2023-09-20T14:20:00",
    lastTriggered: "2023-11-10T09:15:00",
    secret: "whsec_z9y8x7w6v5u4t3s2r1q0",
    version: "v1",
  },
  {
    id: "wh3",
    name: "Integração com CRM",
    url: "https://crm.exemplo.com/api/webhook",
    events: ["contact.created", "contact.updated", "deal.created"],
    status: "inactive",
    createdAt: "2023-11-01T08:45:00",
    lastTriggered: null,
    secret: "whsec_j9i8h7g6f5e4d3c2b1a0",
    version: "v1",
  },
]

// Mock data for webhook events
const webhookEvents = [
  {
    id: "conversation.created",
    name: "Nova Conversa",
    description: "Disparado quando uma nova conversa é criada.",
    category: "Conversas",
  },
  {
    id: "conversation.updated",
    name: "Conversa Atualizada",
    description: "Disparado quando uma conversa é atualizada.",
    category: "Conversas",
  },
  {
    id: "conversation.closed",
    name: "Conversa Fechada",
    description: "Disparado quando uma conversa é fechada.",
    category: "Conversas",
  },
  {
    id: "message.created",
    name: "Nova Mensagem",
    description: "Disparado quando uma nova mensagem é enviada.",
    category: "Mensagens",
  },
  {
    id: "message.delivered",
    name: "Mensagem Entregue",
    description: "Disparado quando uma mensagem é entregue ao destinatário.",
    category: "Mensagens",
  },
  {
    id: "message.read",
    name: "Mensagem Lida",
    description: "Disparado quando uma mensagem é lida pelo destinatário.",
    category: "Mensagens",
  },
  {
    id: "contact.created",
    name: "Novo Contato",
    description: "Disparado quando um novo contato é criado.",
    category: "Contatos",
  },
  {
    id: "contact.updated",
    name: "Contato Atualizado",
    description: "Disparado quando um contato é atualizado.",
    category: "Contatos",
  },
  {
    id: "deal.created",
    name: "Nova Negociação",
    description: "Disparado quando uma nova negociação é criada.",
    category: "Negociações",
  },
  {
    id: "deal.updated",
    name: "Negociação Atualizada",
    description: "Disparado quando uma negociação é atualizada.",
    category: "Negociações",
  },
  {
    id: "deal.closed",
    name: "Negociação Fechada",
    description: "Disparado quando uma negociação é fechada.",
    category: "Negociações",
  },
]

// Mock data for webhook logs
const webhookLogs = [
  {
    id: "log1",
    webhookId: "wh1",
    event: "conversation.created",
    status: "success",
    statusCode: 200,
    requestTime: "2023-11-14T15:45:00",
    responseTime: 120, // ms
    payload: {
      id: "conv123",
      contact: {
        id: "c1",
        name: "João Silva",
      },
      channel: "whatsapp",
      createdAt: "2023-11-14T15:44:50",
    },
  },
  {
    id: "log2",
    webhookId: "wh2",
    event: "conversation.updated",
    status: "success",
    statusCode: 200,
    requestTime: "2023-11-10T09:15:00",
    responseTime: 95, // ms
    payload: {
      id: "conv122",
      status: "active",
      assignedTo: {
        id: "a1",
        name: "Maria",
      },
      updatedAt: "2023-11-10T09:14:55",
    },
  },
  {
    id: "log3",
    webhookId: "wh2",
    event: "conversation.closed",
    status: "failed",
    statusCode: 500,
    requestTime: "2023-11-09T14:30:00",
    responseTime: 2500, // ms
    payload: {
      id: "conv120",
      status: "closed",
      closedAt: "2023-11-09T14:29:50",
      closedBy: {
        id: "a2",
        name: "Carlos",
      },
    },
  },
]

export function WebhookIntegrations() {
  const [showNewWebhookDialog, setShowNewWebhookDialog] = useState(false)
  const [showDeleteWebhookDialog, setShowDeleteWebhookDialog] = useState(false)
  const [webhookToDelete, setWebhookToDelete] = useState<string | null>(null)
  const [newWebhookName, setNewWebhookName] = useState("")
  const [newWebhookUrl, setNewWebhookUrl] = useState("")
  const [newWebhookEvents, setNewWebhookEvents] = useState<string[]>([])
  const [copiedSecret, setCopiedSecret] = useState<string | null>(null)
  const [selectedWebhook, setSelectedWebhook] = useState<string | null>(null)
  const { toast } = useToast()

  const handleCopySecret = (secret: string) => {
    navigator.clipboard.writeText(secret)
    setCopiedSecret(secret)

    toast({
      title: "Segredo copiado",
      description: "O segredo do webhook foi copiado para a área de transferência.",
    })

    setTimeout(() => {
      setCopiedSecret(null)
    }, 2000)
  }

  const handleCreateWebhook = () => {
    // In a real app, this would create a new webhook
    toast({
      title: "Webhook criado",
      description: "O novo webhook foi criado com sucesso.",
    })

    setShowNewWebhookDialog(false)
    setNewWebhookName("")
    setNewWebhookUrl("")
    setNewWebhookEvents([])
  }

  const handleDeleteWebhook = () => {
    // In a real app, this would delete the webhook
    toast({
      title: "Webhook excluído",
      description: "O webhook foi excluído com sucesso.",
    })

    setShowDeleteWebhookDialog(false)
    setWebhookToDelete(null)
  }

  const handleTestWebhook = (webhookId: string) => {
    // In a real app, this would test the webhook
    toast({
      title: "Teste enviado",
      description: "Um evento de teste foi enviado para o webhook.",
    })
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    return (
      new Date(dateString).toLocaleDateString() +
      " " +
      new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    )
  }

  const formatWebhookLastTriggered = (dateString: string | null) => {
    if (!dateString) return "Nunca disparado"

    const date = new Date(dateString)
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

  // Group webhook events by category
  const eventsByCategory = webhookEvents.reduce(
    (acc, event) => {
      if (!acc[event.category]) {
        acc[event.category] = []
      }
      acc[event.category].push(event)
      return acc
    },
    {} as Record<string, typeof webhookEvents>,
  )

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Webhooks</h3>
          <p className="text-sm text-muted-foreground">
            Configure webhooks para receber notificações em tempo real sobre eventos da plataforma.
          </p>
        </div>
        <Dialog open={showNewWebhookDialog} onOpenChange={setShowNewWebhookDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Webhook
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Novo Webhook</DialogTitle>
              <DialogDescription>
                Configure um novo webhook para receber notificações em tempo real sobre eventos da plataforma.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="webhook-name">Nome do Webhook</Label>
                <Input
                  id="webhook-name"
                  placeholder="Ex: Notificação de Nova Conversa"
                  value={newWebhookName}
                  onChange={(e) => setNewWebhookName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="webhook-url">URL do Webhook</Label>
                <Input
                  id="webhook-url"
                  placeholder="https://exemplo.com/webhooks/endpoint"
                  value={newWebhookUrl}
                  onChange={(e) => setNewWebhookUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  A URL deve ser acessível publicamente e responder com um código 200 OK.
                </p>
              </div>
              <div className="grid gap-2">
                <Label>Eventos</Label>
                <div className="max-h-60 overflow-y-auto rounded-md border p-2">
                  {Object.entries(eventsByCategory).map(([category, events]) => (
                    <div key={category} className="mb-4 last:mb-0">
                      <h4 className="mb-2 text-sm font-medium">{category}</h4>
                      <div className="space-y-2">
                        {events.map((event) => (
                          <div key={event.id} className="flex items-start space-x-2">
                            <Switch
                              id={`event-${event.id}`}
                              checked={newWebhookEvents.includes(event.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setNewWebhookEvents((prev) => [...prev, event.id])
                                } else {
                                  setNewWebhookEvents((prev) => prev.filter((e) => e !== event.id))
                                }
                              }}
                            />
                            <div className="flex-1">
                              <Label htmlFor={`event-${event.id}`} className="text-sm font-medium cursor-pointer">
                                {event.name}
                              </Label>
                              <p className="text-xs text-muted-foreground">{event.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewWebhookDialog(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleCreateWebhook}
                disabled={!newWebhookName.trim() || !newWebhookUrl.trim() || newWebhookEvents.length === 0}
              >
                Criar Webhook
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {webhooks.map((webhook) => (
          <Card key={webhook.id} className={webhook.status === "inactive" ? "opacity-70" : ""}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CardTitle className="text-lg">{webhook.name}</CardTitle>
                  {webhook.status === "inactive" && (
                    <Badge variant="outline" className="text-muted-foreground">
                      Inativo
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={webhook.status === "active"}
                    onCheckedChange={(checked) => {
                      // In a real app, this would update the webhook status
                      toast({
                        title: checked ? "Webhook ativado" : "Webhook desativado",
                        description: `O webhook "${webhook.name}" foi ${checked ? "ativado" : "desativado"} com sucesso.`,
                      })
                    }}
                  />
                  <AlertDialog
                    open={showDeleteWebhookDialog && webhookToDelete === webhook.id}
                    onOpenChange={(open) => {
                      setShowDeleteWebhookDialog(open)
                      if (!open) setWebhookToDelete(null)
                    }}
                  >
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => setWebhookToDelete(webhook.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Excluir webhook</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir Webhook</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir este webhook? Esta ação não pode ser desfeita. Você não
                          receberá mais notificações para os eventos configurados.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteWebhook}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <CardDescription>Criado em {formatDate(webhook.createdAt)}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Label className="text-sm font-medium min-w-[80px]">URL:</Label>
                  <code className="flex-1 rounded bg-muted px-2 py-1 text-sm font-mono">{webhook.url}</code>
                </div>
                <div className="flex items-start space-x-2">
                  <Label className="text-sm font-medium min-w-[80px] pt-1">Eventos:</Label>
                  <div className="flex flex-wrap gap-2">
                    {webhook.events.map((eventId) => {
                      const event = webhookEvents.find((e) => e.id === eventId)
                      return (
                        <Badge key={eventId} variant="secondary">
                          {event ? event.name : eventId}
                        </Badge>
                      )
                    })}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Label className="text-sm font-medium min-w-[80px]">Segredo:</Label>
                  <div className="flex-1 flex items-center space-x-2">
                    <code className="flex-1 rounded bg-muted px-2 py-1 text-sm font-mono">{webhook.secret}</code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleCopySecret(webhook.secret)}
                    >
                      {copiedSecret === webhook.secret ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      <span className="sr-only">Copiar segredo</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-xs text-muted-foreground">
                Último disparo: {formatWebhookLastTriggered(webhook.lastTriggered)}
              </p>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleTestWebhook(webhook.id)}>
                  Testar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedWebhook(webhook.id === selectedWebhook ? null : webhook.id)}
                >
                  {webhook.id === selectedWebhook ? "Ocultar Logs" : "Ver Logs"}
                </Button>
              </div>
            </CardFooter>
            {webhook.id === selectedWebhook && (
              <div className="border-t px-6 py-4">
                <h4 className="text-sm font-medium mb-3">Logs Recentes</h4>
                <div className="space-y-3">
                  {webhookLogs.filter((log) => log.webhookId === webhook.id).length > 0 ? (
                    webhookLogs
                      .filter((log) => log.webhookId === webhook.id)
                      .map((log) => {
                        const event = webhookEvents.find((e) => e.id === log.event)
                        return (
                          <Accordion key={log.id} type="single" collapsible className="w-full">
                            <AccordionItem value={log.id} className="border rounded-md px-4">
                              <AccordionTrigger className="py-2">
                                <div className="flex items-center space-x-3 text-left">
                                  <Badge
                                    variant={log.status === "success" ? "outline" : "destructive"}
                                    className={
                                      log.status === "success" ? "bg-green-100 text-green-800 border-green-200" : ""
                                    }
                                  >
                                    {log.status === "success" ? "Sucesso" : "Falha"}
                                  </Badge>
                                  <span className="text-sm font-medium">{event ? event.name : log.event}</span>
                                  <span className="text-xs text-muted-foreground">{formatDate(log.requestTime)}</span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-3 py-2">
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                      <Label className="text-xs text-muted-foreground">Status Code</Label>
                                      <p>{log.statusCode}</p>
                                    </div>
                                    <div>
                                      <Label className="text-xs text-muted-foreground">Tempo de Resposta</Label>
                                      <p>{log.responseTime}ms</p>
                                    </div>
                                  </div>
                                  <div>
                                    <Label className="text-xs text-muted-foreground">Payload</Label>
                                    <pre className="mt-1 rounded bg-muted p-2 text-xs font-mono overflow-auto max-h-40">
                                      {JSON.stringify(log.payload, null, 2)}
                                    </pre>
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        )
                      })
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhum log encontrado para este webhook.</p>
                  )}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      <div className="mt-8 rounded-lg border p-4 bg-muted/50">
        <h4 className="font-medium mb-2">Implementação de Webhooks</h4>
        <p className="text-sm text-muted-foreground mb-4">
          Aprenda como implementar webhooks em sua aplicação para receber notificações em tempo real.
        </p>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Verificação de Assinatura</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground mb-2">
                Para garantir a segurança dos webhooks, você deve verificar a assinatura de cada requisição. Utilizamos
                o algoritmo HMAC-SHA256 para assinar os payloads.
              </p>
              <div className="rounded-md bg-muted p-3 font-mono text-sm overflow-auto">
                <pre>{`// Exemplo em Node.js
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const expectedSignature = hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}`}</pre>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Formato do Payload</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground mb-2">
                Todos os webhooks enviam um payload JSON com a seguinte estrutura:
              </p>
              <div className="rounded-md bg-muted p-3 font-mono text-sm overflow-auto">
                <pre>{`{
  "id": "evt_123456789",
  "type": "conversation.created",
  "created_at": "2023-11-14T15:44:50Z",
  "data": {
    // Dados específicos do evento
  }
}`}</pre>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Tratamento de Falhas</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground mb-2">
                Se seu endpoint falhar em processar um webhook, tentaremos novamente com o seguinte cronograma:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mb-2">
                <li>1ª tentativa: imediatamente</li>
                <li>2ª tentativa: 5 minutos depois</li>
                <li>3ª tentativa: 30 minutos depois</li>
                <li>4ª tentativa: 2 horas depois</li>
                <li>5ª tentativa: 5 horas depois</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Após 5 tentativas sem sucesso, o webhook será marcado como falho e não tentaremos novamente.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="mt-4">
          <Button variant="outline" className="text-sm" asChild>
            <a href="#" target="_blank" rel="noopener noreferrer">
              Ver Documentação Completa
              <ExternalLink className="ml-2 h-3.5 w-3.5" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}

