"use client"

import { useState } from "react"
import { Loader2, ExternalLink, CreditCard, Mail, MessageSquare, Github } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function IntegrationSettings() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showConnectDialog, setShowConnectDialog] = useState(false)
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null)

  // Em uma aplicação real, esses dados viriam de uma API
  const integrations = [
    {
      id: "slack",
      name: "Slack",
      description: "Receba notificações e interaja com sua plataforma diretamente pelo Slack.",
      icon: MessageSquare,
      connected: true,
      status: "active",
      connectedAt: "15/10/2023",
      category: "communication",
    },
    {
      id: "github",
      name: "GitHub",
      description: "Integre com o GitHub para sincronizar projetos e issues.",
      icon: Github,
      connected: false,
      status: "inactive",
      connectedAt: null,
      category: "development",
    },
    {
      id: "stripe",
      name: "Stripe",
      description: "Processe pagamentos e gerencie assinaturas com o Stripe.",
      icon: CreditCard,
      connected: true,
      status: "active",
      connectedAt: "02/11/2023",
      category: "payment",
    },
    {
      id: "mailchimp",
      name: "Mailchimp",
      description: "Integre campanhas de email marketing com o Mailchimp.",
      icon: Mail,
      connected: false,
      status: "inactive",
      connectedAt: null,
      category: "marketing",
    },
  ]

  const handleToggleIntegration = (integrationId: string, enabled: boolean) => {
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: enabled ? "Integração ativada" : "Integração desativada",
        description: `A integração foi ${enabled ? "ativada" : "desativada"} com sucesso.`,
      })
    }, 1000)
  }

  const handleConnectIntegration = (integrationId: string) => {
    setSelectedIntegration(integrationId)
    setShowConnectDialog(true)
  }

  const handleConfirmConnect = () => {
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      setShowConnectDialog(false)

      toast({
        title: "Integração conectada",
        description: "A integração foi conectada com sucesso.",
      })
    }, 1500)
  }

  const handleDisconnect = (integrationId: string) => {
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Integração desconectada",
        description: "A integração foi desconectada com sucesso.",
      })
    }, 1000)
  }

  const getIntegrationsByCategory = (category: string) => {
    if (category === "all") {
      return integrations
    }
    return integrations.filter((integration) => integration.category === category)
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="communication">Comunicação</TabsTrigger>
            <TabsTrigger value="payment">Pagamento</TabsTrigger>
            <TabsTrigger value="marketing">Marketing</TabsTrigger>
            <TabsTrigger value="development">Desenvolvimento</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {integrations.map((integration) => (
              <Card key={integration.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="rounded-md p-2 bg-muted">
                        <integration.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{integration.name}</CardTitle>
                        <CardDescription className="text-xs">
                          {integration.connected ? <>Conectado em {integration.connectedAt}</> : "Não conectado"}
                        </CardDescription>
                      </div>
                    </div>
                    <div>
                      {integration.connected && (
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                          Conectado
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">{integration.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  {integration.connected ? (
                    <>
                      <Button variant="outline" size="sm" onClick={() => handleDisconnect(integration.id)}>
                        Desconectar
                      </Button>
                      <div className="flex items-center space-x-2">
                        <Label htmlFor={`toggle-${integration.id}`} className="text-sm">
                          Ativo
                        </Label>
                        <Switch
                          id={`toggle-${integration.id}`}
                          checked={integration.status === "active"}
                          onCheckedChange={(checked) => handleToggleIntegration(integration.id, checked)}
                        />
                      </div>
                    </>
                  ) : (
                    <Button size="sm" onClick={() => handleConnectIntegration(integration.id)}>
                      Conectar
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {["communication", "payment", "marketing", "development"].map((category) => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {getIntegrationsByCategory(category).map((integration) => (
                <Card key={integration.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="rounded-md p-2 bg-muted">
                          <integration.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{integration.name}</CardTitle>
                          <CardDescription className="text-xs">
                            {integration.connected ? <>Conectado em {integration.connectedAt}</> : "Não conectado"}
                          </CardDescription>
                        </div>
                      </div>
                      <div>
                        {integration.connected && (
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            Conectado
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">{integration.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    {integration.connected ? (
                      <>
                        <Button variant="outline" size="sm" onClick={() => handleDisconnect(integration.id)}>
                          Desconectar
                        </Button>
                        <div className="flex items-center space-x-2">
                          <Label htmlFor={`toggle-${integration.id}-${category}`} className="text-sm">
                            Ativo
                          </Label>
                          <Switch
                            id={`toggle-${integration.id}-${category}`}
                            checked={integration.status === "active"}
                            onCheckedChange={(checked) => handleToggleIntegration(integration.id, checked)}
                          />
                        </div>
                      </>
                    ) : (
                      <Button size="sm" onClick={() => handleConnectIntegration(integration.id)}>
                        Conectar
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Conectar Integração</DialogTitle>
            <DialogDescription>
              Conecte-se com esta integração para expandir as funcionalidades da sua plataforma.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center space-x-4 mb-4">
              {selectedIntegration && (
                <div className="rounded-md p-3 bg-muted">
                  {integrations.find((i) => i.id === selectedIntegration)?.icon && (
                    <div className="h-8 w-8">
                      {(() => {
                        const integration = integrations.find((i) => i.id === selectedIntegration)
                        if (integration) {
                          const Icon = integration.icon
                          return <Icon className="h-8 w-8" />
                        }
                        return null
                      })()}
                    </div>
                  )}
                </div>
              )}
              <div>
                <h3 className="font-medium">
                  {selectedIntegration && integrations.find((i) => i.id === selectedIntegration)?.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedIntegration && integrations.find((i) => i.id === selectedIntegration)?.description}
                </p>
              </div>
            </div>
            <div className="rounded-md border p-4 bg-muted/50">
              <p className="text-sm">
                Ao conectar esta integração, você concede permissão para acessar e modificar dados de acordo com as
                permissões solicitadas.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConnectDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmConnect} disabled={isLoading} className="flex items-center">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Conectando...
                </>
              ) : (
                <>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Prosseguir
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

