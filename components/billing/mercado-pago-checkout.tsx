"use client"

import type React from "react"

import { useState } from "react"
import { CreditCard, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

interface MercadoPagoCheckoutProps {
  plan: any
  billingCycle: "monthly" | "annual"
  onSuccess: () => void
  onCancel: () => void
}

export function MercadoPagoCheckout({ plan, billingCycle, onSuccess, onCancel }: MercadoPagoCheckoutProps) {
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvc, setCardCvc] = useState("")
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulando processamento de pagamento
    setTimeout(() => {
      setIsProcessing(false)
      onSuccess()
    }, 2000)
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")

    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }

    return value
  }

  const calculateTotal = () => {
    if (!plan) return 0
    const price = plan.price[billingCycle]
    return billingCycle === "monthly" ? price : price * 12
  }

  if (!plan) return null

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="font-medium">Resumo do Pedido</h3>
        <div className="rounded-md border p-4">
          <div className="flex justify-between mb-2">
            <span>Plano {plan.name}</span>
            <span>R$ {plan.price[billingCycle].toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground mb-4">
            <span>Cobrança {billingCycle === "monthly" ? "mensal" : "anual"}</span>
            <span>{billingCycle === "annual" ? "x12" : ""}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-medium">
            <span>Total</span>
            <span>R$ {calculateTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="credit-card" onValueChange={setPaymentMethod}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="credit-card">Cartão de Crédito</TabsTrigger>
          <TabsTrigger value="pix">PIX</TabsTrigger>
        </TabsList>
        <TabsContent value="credit-card" className="space-y-4 pt-4">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="card-number">Número do Cartão</Label>
                <Input
                  id="card-number"
                  placeholder="0000 0000 0000 0000"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="card-name">Nome no Cartão</Label>
                <Input
                  id="card-name"
                  placeholder="Nome completo"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="card-expiry">Validade</Label>
                  <Input
                    id="card-expiry"
                    placeholder="MM/AA"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                    maxLength={5}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="card-cvc">CVC</Label>
                  <Input
                    id="card-cvc"
                    placeholder="123"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value.replace(/[^0-9]/g, ""))}
                    maxLength={3}
                    required
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <img src="/placeholder.svg?height=30&width=40" alt="Visa" className="h-8" />
                <img src="/placeholder.svg?height=30&width=40" alt="Mastercard" className="h-8" />
                <img src="/placeholder.svg?height=30&width=40" alt="American Express" className="h-8" />
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isProcessing}>
                {isProcessing ? "Processando..." : "Pagar Agora"}
              </Button>
            </div>
          </form>
        </TabsContent>
        <TabsContent value="pix" className="space-y-4 pt-4">
          <div className="flex flex-col items-center space-y-4">
            <div className="border rounded-md p-4 w-48 h-48 flex items-center justify-center">
              <img src="/placeholder.svg?height=150&width=150" alt="Código PIX" className="w-full h-full" />
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Escaneie o código QR com seu aplicativo bancário</p>
              <p className="text-sm font-medium">Código PIX:</p>
              <div className="flex items-center justify-center mt-1">
                <code className="bg-muted px-2 py-1 rounded text-sm">
                  00020126580014br.gov.bcb.pix0136a629532e-7693-4846-b028-f142082d7b230217Pagamento
                  Plano5204000053039865802BR5923AI Agent Platform6009Sao Paulo62070503***6304E2CA
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 ml-1"
                  onClick={() => {
                    toast({
                      title: "Código copiado",
                      description: "O código PIX foi copiado para a área de transferência.",
                    })
                  }}
                >
                  <CreditCard className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Importante</AlertTitle>
              <AlertDescription>
                Após o pagamento, seu plano será atualizado automaticamente em até 5 minutos.
              </AlertDescription>
            </Alert>
            <div className="flex justify-between w-full">
              <Button variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  setIsProcessing(true)
                  setTimeout(() => {
                    setIsProcessing(false)
                    onSuccess()
                  }, 2000)
                }}
                disabled={isProcessing}
              >
                {isProcessing ? "Verificando..." : "Já Paguei"}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

