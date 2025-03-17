"use client"

import { useState } from "react"
import { AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
import { useToast } from "@/hooks/use-toast"

export function CurrentSubscription() {
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const { toast } = useToast()

  // Em uma aplicação real, esses dados viriam de uma API
  const subscription = {
    plan: "Pro",
    status: "active",
    billingCycle: "monthly",
    nextBillingDate: "15/12/2023",
    amount: "R$ 99,90",
    usageStats: {
      agents: {
        used: 2,
        total: 5,
        percentage: 40,
      },
      conversations: {
        used: 750,
        total: 1000,
        percentage: 75,
      },
      storage: {
        used: 2.5,
        total: 10,
        percentage: 25,
      },
    },
  }

  const handleCancelSubscription = () => {
    // Em uma aplicação real, isso seria uma chamada de API
    toast({
      title: "Assinatura cancelada",
      description: "Sua assinatura foi cancelada com sucesso. Você ainda terá acesso até o final do período atual.",
    })
    setShowCancelDialog(false)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Sua Assinatura</CardTitle>
            <CardDescription>Detalhes da sua assinatura atual</CardDescription>
          </div>
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            Ativo
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Plano</p>
            <p className="text-xl font-bold">{subscription.plan}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Ciclo de Cobrança</p>
            <p className="text-xl font-bold capitalize">
              {subscription.billingCycle === "monthly" ? "Mensal" : "Anual"}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Próxima Cobrança</p>
            <p className="text-xl font-bold">{subscription.nextBillingDate}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Valor</p>
            <p className="text-xl font-bold">{subscription.amount}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Uso Atual</h3>
          <div className="grid gap-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-sm font-medium">Agentes</p>
                <p className="text-sm text-muted-foreground">
                  {subscription.usageStats.agents.used} de {subscription.usageStats.agents.total}
                </p>
              </div>
              <Progress value={subscription.usageStats.agents.percentage} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-sm font-medium">Conversas Mensais</p>
                <p className="text-sm text-muted-foreground">
                  {subscription.usageStats.conversations.used} de {subscription.usageStats.conversations.total}
                </p>
              </div>
              <Progress value={subscription.usageStats.conversations.percentage} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-sm font-medium">Armazenamento</p>
                <p className="text-sm text-muted-foreground">
                  {subscription.usageStats.storage.used} GB de {subscription.usageStats.storage.total} GB
                </p>
              </div>
              <Progress value={subscription.usageStats.storage.percentage} className="h-2" />
            </div>
          </div>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Informação</AlertTitle>
          <AlertDescription>
            Sua assinatura será renovada automaticamente em {subscription.nextBillingDate}. Você pode cancelar a
            qualquer momento.
          </AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Alterar Plano</Button>
        <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <DialogTrigger asChild>
            <Button variant="destructive">Cancelar Assinatura</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancelar Assinatura</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja cancelar sua assinatura? Você perderá acesso a recursos premium após o término do
                período atual.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Atenção</AlertTitle>
                <AlertDescription>
                  O cancelamento é irreversível. Você precisará assinar novamente para recuperar o acesso aos recursos
                  premium.
                </AlertDescription>
              </Alert>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                Voltar
              </Button>
              <Button variant="destructive" onClick={handleCancelSubscription}>
                Confirmar Cancelamento
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}

