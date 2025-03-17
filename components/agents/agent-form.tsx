"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Save, Trash2, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Mock data - in a real app, this would come from an API
const agentData = {
  "1": {
    id: "1",
    name: "Assistente de Vendas",
    description: "Agente especializado em responder dúvidas sobre produtos e auxiliar no processo de vendas.",
    instructions:
      "Você é um assistente de vendas especializado em produtos de tecnologia. Seja sempre cordial e tente entender as necessidades do cliente antes de recomendar um produto. Forneça informações detalhadas sobre especificações, preços e disponibilidade quando solicitado.",
    model: "gpt-4",
    temperature: 0.7,
    maxTokens: 2048,
    status: "active",
    avatar: "/placeholder.svg?height=80&width=80",
    workspace: "Meu Workspace",
    welcomeMessage: "Olá! Sou o assistente de vendas virtual. Como posso ajudar você hoje?",
    knowledgeBase: [
      { id: "kb1", name: "Catálogo de Produtos 2023", type: "pdf" },
      { id: "kb2", name: "Perguntas Frequentes", type: "text" },
    ],
    integrations: {
      elevenlabs: {
        enabled: true,
        voiceId: "voice1",
      },
      whatsapp: {
        enabled: true,
        phoneNumber: "+5511987654321",
      },
    },
  },
  "2": {
    id: "2",
    name: "Suporte Técnico",
    description: "Agente para resolver problemas técnicos e fornecer suporte aos usuários.",
    instructions:
      "Você é um agente de suporte técnico especializado em software e hardware. Ajude os usuários a diagnosticar e resolver problemas técnicos de forma clara e passo a passo. Quando não souber a resposta, indique onde o usuário pode encontrar mais informações.",
    model: "gpt-3.5-turbo",
    temperature: 0.5,
    maxTokens: 1024,
    status: "active",
    avatar: "/placeholder.svg?height=80&width=80",
    workspace: "Meu Workspace",
    welcomeMessage: "Olá! Sou o assistente de suporte técnico. Como posso ajudar você hoje?",
    knowledgeBase: [
      { id: "kb3", name: "Manual Técnico v2.0", type: "pdf" },
      { id: "kb4", name: "Guia de Solução de Problemas", type: "text" },
    ],
    integrations: {
      elevenlabs: {
        enabled: false,
        voiceId: null,
      },
      whatsapp: {
        enabled: true,
        phoneNumber: "+5511987654322",
      },
    },
  },
  "3": {
    id: "3",
    name: "Assistente de RH",
    description: "Agente para responder dúvidas sobre políticas de RH, benefícios e processos internos.",
    instructions:
      "Você é um assistente de RH. Responda perguntas sobre políticas da empresa, benefícios, férias, licenças e outros assuntos relacionados a recursos humanos. Seja discreto e profissional, e sempre verifique se o usuário tem permissão para acessar informações sensíveis.",
    model: "gpt-4",
    temperature: 0.3,
    maxTokens: 1024,
    status: "inactive",
    avatar: "/placeholder.svg?height=80&width=80",
    workspace: "Acme Inc.",
    welcomeMessage: "Olá! Sou o assistente virtual de RH. Como posso ajudar você hoje?",
    knowledgeBase: [
      { id: "kb5", name: "Manual do Funcionário 2023", type: "pdf" },
      { id: "kb6", name: "Políticas de RH", type: "text" },
    ],
    integrations: {
      elevenlabs: {
        enabled: false,
        voiceId: null,
      },
      whatsapp: {
        enabled: false,
        phoneNumber: null,
      },
    },
  },
}

// Mock data for voice options
const voiceOptions = [
  { id: "voice1", name: "Voz Masculina 1" },
  { id: "voice2", name: "Voz Feminina 1" },
  { id: "voice3", name: "Voz Masculina 2" },
  { id: "voice4", name: "Voz Feminina 2" },
]

// Mock data for workspaces
const workspaces = [
  { id: "ws1", name: "Meu Workspace" },
  { id: "ws2", name: "Acme Inc." },
  { id: "ws3", name: "Startup X" },
]

const formSchema = z.object({
  name: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
  description: z.string().min(10, {
    message: "A descrição deve ter pelo menos 10 caracteres.",
  }),
  instructions: z.string().min(20, {
    message: "As instruções devem ter pelo menos 20 caracteres.",
  }),
  model: z.string({
    required_error: "Por favor, selecione um modelo.",
  }),
  temperature: z.number().min(0).max(1),
  maxTokens: z.number().min(1).max(4096),
  status: z.enum(["active", "inactive"]),
  workspace: z.string({
    required_error: "Por favor, selecione um workspace.",
  }),
  welcomeMessage: z.string().min(10, {
    message: "A mensagem de boas-vindas deve ter pelo menos 10 caracteres.",
  }),
  elevenlabsEnabled: z.boolean().default(false),
  elevenlabsVoiceId: z.string().optional(),
  whatsappEnabled: z.boolean().default(false),
  whatsappPhoneNumber: z.string().optional(),
})

export function AgentForm({ agentId }: { agentId?: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("basic")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [knowledgeBase, setKnowledgeBase] = useState<{ id: string; name: string; type: string }[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      instructions: "",
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      maxTokens: 1024,
      status: "active",
      workspace: "Meu Workspace",
      welcomeMessage: "Olá! Como posso ajudar você hoje?",
      elevenlabsEnabled: false,
      elevenlabsVoiceId: "",
      whatsappEnabled: false,
      whatsappPhoneNumber: "",
    },
  })

  useEffect(() => {
    if (agentId && agentData[agentId]) {
      const agent = agentData[agentId]
      form.reset({
        name: agent.name,
        description: agent.description,
        instructions: agent.instructions,
        model: agent.model,
        temperature: agent.temperature,
        maxTokens: agent.maxTokens,
        status: agent.status,
        workspace: agent.workspace,
        welcomeMessage: agent.welcomeMessage,
        elevenlabsEnabled: agent.integrations.elevenlabs.enabled,
        elevenlabsVoiceId: agent.integrations.elevenlabs.voiceId || "",
        whatsappEnabled: agent.integrations.whatsapp.enabled,
        whatsappPhoneNumber: agent.integrations.whatsapp.phoneNumber || "",
      })
      setKnowledgeBase(agent.knowledgeBase)
    }
  }, [agentId, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      // In a real app, you would save the agent data and handle errors
      toast({
        title: agentId ? "Agente atualizado" : "Agente criado",
        description: agentId ? "As alterações foram salvas com sucesso." : "O novo agente foi criado com sucesso.",
      })
      router.push("/agents")
    }, 1000)
  }

  const handleDeleteAgent = () => {
    // In a real app, this would be an API call
    toast({
      title: "Agente excluído",
      description: "O agente foi excluído com sucesso.",
    })
    setShowDeleteDialog(false)
    router.push("/agents")
  }

  const handleAddKnowledgeBase = () => {
    // In a real app, this would open a file picker or similar
    const newId = `kb${Math.floor(Math.random() * 1000)}`
    setKnowledgeBase([...knowledgeBase, { id: newId, name: "Novo Documento", type: "pdf" }])
  }

  const handleRemoveKnowledgeBase = (id: string) => {
    setKnowledgeBase(knowledgeBase.filter((item) => item.id !== id))
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
              <TabsTrigger value="advanced">Configurações Avançadas</TabsTrigger>
              <TabsTrigger value="knowledge">Base de Conhecimento</TabsTrigger>
              <TabsTrigger value="integrations">Integrações</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Básicas</CardTitle>
                  <CardDescription>Configure as informações básicas do seu agente de IA.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={
                          agentId && agentData[agentId]
                            ? agentData[agentId].avatar
                            : "/placeholder.svg?height=80&width=80"
                        }
                        alt="Avatar do agente"
                        className="h-20 w-20 rounded-full"
                      />
                      <Button size="icon" variant="outline" className="absolute bottom-0 right-0 h-6 w-6 rounded-full">
                        <Upload className="h-3 w-3" />
                        <span className="sr-only">Alterar avatar</span>
                      </Button>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Avatar do Agente</h3>
                      <p className="text-xs text-muted-foreground">Recomendado: 256x256px, formato PNG ou JPG</p>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Agente</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Assistente de Vendas" {...field} />
                        </FormControl>
                        <FormDescription>Este é o nome que será exibido para os usuários.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Ex: Agente especializado em responder dúvidas sobre produtos e auxiliar no processo de vendas."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Uma breve descrição do propósito do agente.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="workspace"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Workspace</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um workspace" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {workspaces.map((workspace) => (
                              <SelectItem key={workspace.id} value={workspace.name}>
                                {workspace.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>O workspace ao qual este agente pertence.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Status do Agente</FormLabel>
                          <FormDescription>Ative ou desative este agente.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value === "active"}
                            onCheckedChange={(checked) => field.onChange(checked ? "active" : "inactive")}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações Avançadas</CardTitle>
                  <CardDescription>Configure os parâmetros avançados do seu agente de IA.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="instructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instruções do Sistema</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Ex: Você é um assistente de vendas especializado em produtos de tecnologia..."
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Instruções detalhadas sobre como o agente deve se comportar e responder.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="welcomeMessage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mensagem de Boas-vindas</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Ex: Olá! Sou o assistente virtual. Como posso ajudar você hoje?"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Mensagem que será exibida no início de cada conversa.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator className="my-4" />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Configurações do Modelo</h3>

                    <FormField
                      control={form.control}
                      name="model"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Modelo de IA</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um modelo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                              <SelectItem value="gpt-4">GPT-4</SelectItem>
                              <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                              <SelectItem value="claude-2">Claude 2</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>O modelo de IA que será utilizado pelo agente.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="temperature"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Temperatura: {field.value}</FormLabel>
                          <FormControl>
                            <Input
                              type="range"
                              min="0"
                              max="1"
                              step="0.1"
                              {...field}
                              onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            Controla a aleatoriedade das respostas. Valores mais baixos resultam em respostas mais
                            determinísticas.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="maxTokens"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Máximo de Tokens</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max="4096"
                              {...field}
                              onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>Limite máximo de tokens para cada resposta do agente.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="knowledge" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Base de Conhecimento</CardTitle>
                  <CardDescription>
                    Adicione documentos e informações para o seu agente utilizar nas respostas.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-md border">
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium">Documentos ({knowledgeBase.length})</h3>
                        <Button onClick={handleAddKnowledgeBase} variant="outline" size="sm">
                          <Upload className="mr-2 h-4 w-4" />
                          Adicionar Documento
                        </Button>
                      </div>
                    </div>

                    {knowledgeBase.length === 0 ? (
                      <div className="flex h-[200px] items-center justify-center rounded-md border-t border-dashed">
                        <div className="text-center">
                          <h3 className="text-sm font-medium">Nenhum documento adicionado</h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            Adicione documentos para melhorar as respostas do seu agente.
                          </p>
                          <Button onClick={handleAddKnowledgeBase} className="mt-4" size="sm">
                            <Upload className="mr-2 h-4 w-4" />
                            Adicionar Documento
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="divide-y">
                        {knowledgeBase.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-4">
                            <div className="flex items-center space-x-2">
                              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                {item.type === "pdf" ? (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <path d="M9 15v-2h6v2" />
                                    <path d="M11 13v4" />
                                    <path d="M9 19h6" />
                                  </svg>
                                ) : (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="16" y1="13" x2="8" y2="13" />
                                    <line x1="16" y1="17" x2="8" y2="17" />
                                    <line x1="10" y1="9" x2="8" y2="9" />
                                  </svg>
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium">{item.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {item.type === "pdf" ? "Documento PDF" : "Texto"}
                                </p>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveKnowledgeBase(item.id)}>
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Remover documento</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integrations" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Integrações</CardTitle>
                  <CardDescription>Configure integrações com serviços externos.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">ElevenLabs (Síntese de Voz)</h3>

                    <FormField
                      control={form.control}
                      name="elevenlabsEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Habilitar ElevenLabs</FormLabel>
                            <FormDescription>
                              Permite que seu agente utilize síntese de voz de alta qualidade.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {form.watch("elevenlabsEnabled") && (
                      <FormField
                        control={form.control}
                        name="elevenlabsVoiceId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Voz</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione uma voz" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {voiceOptions.map((voice) => (
                                  <SelectItem key={voice.id} value={voice.id}>
                                    {voice.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>Selecione a voz que será utilizada pelo seu agente.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">WhatsApp</h3>

                    <FormField
                      control={form.control}
                      name="whatsappEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Habilitar WhatsApp</FormLabel>
                            <FormDescription>Permite que seu agente seja acessado via WhatsApp.</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {form.watch("whatsappEnabled") && (
                      <FormField
                        control={form.control}
                        name="whatsappPhoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Número de Telefone</FormLabel>
                            <FormControl>
                              <Input placeholder="+5511987654321" {...field} />
                            </FormControl>
                            <FormDescription>Número de telefone que será utilizado para o WhatsApp.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between">
            <div>
              {agentId && (
                <Button type="button" variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir Agente
                </Button>
              )}
            </div>
            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={() => router.push("/agents")}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>Salvando...</>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {agentId ? "Salvar Alterações" : "Criar Agente"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>

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

