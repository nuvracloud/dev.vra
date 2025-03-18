"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Bot, Send, Paperclip, MoreVertical, Mic, MicOff } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data - in a real app, this would come from an API
const agentData: Record<string, {
  id: string
  name: string
  avatar: string
  welcomeMessage: string
}> = {
  "1": {
    id: "1",
    name: "Assistente de Vendas",
    avatar: "/placeholder.svg?height=80&width=80",
    welcomeMessage: "Olá! Sou o assistente de vendas virtual. Como posso ajudar você hoje?",
  },
  "2": {
    id: "2",
    name: "Suporte Técnico",
    avatar: "/placeholder.svg?height=80&width=80",
    welcomeMessage: "Olá! Sou o assistente de suporte técnico. Como posso ajudar você hoje?",
  },
  "3": {
    id: "3",
    name: "Assistente de RH",
    avatar: "/placeholder.svg?height=80&width=80",
    welcomeMessage: "Olá! Sou o assistente virtual de RH. Como posso ajudar você hoje?",
  },
}

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export function AgentChat({ agentId }: { agentId: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const agent = agentData[agentId]

  useEffect(() => {
    // Add welcome message when component mounts
    if (agent) {
      setMessages([
        {
          id: "welcome",
          content: agent.welcomeMessage,
          role: "assistant",
          timestamp: new Date(),
        },
      ])
    }
  }, [agent])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: `user-${messages.length + 1}`,
      content: input,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Focus input after sending
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)

    // Simulate API call for agent response
    setTimeout(
      () => {
        const assistantMessage: Message = {
          id: `assistant-${messages.length + 2}`,
          content: getRandomResponse(),
          role: "assistant",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, assistantMessage])
        setIsLoading(false)
      },
      1500, // Fixed delay instead of random
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // In a real app, this would start/stop voice recording
  }

  const getRandomResponse = () => {
    const responses = [
      "Claro, posso ajudar com isso! Poderia me fornecer mais detalhes?",
      "Entendi sua solicitação. Baseado nas informações que tenho, recomendo que você considere as seguintes opções...",
      "Obrigado pela pergunta. De acordo com minha base de conhecimento, a resposta é...",
      "Interessante questão! Vamos analisar isso passo a passo...",
      "Estou processando sua solicitação. Com base nos dados disponíveis, posso informar que...",
      "Excelente pergunta! Deixe-me verificar as informações mais recentes sobre isso...",
    ]

    return responses[Math.floor(Math.random() * responses.length)]
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (!agent) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <Bot className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium">Agente não encontrado</h3>
            <p className="text-muted-foreground mt-2">O agente solicitado não existe ou foi removido.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col h-[calc(100vh-220px)]">
      <CardHeader className="border-b px-4 py-3">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={agent.avatar} alt={agent.name} />
            <AvatarFallback>{agent.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-lg">{agent.name}</CardTitle>
          <div className="ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Mais opções</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Opções</DropdownMenuLabel>
                <DropdownMenuItem>Limpar conversa</DropdownMenuItem>
                <DropdownMenuItem>Exportar conversa</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Configurações do agente</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex ${message.role === "user" ? "flex-row-reverse" : "flex-row"} max-w-[80%]`}>
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={agent.avatar} alt={agent.name} />
                    <AvatarFallback>{agent.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                )}
                <div>
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <p
                    className={`text-xs text-muted-foreground mt-1 ${message.role === "user" ? "text-right" : "text-left"}`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
                {message.role === "user" && (
                  <Avatar className="h-8 w-8 ml-2">
                    <AvatarFallback>EU</AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex flex-row max-w-[80%]">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={agent.avatar} alt={agent.name} />
                  <AvatarFallback>{agent.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="rounded-lg px-4 py-2 bg-muted">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" />
                      <div
                        className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                      <div
                        className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" className="shrink-0">
            <Paperclip className="h-4 w-4" />
            <span className="sr-only">Anexar arquivo</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={`shrink-0 ${isRecording ? "bg-red-100 text-red-500 border-red-200" : ""}`}
            onClick={toggleRecording}
          >
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            <span className="sr-only">{isRecording ? "Parar gravação" : "Iniciar gravação"}</span>
          </Button>
          <Input
            ref={inputRef}
            placeholder="Digite sua mensagem..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!input.trim() || isLoading} className="shrink-0">
            <Send className="h-4 w-4" />
            <span className="sr-only">Enviar mensagem</span>
          </Button>
        </div>
      </div>
    </Card>
  )
}

