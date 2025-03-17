"use client"

import { useState } from "react"
import { Copy, Eye, EyeOff, Plus, RefreshCw, Trash2, ExternalLink, Check, Key } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
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
import { useToast } from "@/hooks/use-toast"

// Mock data for API keys
const apiKeys = [
  {
    id: "key1",
    name: "Produção",
    key: "sk_prod_a1b2c3d4e5f6g7h8i9j0",
    createdAt: "2023-10-15T10:30:00",
    lastUsed: "2023-11-14T15:45:00",
    status: "active",
    permissions: ["read", "write"],
    expiresAt: null,
  },
  {
    id: "key2",
    name: "Desenvolvimento",
    key: "sk_dev_z9y8x7w6v5u4t3s2r1q0",
    createdAt: "2023-09-20T14:20:00",
    lastUsed: "2023-11-10T09:15:00",
    status: "active",
    permissions: ["read", "write"],
    expiresAt: "2024-09-20T14:20:00",
  },
  {
    id: "key3",
    name: "Teste",
    key: "sk_test_j9i8h7g6f5e4d3c2b1a0",
    createdAt: "2023-11-01T08:45:00",
    lastUsed: null,
    status: "inactive",
    permissions: ["read"],
    expiresAt: "2023-12-01T08:45:00",
  },
]

// Mock data for API credentials
const apiCredentials = [
  {
    id: "cred1",
    name: "WhatsApp Business API",
    type: "oauth2",
    status: "connected",
    connectedAt: "2023-10-10T11:20:00",
    expiresAt: "2024-10-10T11:20:00",
  },
  {
    id: "cred2",
    name: "Salesforce CRM",
    type: "oauth2",
    status: "connected",
    connectedAt: "2023-09-15T16:30:00",
    expiresAt: "2024-09-15T16:30:00",
  },
  {
    id: "cred3",
    name: "Stripe Payments",
    type: "api_key",
    status: "connected",
    connectedAt: "2023-11-05T09:45:00",
    expiresAt: null,
  },
  {
    id: "cred4",
    name: "HubSpot",
    type: "oauth2",
    status: "expired",
    connectedAt: "2023-05-20T14:10:00",
    expiresAt: "2023-11-20T14:10:00",
  },
]

export function ApiIntegrations() {
  const [showNewKeyDialog, setShowNewKeyDialog] = useState(false)
  const [showDeleteKeyDialog, setShowDeleteKeyDialog] = useState(false)
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null)
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [newKeyName, setNewKeyName] = useState("")
  const [newKeyPermissions, setNewKeyPermissions] = useState<string[]>(["read"])
  const [newKeyExpiration, setNewKeyExpiration] = useState("never")
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const { toast } = useToast()

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys((prev) => ({
      ...prev,
      [keyId]: !prev[keyId],
    }))
  }

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key)
    setCopiedKey(key)

    toast({
      title: "Chave copiada",
      description: "A chave de API foi copiada para a área de transferência.",
    })

    setTimeout(() => {
      setCopiedKey(null)
    }, 2000)
  }

  const handleCreateKey = () => {
    // In a real app, this would create a new API key
    toast({
      title: "Chave de API criada",
      description: "A nova chave de API foi criada com sucesso.",
    })

    setShowNewKeyDialog(false)
    setNewKeyName("")
    setNewKeyPermissions(["read"])
    setNewKeyExpiration("never")
  }

  const handleDeleteKey = () => {
    // In a real app, this would delete the API key
    toast({
      title: "Chave de API excluída",
      description: "A chave de API foi excluída com sucesso.",
    })

    setShowDeleteKeyDialog(false)
    setKeyToDelete(null)
  }

  const handleReconnect = (credentialId: string) => {
    // In a real app, this would reconnect the API credential
    toast({
      title: "Reconexão iniciada",
      description: "O processo de reconexão foi iniciado. Você será redirecionado para a página de autenticação.",
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

  const formatKeyLastUsed = (dateString: string | null) => {
    if (!dateString) return "Nunca utilizada"

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

  return (
    <Tabs defaultValue="keys" className="w-full">
      <TabsList className="w-full max-w-md mx-auto mb-6">
        <TabsTrigger value="keys" className="flex-1">
          Chaves de API
        </TabsTrigger>
        <TabsTrigger value="credentials" className="flex-1">
          Credenciais
        </TabsTrigger>
      </TabsList>

      <TabsContent value="keys">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Chaves de API</h3>
            <p className="text-sm text-muted-foreground">
              Gerencie suas chaves de API para acessar nossa plataforma programaticamente.
            </p>
          </div>
          <Dialog open={showNewKeyDialog} onOpenChange={setShowNewKeyDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Chave
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Chave de API</DialogTitle>
                <DialogDescription>
                  Crie uma nova chave de API para acessar nossa plataforma programaticamente. Guarde esta chave em um
                  local seguro, pois não será possível visualizá-la novamente.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="key-name">Nome da Chave</Label>
                  <Input
                    id="key-name"
                    placeholder="Ex: Produção, Desenvolvimento, etc."
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Permissões</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="read-permission"
                      checked={newKeyPermissions.includes("read")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setNewKeyPermissions((prev) => [...prev, "read"])
                        } else {
                          setNewKeyPermissions((prev) => prev.filter((p) => p !== "read"))
                        }
                      }}
                    />
                    <Label htmlFor="read-permission">Leitura</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="write-permission"
                      checked={newKeyPermissions.includes("write")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setNewKeyPermissions((prev) => [...prev, "write"])
                        } else {
                          setNewKeyPermissions((prev) => prev.filter((p) => p !== "write"))
                        }
                      }}
                    />
                    <Label htmlFor="write-permission">Escrita</Label>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="key-expiration">Expiração</Label>
                  <Select value={newKeyExpiration} onValueChange={setNewKeyExpiration}>
                    <SelectTrigger id="key-expiration">
                      <SelectValue placeholder="Selecione um período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Nunca</SelectItem>
                      <SelectItem value="30days">30 dias</SelectItem>
                      <SelectItem value="90days">90 dias</SelectItem>
                      <SelectItem value="1year">1 ano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowNewKeyDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateKey} disabled={!newKeyName.trim()}>
                  Criar Chave
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {apiKeys.map((apiKey) => (
            <Card key={apiKey.id} className={apiKey.status === "inactive" ? "opacity-70" : ""}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-lg">{apiKey.name}</CardTitle>
                    {apiKey.status === "inactive" && (
                      <Badge variant="outline" className="text-muted-foreground">
                        Inativa
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={apiKey.status === "active"}
                      onCheckedChange={(checked) => {
                        // In a real app, this would update the API key status
                        toast({
                          title: checked ? "Chave ativada" : "Chave desativada",
                          description: `A chave de API "${apiKey.name}" foi ${checked ? "ativada" : "desativada"} com sucesso.`,
                        })
                      }}
                    />
                    <AlertDialog
                      open={showDeleteKeyDialog && keyToDelete === apiKey.id}
                      onOpenChange={(open) => {
                        setShowDeleteKeyDialog(open)
                        if (!open) setKeyToDelete(null)
                      }}
                    >
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => setKeyToDelete(apiKey.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                          <span className="sr-only">Excluir chave</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir Chave de API</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir esta chave de API? Esta ação não pode ser desfeita. Todos os
                            aplicativos que utilizam esta chave deixarão de funcionar.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteKey}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <CardDescription>
                  Criada em {formatDate(apiKey.createdAt)}
                  {apiKey.expiresAt && ` • Expira em ${formatDate(apiKey.expiresAt)}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Key className="h-4 w-4 text-muted-foreground" />
                    <div className="relative flex-1">
                      <Input
                        value={showKeys[apiKey.id] ? apiKey.key : "•".repeat(24)}
                        readOnly
                        className="pr-20 font-mono text-sm"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                        >
                          {showKeys[apiKey.id] ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                          <span className="sr-only">{showKeys[apiKey.id] ? "Ocultar chave" : "Mostrar chave"}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleCopyKey(apiKey.key)}
                        >
                          {copiedKey === apiKey.key ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                          <span className="sr-only">Copiar chave</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {apiKey.permissions.includes("read") && <Badge variant="secondary">Leitura</Badge>}
                    {apiKey.permissions.includes("write") && <Badge variant="secondary">Escrita</Badge>}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <p className="text-xs text-muted-foreground">Última utilização: {formatKeyLastUsed(apiKey.lastUsed)}</p>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-8 rounded-lg border p-4 bg-muted/50">
          <h4 className="font-medium mb-2">Documentação da API</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Consulte nossa documentação para aprender como utilizar nossa API e integrar com seus sistemas.
          </p>
          <Button variant="outline" className="text-sm" asChild>
            <a href="#" target="_blank" rel="noopener noreferrer">
              Ver Documentação
              <ExternalLink className="ml-2 h-3.5 w-3.5" />
            </a>
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="credentials">
        <div className="mb-6">
          <h3 className="text-lg font-medium">Credenciais de API</h3>
          <p className="text-sm text-muted-foreground">Gerencie suas conexões com serviços externos.</p>
        </div>

        <div className="space-y-4">
          {apiCredentials.map((credential) => (
            <Card key={credential.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{credential.name}</CardTitle>
                    <CardDescription>{credential.type === "oauth2" ? "OAuth 2.0" : "Chave de API"}</CardDescription>
                  </div>
                  <Badge
                    variant={credential.status === "connected" ? "outline" : "destructive"}
                    className={credential.status === "connected" ? "bg-green-100 text-green-800 border-green-200" : ""}
                  >
                    {credential.status === "connected" ? "Conectado" : "Expirado"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <p>Conectado em: {formatDate(credential.connectedAt)}</p>
                  {credential.expiresAt && <p>Expira em: {formatDate(credential.expiresAt)}</p>}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // In a real app, this would disconnect the API credential
                    toast({
                      title: "Desconectado",
                      description: `A conexão com ${credential.name} foi removida com sucesso.`,
                    })
                  }}
                >
                  Desconectar
                </Button>
                {credential.status === "expired" && (
                  <Button size="sm" onClick={() => handleReconnect(credential.id)}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reconectar
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-8">
          <h4 className="font-medium mb-4">Conectar Novo Serviço</h4>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-base">Slack</CardTitle>
                <CardDescription>Integre com o Slack para notificações e comandos.</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="outline" className="w-full" size="sm">
                  Conectar
                </Button>
              </CardFooter>
            </Card>

            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-base">Google Calendar</CardTitle>
                <CardDescription>Sincronize eventos e agendamentos.</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="outline" className="w-full" size="sm">
                  Conectar
                </Button>
              </CardFooter>
            </Card>

            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-base">Zendesk</CardTitle>
                <CardDescription>Integre tickets e atendimento ao cliente.</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="outline" className="w-full" size="sm">
                  Conectar
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}

