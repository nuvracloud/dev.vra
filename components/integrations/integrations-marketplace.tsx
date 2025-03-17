"use client"

import { useState } from "react"
import { Search, Check, Star, Download, Settings } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

// Mock data for integrations
const integrations = [
  {
    id: "int1",
    name: "Salesforce",
    description: "Sincronize contatos, leads e oportunidades com o Salesforce CRM.",
    logo: "/placeholder.svg?height=80&width=80",
    category: "crm",
    rating: 4.8,
    reviews: 124,
    installed: true,
    popular: true,
    featured: true,
    developer: "Salesforce Inc.",
    price: "Gratuito",
    lastUpdated: "2023-10-15",
    version: "2.3.0",
  },
  {
    id: "int2",
    name: "Stripe",
    description: "Processe pagamentos e gerencie assinaturas com o Stripe.",
    logo: "/placeholder.svg?height=80&width=80",
    category: "payment",
    rating: 4.9,
    reviews: 98,
    installed: false,
    popular: true,
    featured: true,
    developer: "Stripe Inc.",
    price: "Gratuito",
    lastUpdated: "2023-11-02",
    version: "1.5.2",
  },
  {
    id: "int3",
    name: "Mailchimp",
    description: "Integre suas campanhas de email marketing com o Mailchimp.",
    logo: "/placeholder.svg?height=80&width=80",
    category: "marketing",
    rating: 4.5,
    reviews: 76,
    installed: false,
    popular: true,
    featured: false,
    developer: "Mailchimp",
    price: "Gratuito",
    lastUpdated: "2023-09-20",
    version: "3.1.0",
  },
  {
    id: "int4",
    name: "Google Calendar",
    description: "Sincronize eventos e agendamentos com o Google Calendar.",
    logo: "/placeholder.svg?height=80&width=80",
    category: "productivity",
    rating: 4.7,
    reviews: 112,
    installed: true,
    popular: true,
    featured: false,
    developer: "Google LLC",
    price: "Gratuito",
    lastUpdated: "2023-10-28",
    version: "2.0.1",
  },
  {
    id: "int5",
    name: "Zendesk",
    description: "Integre tickets e atendimento ao cliente com o Zendesk.",
    logo: "/placeholder.svg?height=80&width=80",
    category: "support",
    rating: 4.6,
    reviews: 89,
    installed: false,
    popular: false,
    featured: true,
    developer: "Zendesk Inc.",
    price: "Gratuito",
    lastUpdated: "2023-11-05",
    version: "1.8.3",
  },
  {
    id: "int6",
    name: "Slack",
    description: "Receba notificações e interaja com sua equipe no Slack.",
    logo: "/placeholder.svg?height=80&width=80",
    category: "communication",
    rating: 4.8,
    reviews: 145,
    installed: false,
    popular: true,
    featured: true,
    developer: "Slack Technologies",
    price: "Gratuito",
    lastUpdated: "2023-10-10",
    version: "2.2.0",
  },
  {
    id: "int7",
    name: "HubSpot",
    description: "Sincronize contatos, leads e campanhas com o HubSpot.",
    logo: "/placeholder.svg?height=80&width=80",
    category: "crm",
    rating: 4.7,
    reviews: 92,
    installed: false,
    popular: true,
    featured: false,
    developer: "HubSpot Inc.",
    price: "Gratuito",
    lastUpdated: "2023-09-15",
    version: "1.9.5",
  },
  {
    id: "int8",
    name: "Zapier",
    description: "Conecte sua plataforma com mais de 3.000 aplicativos.",
    logo: "/placeholder.svg?height=80&width=80",
    category: "automation",
    rating: 4.9,
    reviews: 178,
    installed: false,
    popular: true,
    featured: true,
    developer: "Zapier Inc.",
    price: "Gratuito",
    lastUpdated: "2023-11-01",
    version: "3.0.0",
  },
  {
    id: "int9",
    name: "Twilio",
    description: "Envie SMS e faça chamadas telefônicas com o Twilio.",
    logo: "/placeholder.svg?height=80&width=80",
    category: "communication",
    rating: 4.6,
    reviews: 87,
    installed: false,
    popular: false,
    featured: false,
    developer: "Twilio Inc.",
    price: "Gratuito",
    lastUpdated: "2023-10-05",
    version: "1.7.2",
  },
  {
    id: "int10",
    name: "Google Analytics",
    description: "Acompanhe o desempenho da sua plataforma com o Google Analytics.",
    logo: "/placeholder.svg?height=80&width=80",
    category: "analytics",
    rating: 4.8,
    reviews: 103,
    installed: false,
    popular: true,
    featured: false,
    developer: "Google LLC",
    price: "Gratuito",
    lastUpdated: "2023-09-28",
    version: "2.1.0",
  },
  {
    id: "int11",
    name: "Shopify",
    description: "Integre sua loja online Shopify com a plataforma.",
    logo: "/placeholder.svg?height=80&width=80",
    category: "ecommerce",
    rating: 4.7,
    reviews: 95,
    installed: false,
    popular: true,
    featured: false,
    developer: "Shopify Inc.",
    price: "Gratuito",
    lastUpdated: "2023-10-20",
    version: "1.6.0",
  },
  {
    id: "int12",
    name: "Intercom",
    description: "Gerencie conversas com clientes usando o Intercom.",
    logo: "/placeholder.svg?height=80&width=80",
    category: "support",
    rating: 4.5,
    reviews: 82,
    installed: false,
    popular: false,
    featured: true,
    developer: "Intercom Inc.",
    price: "Gratuito",
    lastUpdated: "2023-11-08",
    version: "2.0.5",
  },
]

// Categories for filtering
const categories = [
  { id: "all", name: "Todas Categorias" },
  { id: "crm", name: "CRM" },
  { id: "payment", name: "Pagamentos" },
  { id: "marketing", name: "Marketing" },
  { id: "productivity", name: "Produtividade" },
  { id: "support", name: "Suporte" },
  { id: "communication", name: "Comunicação" },
  { id: "automation", name: "Automação" },
  { id: "analytics", name: "Analytics" },
  { id: "ecommerce", name: "E-commerce" },
]

export function IntegrationsMarketplace() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("popular")
  const [showInstalled, setShowInstalled] = useState(false)
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null)
  const { toast } = useToast()

  const handleInstallIntegration = (integrationId: string) => {
    // In a real app, this would install the integration
    toast({
      title: "Integração instalada",
      description: "A integração foi instalada com sucesso.",
    })

    // Close the dialog if open
    setSelectedIntegration(null)
  }

  const handleUninstallIntegration = (integrationId: string) => {
    // In a real app, this would uninstall the integration
    toast({
      title: "Integração desinstalada",
      description: "A integração foi desinstalada com sucesso.",
    })

    // Close the dialog if open
    setSelectedIntegration(null)
  }

  const handleConfigureIntegration = (integrationId: string) => {
    // In a real app, this would navigate to the integration configuration page
    toast({
      title: "Configurando integração",
      description: "Redirecionando para a página de configuração da integração.",
    })
  }

  // Filter and sort integrations
  const filteredIntegrations = integrations
    .filter((integration) => {
      // Search filter
      const matchesSearch =
        integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        integration.description.toLowerCase().includes(searchQuery.toLowerCase())

      // Category filter
      const matchesCategory = categoryFilter === "all" || integration.category === categoryFilter

      // Installed filter
      const matchesInstalled = !showInstalled || integration.installed

      return matchesSearch && matchesCategory && matchesInstalled
    })
    .sort((a, b) => {
      // Sort by selected option
      if (sortBy === "popular") {
        return b.reviews - a.reviews
      } else if (sortBy === "rating") {
        return b.rating - a.rating
      } else if (sortBy === "newest") {
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      }
      return 0
    })

  const selectedIntegrationData = selectedIntegration ? integrations.find((i) => i.id === selectedIntegration) : null

  return (
    <div>
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar integrações..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Mais Populares</SelectItem>
                <SelectItem value="rating">Melhor Avaliadas</SelectItem>
                <SelectItem value="newest">Mais Recentes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full max-w-md mx-auto">
            <TabsTrigger value="all" onClick={() => setShowInstalled(false)}>
              Todas
            </TabsTrigger>
            <TabsTrigger
              value="featured"
              onClick={() => {
                setShowInstalled(false)
                setCategoryFilter("all")
                setSearchQuery("")
              }}
            >
              Destaque
            </TabsTrigger>
            <TabsTrigger value="installed" onClick={() => setShowInstalled(true)}>
              Instaladas
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {filteredIntegrations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-6 mb-4">
            <Search className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">Nenhuma integração encontrada</h3>
          <p className="text-muted-foreground mt-2 max-w-md">
            Não encontramos nenhuma integração com os filtros selecionados. Tente ajustar seus critérios de busca.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredIntegrations.map((integration) => (
            <Card
              key={integration.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setSelectedIntegration(integration.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-md overflow-hidden">
                      <img
                        src={integration.logo || "/placeholder.svg"}
                        alt={integration.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-base">{integration.name}</CardTitle>
                      <CardDescription className="text-xs">{integration.developer}</CardDescription>
                    </div>
                  </div>
                  {integration.installed && (
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                      Instalado
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">{integration.description}</p>
                <div className="flex items-center mt-2">
                  <div className="flex items-center">
                    <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-medium ml-1">{integration.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-xs text-muted-foreground mx-1">•</span>
                  <span className="text-xs text-muted-foreground">{integration.reviews} avaliações</span>
                  <span className="text-xs text-muted-foreground mx-1">•</span>
                  <span className="text-xs text-muted-foreground">{integration.price}</span>
                </div>
              </CardContent>
              <CardFooter>
                {integration.installed ? (
                  <Button variant="outline" className="w-full" size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Configurar
                  </Button>
                ) : (
                  <Button className="w-full" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Instalar
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {selectedIntegrationData && (
        <Dialog open={!!selectedIntegration} onOpenChange={(open) => !open && setSelectedIntegration(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-md overflow-hidden">
                  <img
                    src={selectedIntegrationData.logo || "/placeholder.svg"}
                    alt={selectedIntegrationData.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <DialogTitle>{selectedIntegrationData.name}</DialogTitle>
                  <DialogDescription>
                    {selectedIntegrationData.developer} • Versão {selectedIntegrationData.version}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-sm text-muted-foreground">{selectedIntegrationData.description}</p>

              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-medium ml-1">{selectedIntegrationData.rating.toFixed(1)}</span>
                  <span className="text-xs text-muted-foreground ml-1">({selectedIntegrationData.reviews})</span>
                </div>
                <Badge variant="outline">
                  {categories.find((c) => c.id === selectedIntegrationData.category)?.name ||
                    selectedIntegrationData.category}
                </Badge>
                <span className="text-sm">{selectedIntegrationData.price}</span>
              </div>

              <div className="rounded-md border p-4">
                <h4 className="text-sm font-medium mb-2">O que esta integração faz</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <span>Sincroniza dados automaticamente entre plataformas</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <span>Configuração simples sem necessidade de código</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <span>Suporte para mapeamento de campos personalizados</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <span>Atualizações em tempo real</span>
                  </li>
                </ul>
              </div>

              <div className="text-sm">
                <p className="text-muted-foreground">
                  Última atualização: {new Date(selectedIntegrationData.lastUpdated).toLocaleDateString()}
                </p>
              </div>
            </div>
            <DialogFooter>
              {selectedIntegrationData.installed ? (
                <div className="flex w-full space-x-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleUninstallIntegration(selectedIntegrationData.id)}
                  >
                    Desinstalar
                  </Button>
                  <Button className="flex-1" onClick={() => handleConfigureIntegration(selectedIntegrationData.id)}>
                    <Settings className="mr-2 h-4 w-4" />
                    Configurar
                  </Button>
                </div>
              ) : (
                <Button className="w-full" onClick={() => handleInstallIntegration(selectedIntegrationData.id)}>
                  <Download className="mr-2 h-4 w-4" />
                  Instalar Integração
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

