"use client"

import type React from "react"

import { useState } from "react"
import { CreditCard, Plus, Trash2, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

export function PaymentMethods() {
  const [showAddCardDialog, setShowAddCardDialog] = useState(false)
  const [defaultMethod, setDefaultMethod] = useState("card-1")
  const { toast } = useToast()

  // Em uma aplicação real, esses dados viriam de uma API
  const paymentMethods = [
    {
      id: "card-1",
      type: "credit-card",
      brand: "Visa",
      last4: "4242",
      expiry: "12/25",
      isDefault: true,
    },
    {
      id: "card-2",
      type: "credit-card",
      brand: "Mastercard",
      last4: "5555",
      expiry: "10/24",
      isDefault: false,
    },
  ]

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault()
    // Em uma aplicação real, isso enviaria os dados do cartão para a API
    toast({
      title: "Cartão adicionado",
      description: "Seu novo cartão foi adicionado com sucesso.",
    })
    setShowAddCardDialog(false)
  }

  const handleRemoveCard = (cardId: string) => {
    // Em uma aplicação real, isso removeria o cartão da API
    toast({
      title: "Cartão removido",
      description: "O cartão foi removido com sucesso.",
    })
  }

  const handleSetDefaultMethod = (methodId: string) => {
    setDefaultMethod(methodId)
    // Em uma aplicação real, isso atualizaria o método padrão na API
    toast({
      title: "Método padrão atualizado",
      description: "Seu método de pagamento padrão foi atualizado.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Métodos de Pagamento</CardTitle>
            <CardDescription>Gerencie seus métodos de pagamento</CardDescription>
          </div>
          <Dialog open={showAddCardDialog} onOpenChange={setShowAddCardDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Cartão
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Cartão</DialogTitle>
                <DialogDescription>Adicione um novo cartão de crédito para pagamentos futuros.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddCard}>
                <div className="space-y-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="card-number">Número do Cartão</Label>
                    <Input id="card-number" placeholder="0000 0000 0000 0000" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="card-name">Nome no Cartão</Label>
                    <Input id="card-name" placeholder="Nome completo" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="card-expiry">Validade</Label>
                      <Input id="card-expiry" placeholder="MM/AA" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="card-cvc">CVC</Label>
                      <Input id="card-cvc" placeholder="123" required />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setShowAddCardDialog(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Adicionar Cartão</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <RadioGroup value={defaultMethod} onValueChange={handleSetDefaultMethod} className="space-y-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center justify-between space-x-2 rounded-md border p-4">
              <div className="flex items-center space-x-4">
                <RadioGroupItem value={method.id} id={method.id} />
                <Label htmlFor={method.id} className="flex items-center space-x-2 cursor-pointer">
                  <CreditCard className="h-5 w-5" />
                  <div>
                    <p className="font-medium">
                      {method.brand} •••• {method.last4}
                    </p>
                    <p className="text-sm text-muted-foreground">Expira em {method.expiry}</p>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                {method.id === defaultMethod && (
                  <span className="text-xs text-muted-foreground flex items-center">
                    <CheckCircle2 className="mr-1 h-3 w-3 text-green-500" />
                    Padrão
                  </span>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveCard(method.id)}
                  disabled={paymentMethods.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remover</span>
                </Button>
              </div>
            </div>
          ))}
        </RadioGroup>

        {paymentMethods.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Nenhum método de pagamento</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Adicione um método de pagamento para gerenciar sua assinatura.
            </p>
            <Button onClick={() => setShowAddCardDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Cartão
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-6">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Informações de Segurança</h3>
          <p className="text-sm text-muted-foreground">
            Todos os pagamentos são processados de forma segura. Seus dados de cartão são criptografados e nunca
            armazenamos o número completo do cartão.
          </p>
        </div>
      </CardFooter>
    </Card>
  )
}

