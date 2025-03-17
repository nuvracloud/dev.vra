"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Edge,
  type Node,
  type NodeTypes,
  Panel,
} from "reactflow"
import "reactflow/dist/style.css"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"

import { TriggerNode } from "@/components/automations/nodes/trigger-node"
import { ActionNode } from "@/components/automations/nodes/action-node"
import { FilterNode } from "@/components/automations/nodes/filter-node"

// Define custom node types
const nodeTypes: NodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  filter: FilterNode,
}

// Initial nodes and edges
const initialNodes: Node[] = [
  {
    id: "1",
    type: "trigger",
    position: { x: 250, y: 100 },
    data: { label: "Webhook", description: "Quando receber uma requisição HTTP", icon: "webhook" },
  },
]

const initialEdges: Edge[] = []

// Module categories and items
const moduleCategories = [
  {
    id: "triggers",
    name: "Triggers",
    items: [
      { id: "webhook", name: "Webhook", description: "Quando receber uma requisição HTTP", icon: "webhook" },
      { id: "schedule", name: "Agendamento", description: "Executar em intervalos regulares", icon: "schedule" },
      { id: "email", name: "Email Recebido", description: "Quando receber um email", icon: "email" },
      { id: "crm", name: "Novo Lead", description: "Quando um novo lead for criado", icon: "crm" },
    ],
  },
  {
    id: "actions",
    name: "Ações",
    items: [
      { id: "email_send", name: "Enviar Email", description: "Envia um email", icon: "email" },
      { id: "crm_update", name: "Atualizar CRM", description: "Atualiza um registro no CRM", icon: "crm" },
      { id: "slack", name: "Notificação Slack", description: "Envia mensagem no Slack", icon: "slack" },
      { id: "database", name: "Salvar no Banco", description: "Salva dados no banco", icon: "database" },
      { id: "http", name: "Requisição HTTP", description: "Faz uma requisição HTTP", icon: "http" },
    ],
  },
  {
    id: "filters",
    name: "Filtros e Lógica",
    items: [
      { id: "filter", name: "Filtro", description: "Filtra dados com base em condições", icon: "filter" },
      { id: "router", name: "Roteador", description: "Direciona para diferentes caminhos", icon: "router" },
      { id: "delay", name: "Atraso", description: "Adiciona um atraso na execução", icon: "delay" },
      { id: "iterator", name: "Iterador", description: "Itera sobre uma lista de itens", icon: "iterator" },
    ],
  },
  {
    id: "integrations",
    name: "Integrações",
    items: [
      { id: "salesforce", name: "Salesforce", description: "Integração com Salesforce", icon: "salesforce" },
      { id: "mailchimp", name: "Mailchimp", description: "Integração com Mailchimp", icon: "mailchimp" },
      { id: "stripe", name: "Stripe", description: "Integração com Stripe", icon: "stripe" },
      { id: "google", name: "Google Sheets", description: "Integração com Google Sheets", icon: "google" },
    ],
  },
]

export function FlowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [automationName, setAutomationName] = useState("Nova Automação")
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Handle connections between nodes
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges],
  )

  // Handle node selection
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
  }, [])

  // Handle drag and drop from module panel
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      if (reactFlowWrapper.current) {
        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
        const moduleData = JSON.parse(event.dataTransfer.getData("application/reactflow"))

        // Check if the dropped element is valid
        if (typeof moduleData.type === "undefined") {
          return
        }

        const position = {
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        }

        // Create a new node
        const newNode: Node = {
          id: `${Date.now()}`,
          type: moduleData.nodeType,
          position,
          data: {
            label: moduleData.name,
            description: moduleData.description,
            icon: moduleData.icon,
          },
        }

        setNodes((nds) => nds.concat(newNode))
      }
    },
    [setNodes],
  )

  // Handle saving the automation
  const handleSaveAutomation = () => {
    // In a real app, this would save the automation to the backend
    toast({
      title: "Automação salva",
      description: "Sua automação foi salva com sucesso.",
    })
  }

  // Handle module drag start
  const onDragStart = (event: React.DragEvent, moduleData: any, nodeType: string) => {
    const data = { ...moduleData, nodeType }
    event.dataTransfer.setData("application/reactflow", JSON.stringify(data))
    event.dataTransfer.effectAllowed = "move"
  }

  return (
    <div className="flex h-full border rounded-md overflow-hidden">
      {/* Left sidebar - Module panel */}
      <div className="w-64 border-r bg-muted/50">
        <div className="p-4 border-b">
          <Label htmlFor="automation-name">Nome da Automação</Label>
          <Input
            id="automation-name"
            value={automationName}
            onChange={(e) => setAutomationName(e.target.value)}
            className="mt-1"
          />
        </div>
        <Tabs defaultValue="triggers">
          <TabsList className="w-full justify-start rounded-none border-b">
            <TabsTrigger value="triggers" className="flex-1">
              Triggers
            </TabsTrigger>
            <TabsTrigger value="actions" className="flex-1">
              Ações
            </TabsTrigger>
            <TabsTrigger value="filters" className="flex-1">
              Filtros
            </TabsTrigger>
          </TabsList>
          {moduleCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="m-0">
              <ScrollArea className="h-[calc(100vh-350px)]">
                <div className="p-4 grid gap-2">
                  {category.items.map((module) => (
                    <div
                      key={module.id}
                      draggable
                      onDragStart={(event) =>
                        onDragStart(
                          event,
                          module,
                          category.id === "triggers" ? "trigger" : category.id === "filters" ? "filter" : "action",
                        )
                      }
                      className="p-3 rounded-md border bg-card hover:bg-accent cursor-move"
                    >
                      <div className="font-medium text-sm">{module.name}</div>
                      <div className="text-xs text-muted-foreground">{module.description}</div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
        <div className="p-4 border-t">
          <Button onClick={handleSaveAutomation} className="w-full">
            Salvar Automação
          </Button>
        </div>
      </div>

      {/* Main flow builder area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onDragOver={onDragOver}
            onDrop={onDrop}
            nodeTypes={nodeTypes}
            fitView
          >
            <Controls />
            <MiniMap />
            <Background gap={12} size={1} />
            <Panel position="top-right">
              <Button variant="outline" size="sm" onClick={() => setNodes([])}>
                Limpar
              </Button>
            </Panel>
          </ReactFlow>
        </div>
      </div>

      {/* Right sidebar - Node properties */}
      <div
        className={`w-80 border-l bg-muted/50 transition-all ${selectedNode ? "translate-x-0" : "translate-x-full"}`}
      >
        {selectedNode && (
          <Card className="border-0 rounded-none h-full">
            <CardHeader>
              <CardTitle>Propriedades do Nó</CardTitle>
              <CardDescription>{selectedNode.data.label}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="node-name">Nome</Label>
                  <Input
                    id="node-name"
                    value={selectedNode.data.label}
                    onChange={(e) => {
                      const updatedNodes = nodes.map((node) => {
                        if (node.id === selectedNode.id) {
                          return {
                            ...node,
                            data: {
                              ...node.data,
                              label: e.target.value,
                            },
                          }
                        }
                        return node
                      })
                      setNodes(updatedNodes)
                      setSelectedNode({
                        ...selectedNode,
                        data: {
                          ...selectedNode.data,
                          label: e.target.value,
                        },
                      })
                    }}
                  />
                </div>

                {/* Dynamic properties based on node type */}
                {selectedNode.type === "trigger" && (
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label>Tipo de Trigger</Label>
                      <div className="text-sm">{selectedNode.data.description}</div>
                    </div>
                    {selectedNode.data.icon === "webhook" && (
                      <div className="grid gap-2">
                        <Label>URL do Webhook</Label>
                        <div className="flex">
                          <Input value="https://api.exemplo.com/webhook/abc123" readOnly className="rounded-r-none" />
                          <Button variant="secondary" className="rounded-l-none">
                            Copiar
                          </Button>
                        </div>
                      </div>
                    )}
                    {selectedNode.data.icon === "schedule" && (
                      <div className="grid gap-2">
                        <Label>Frequência</Label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground">
                          <option value="15min">A cada 15 minutos</option>
                          <option value="30min">A cada 30 minutos</option>
                          <option value="1hour">A cada hora</option>
                          <option value="daily">Diariamente</option>
                          <option value="weekly">Semanalmente</option>
                        </select>
                      </div>
                    )}
                  </div>
                )}

                {selectedNode.type === "action" && (
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label>Tipo de Ação</Label>
                      <div className="text-sm">{selectedNode.data.description}</div>
                    </div>
                    {selectedNode.data.icon === "email" && (
                      <>
                        <div className="grid gap-2">
                          <Label>Destinatário</Label>
                          <Input placeholder="email@exemplo.com" />
                        </div>
                        <div className="grid gap-2">
                          <Label>Assunto</Label>
                          <Input placeholder="Assunto do email" />
                        </div>
                        <div className="grid gap-2">
                          <Label>Conteúdo</Label>
                          <textarea
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground"
                            placeholder="Conteúdo do email"
                          />
                        </div>
                      </>
                    )}
                    {selectedNode.data.icon === "http" && (
                      <>
                        <div className="grid gap-2">
                          <Label>URL</Label>
                          <Input placeholder="https://api.exemplo.com/endpoint" />
                        </div>
                        <div className="grid gap-2">
                          <Label>Método</Label>
                          <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                            <option value="GET">GET</option>
                            <option value="POST">POST</option>
                            <option value="PUT">PUT</option>
                            <option value="DELETE">DELETE</option>
                          </select>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {selectedNode.type === "filter" && (
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label>Tipo de Filtro</Label>
                      <div className="text-sm">{selectedNode.data.description}</div>
                    </div>
                    <div className="grid gap-2">
                      <Label>Condição</Label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                        <option value="equals">Igual a</option>
                        <option value="not_equals">Diferente de</option>
                        <option value="contains">Contém</option>
                        <option value="greater_than">Maior que</option>
                        <option value="less_than">Menor que</option>
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Valor</Label>
                      <Input placeholder="Valor para comparação" />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

