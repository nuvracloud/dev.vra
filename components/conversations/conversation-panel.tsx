"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import {
  ArrowLeft,
  MoreHorizontal,
  Send,
  Paperclip,
  Mic,
  MicOff,
  User,
  Bot,
  Phone,
  Video,
  Smile,
  ImageIcon,
  FileText,
  PanelRight,
  PanelRightClose,
  Mail,
  MessageSquare,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

// Mock data - in a real app, this would come from an API
const conversationsData = {
  "1": {
    id: "1",
    contact: {
      id: "c1",
      name: "João Silva",
      email: "joao@exemplo.com",
      phone: "+5511987654321",
      avatar: "/placeholder.svg?height=40&width=40",
      company: "Acme Inc.",
      tags: ["cliente", "premium"],
      lastSeen: "Agora",
      status: "online",
    },
    messages: [
      {
        id: "m1",
        content: "Olá, gostaria de saber mais sobre os planos de assinatura.",
        timestamp: "2023-11-15T10:23:00",
        sender: "contact",
        status: "read",
      },
      {
        id: "m2",
        content:
          "Olá João! Claro, temos vários planos disponíveis. Você está procurando para uso pessoal ou empresarial?",
        timestamp: "2023-11-15T10:25:00",
        sender: "user",
        status: "read",
      },
      {
        id: "m3",
        content: "Empresarial. Temos uma equipe de 15 pessoas e precisamos de recursos avançados.",
        timestamp: "2023-11-15T10:28:00",
        sender: "contact",
        status: "read",
      },
      {
        id: "m4",
        content:
          "Perfeito! Para equipes desse tamanho, recomendo nosso plano Business. Ele inclui todos os recursos premium, suporte prioritário e até 20 usuários. Custa R$ 299,90 por mês, mas podemos oferecer um desconto de 10% para pagamento anual.",
        timestamp: "2023-11-15T10:30:00",
        sender: "user",
        status: "read",
      },
      {
        id: "m5",
        content: "Isso parece interessante. Vocês oferecem um período de teste?",
        timestamp: "2023-11-15T10:32:00",
        sender: "contact",
        status: "read",
      },
      {
        id: "m6",
        content:
          "Sim, oferecemos um período de teste gratuito de 14 dias para que você possa experimentar todos os recursos. Posso configurar isso para você hoje?",
        timestamp: "2023-11-15T10:35:00",
        sender: "user",
        status: "read",
      },
      {
        id: "m7",
        content: "Perfeito! Sim, gostaria de iniciar o teste. Como procedemos?",
        timestamp: "2023-11-15T10:38:00",
        sender: "contact",
        status: "unread",
      },
    ],
    channel: "whatsapp",
    assignedTo: {
      id: "a1",
      name: "Maria",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    priority: "high",
    status: "active",
  },
  "2": {
    id: "2",
    contact: {
      id: "c2",
      name: "Ana Souza",
      email: "ana@exemplo.com",
      phone: "+5521987654321",
      avatar: "/placeholder.svg?height=40&width=40",
      company: "Tech Solutions",
      tags: ["lead", "trial"],
      lastSeen: "5 min atrás",
      status: "online",
    },
    messages: [
      {
        id: "m1",
        content: "Estou tendo problemas para acessar minha conta.",
        timestamp: "2023-11-14T14:10:00",
        sender: "contact",
        status: "read",
      },
      {
        id: "m2",
        content: "Olá Ana, sinto muito pelo inconveniente. Pode me dizer qual erro está aparecendo?",
        timestamp: "2023-11-14T14:12:00",
        sender: "user",
        status: "read",
      },
      {
        id: "m3",
        content: "Aparece 'credenciais inválidas', mas tenho certeza que estou usando a senha correta.",
        timestamp: "2023-11-14T14:15:00",
        sender: "contact",
        status: "read",
      },
      {
        id: "m4",
        content:
          "Entendi. Vou resetar sua senha temporariamente. Você receberá um email com instruções para criar uma nova senha. Isso deve resolver o problema.",
        timestamp: "2023-11-14T14:18:00",
        sender: "user",
        status: "read",
      },
      {
        id: "m5",
        content: "Obrigado pelo suporte, resolveu meu problema!",
        timestamp: "2023-11-14T14:30:00",
        sender: "contact",
        status: "read",
      },
    ],
    channel: "website",
    assignedTo: {
      id: "a2",
      name: "Carlos",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    priority: "normal",
    status: "active",
  },
  "3": {
    id: "3",
    contact: {
      id: "c3",
      name: "Pedro Oliveira",
      email: "pedro@exemplo.com",
      phone: "+5531987654321",
      avatar: "/placeholder.svg?height=40&width=40",
      company: "Startup X",
      tags: ["prospect"],
      lastSeen: "1 hora atrás",
      status: "away",
    },
    messages: [
      {
        id: "m1",
        content: "Olá, vi a demonstração do produto de vocês e fiquei interessado.",
        timestamp: "2023-11-14T09:15:00",
        sender: "contact",
        status: "read",
      },
      {
        id: "m2",
        content: "Olá Pedro, obrigado pelo interesse! Tem alguma dúvida específica sobre o produto?",
        timestamp: "2023-11-14T09:20:00",
        sender: "user",
        status: "read",
      },
      {
        id: "m3",
        content: "Sim, gostaria de saber se vocês têm integração com o sistema que usamos atualmente.",
        timestamp: "2023-11-14T09:25:00",
        sender: "contact",
        status: "read",
      },
      {
        id: "m4",
        content: "Qual sistema vocês utilizam? Temos integrações com vários sistemas populares.",
        timestamp: "2023-11-14T09:30:00",
        sender: "user",
        status: "read",
      },
      {
        id: "m5",
        content: "Usamos o SistemaTech para gerenciamento de projetos.",
        timestamp: "2023-11-14T09:35:00",
        sender: "contact",
        status: "read",
      },
      {
        id: "m6",
        content: "Estamos verificando a compatibilidade e retornaremos em breve.",
        timestamp: "2023-11-14T09:40:00",
        sender: "user",
        status: "read",
      },
      {
        id: "m7",
        content: "Quando vocês vão lançar a nova funcionalidade que foi mencionada no webinar?",
        timestamp: "2023-11-14T10:15:00",
        sender: "contact",
        status: "unread",
      },
      {
        id: "m8",
        content: "E também gostaria de saber se vocês oferecem desconto para startups.",
        timestamp: "2023-11-14T10:16:00",
        sender: "contact",
        status: "unread",
      },
      {
        id: "m9",
        content: "Aliás, vocês têm algum material que explique melhor os casos de uso?",
        timestamp: "2023-11-14T10:17:00",
        sender: "contact",
        status: "unread",
      },
    ],
    channel: "email",
    assignedTo: null,
    priority: "normal",
    status: "active",
  },
}

// Mock data for quick replies
const quickReplies = [
  {
    id: "qr1",
    title: "Saudação",
    content: "Olá! Como posso ajudar você hoje?",
  },
  {
    id: "qr2",
    title: "Agradecimento",
    content: "Obrigado por entrar em contato conosco. Estamos à disposição para ajudar.",
  },
  {
    id: "qr3",
    title: "Despedida",
    content: "Foi um prazer ajudar. Se precisar de mais alguma coisa, estamos à disposição.",
  },
  {
    id: "qr4",
    title: "Informações de Contato",
    content:
      "Para mais informações, você pode nos contatar pelo telefone (11) 1234-5678 ou pelo email suporte@exemplo.com.",
  },
]

// Mock data for emojis
const emojis = ["😊", "👍", "🙏", "❤️", "😂", "🎉", "👋", "🤔", "👀", "✅", "⭐", "🔥", "💯", "🚀"]

interface ConversationPanelProps {
  conversationId: string
  onBack: () => void
  onToggleContactInfo: () => void
  showContactInfo: boolean
}

export function ConversationPanel({
  conversationId,
  onBack,
  onToggleContactInfo,
  showContactInfo,
}: ConversationPanelProps) {
  const [input, setInput] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { toast } = useToast()

  const conversation = conversationsData[conversationId]

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversation?.messages])

  useEffect(() => {
    // Focus input when conversation changes
    inputRef.current?.focus()
  }, [conversationId])

  if (!conversation) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium">Conversa não encontrada</h3>
          <p className="text-muted-foreground mt-2">A conversa solicitada não existe ou foi removida.</p>
          <Button onClick={onBack} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>
      </div>
    )
  }

  const handleSendMessage = () => {
    if (!input.trim()) return

    // In a real app, this would send the message to the API
    toast({
      title: "Mensagem enviada",
      description: "Sua mensagem foi enviada com sucesso.",
    })

    setInput("")

    // Focus input after sending
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // In a real app, this would start/stop voice recording
  }

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatMessageDate = (timestamp: string) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Hoje"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Ontem"
    } else {
      return date.toLocaleDateString()
    }
  }

  const getMessageGroups = () => {
    const groups: { date: string; messages: typeof conversation.messages }[] = []
    let currentDate = ""
    let currentGroup: typeof conversation.messages = []

    conversation.messages.forEach((message) => {
      const messageDate = new Date(message.timestamp).toDateString()

      if (messageDate !== currentDate) {
        if (currentGroup.length > 0) {
          groups.push({
            date: currentDate,
            messages: currentGroup,
          })
        }
        currentDate = messageDate
        currentGroup = [message]
      } else {
        currentGroup.push(message)
      }
    })

    if (currentGroup.length > 0) {
      groups.push({
        date: currentDate,
        messages: currentGroup,
      })
    }

    return groups
  }

  const handleAssignToAgent = () => {
    // In a real app, this would assign the conversation to an agent
    toast({
      title: "Conversa atribuída",
      description: "A conversa foi atribuída ao agente com sucesso.",
    })
  }

  const handleTransferConversation = () => {
    // In a real app, this would transfer the conversation
    toast({
      title: "Conversa transferida",
      description: "A conversa foi transferida com sucesso.",
    })
  }

  const handleCloseConversation = () => {
    // In a real app, this would close the conversation
    toast({
      title: "Conversa fechada",
      description: "A conversa foi fechada com sucesso.",
    })
  }

  const handleAddQuickReply = (content: string) => {
    setInput(content)
    inputRef.current?.focus()
  }

  const handleAddEmoji = (emoji: string) => {
    setInput((prev) => prev + emoji)
    inputRef.current?.focus()
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Voltar</span>
            </Button>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={conversation.contact.avatar} alt={conversation.contact.name} />
                  <AvatarFallback>{conversation.contact.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div
                  className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${
                    conversation.contact.status === "online"
                      ? "bg-green-500"
                      : conversation.contact.status === "away"
                        ? "bg-yellow-500"
                        : "bg-gray-400"
                  }`}
                />
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="font-medium">{conversation.contact.name}</h2>
                  <Badge variant="outline" className="h-5 flex items-center space-x-1 text-xs">
                    {conversation.channel === "whatsapp" ? (
                      <Phone className="h-3 w-3" />
                    ) : conversation.channel === "email" ? (
                      <Mail className="h-3 w-3" />
                    ) : (
                      <MessageSquare className="h-3 w-3" />
                    )}
                    <span>{conversation.channel}</span>
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {conversation.contact.status === "online"
                    ? "Online"
                    : conversation.contact.status === "away"
                      ? "Ausente"
                      : "Visto por último: " + conversation.contact.lastSeen}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Phone className="h-4 w-4" />
                    <span className="sr-only">Ligar</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Ligar</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Video className="h-4 w-4" />
                    <span className="sr-only">Videochamada</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Videochamada</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant={showContactInfo ? "default" : "ghost"} size="icon" onClick={onToggleContactInfo}>
                    {showContactInfo ? <PanelRightClose className="h-4 w-4" /> : <PanelRight className="h-4 w-4" />}
                    <span className="sr-only">Informações do contato</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Informações do contato</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Mais opções</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuItem onClick={handleAssignToAgent}>
                  <Bot className="mr-2 h-4 w-4" />
                  Atribuir a um agente
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleTransferConversation}>
                  <User className="mr-2 h-4 w-4" />
                  Transferir conversa
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleCloseConversation}>Fechar conversa</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        {getMessageGroups().map((group, groupIndex) => (
          <div key={groupIndex} className="mb-6">
            <div className="flex justify-center mb-4">
              <Badge variant="outline" className="bg-background">
                {formatMessageDate(group.messages[0].timestamp)}
              </Badge>
            </div>

            {group.messages.map((message, messageIndex) => {
              const isUser = message.sender === "user"
              const showAvatar = messageIndex === 0 || group.messages[messageIndex - 1].sender !== message.sender

              return (
                <div key={message.id} className={`flex mb-4 ${isUser ? "justify-end" : "justify-start"}`}>
                  <div className={`flex max-w-[75%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
                    {!isUser && showAvatar ? (
                      <Avatar className="h-8 w-8 mr-2 mt-1">
                        <AvatarImage src={conversation.contact.avatar} alt={conversation.contact.name} />
                        <AvatarFallback>{conversation.contact.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    ) : !isUser && !showAvatar ? (
                      <div className="w-10 mr-2" />
                    ) : null}

                    <div>
                      <div
                        className={`rounded-lg px-4 py-2 ${isUser ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                      <div
                        className={`flex items-center mt-1 text-xs text-muted-foreground ${isUser ? "justify-end" : "justify-start"}`}
                      >
                        <span>{formatMessageTime(message.timestamp)}</span>
                        {isUser && (
                          <span className="ml-1">
                            {message.status === "sent" ? "✓" : message.status === "delivered" ? "✓✓" : "✓✓"}
                          </span>
                        )}
                      </div>
                    </div>

                    {isUser && showAvatar ? (
                      <Avatar className="h-8 w-8 ml-2 mt-1">
                        {conversation.assignedTo ? (
                          <>
                            <AvatarImage src={conversation.assignedTo.avatar} alt={conversation.assignedTo.name} />
                            <AvatarFallback>
                              {conversation.assignedTo.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </>
                        ) : (
                          <AvatarFallback>EU</AvatarFallback>
                        )}
                      </Avatar>
                    ) : isUser && !showAvatar ? (
                      <div className="w-10 ml-2" />
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>
        ))}

        {isTyping && (
          <div className="flex mb-4 justify-start">
            <div className="flex max-w-[75%]">
              <Avatar className="h-8 w-8 mr-2 mt-1">
                <AvatarImage src={conversation.contact.avatar} alt={conversation.contact.name} />
                <AvatarFallback>{conversation.contact.name.substring(0, 2).toUpperCase()}</AvatarFallback>
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
      </ScrollArea>

      <div className="border-t p-3">
        <div className="flex items-center space-x-2 mb-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                Respostas Rápidas
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Respostas Rápidas</h4>
                <div className="grid gap-2">
                  {quickReplies.map((reply) => (
                    <Button
                      key={reply.id}
                      variant="outline"
                      className="justify-start h-auto py-2"
                      onClick={() => handleAddQuickReply(reply.content)}
                    >
                      <div className="text-left">
                        <div className="font-medium text-xs">{reply.title}</div>
                        <div className="text-xs text-muted-foreground truncate">{reply.content}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button variant="outline" size="sm">
            <Bot className="mr-2 h-4 w-4" />
            Sugerir Resposta
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Ações
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                Enviar Artigo
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ImageIcon className="mr-2 h-4 w-4" />
                Enviar Imagem
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Transferir Conversa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex space-x-2">
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" className="shrink-0">
              <Paperclip className="h-4 w-4" />
              <span className="sr-only">Anexar arquivo</span>
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0">
                  <Smile className="h-4 w-4" />
                  <span className="sr-only">Emojis</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="grid grid-cols-7 gap-2">
                  {emojis.map((emoji) => (
                    <Button
                      key={emoji}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleAddEmoji(emoji)}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <Button
              variant="outline"
              size="icon"
              className={`shrink-0 ${isRecording ? "bg-red-100 text-red-500 border-red-200" : ""}`}
              onClick={toggleRecording}
            >
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              <span className="sr-only">{isRecording ? "Parar gravação" : "Iniciar gravação"}</span>
            </Button>
          </div>

          <div className="relative flex-1">
            <Textarea
              ref={inputRef}
              placeholder="Digite sua mensagem..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[40px] resize-none pr-10"
              rows={1}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim()}
              size="icon"
              className="absolute right-1 top-1 h-8 w-8"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Enviar mensagem</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

