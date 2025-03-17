"use client"

import { useState } from "react"
import { Check, X, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MercadoPagoCheckout } from "@/components/billing/mercado-pago-checkout"
import { useToast } from "@/hooks/use-toast"

export function BillingPlans() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly")
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const { toast } = useToast()

  // Em uma aplicação real, esses dados viriam de uma API
  const plans = [
    {
      id: "free",
      name: "Gratuito",
      description: "Para usuários individuais e pequenos projetos",
      price: {
        monthly: 0,
        annual: 0,
      },
      features: [
        { name: "1 Agente de IA", included: true },
        { name: "100 Conversas por mês", included: true },
        { name: "1 GB de armazenamento", included: true },
        { name: "Integrações básicas", included: true },
        { name: "Suporte por email", included: true },
        { name: "Automações", included: false },
        { name: "Análise avançada", included: false },
        { name: "Suporte prioritário", included: false },
        { name: "API de acesso", included: false },
        { name: "Personalização avançada", included: false },
      ],
      popular: false,
      current: false,
    },
    {
      id: "pro",
      name: "Pro",
      description: "Para profissionais e equipes pequenas",
      price: {
        monthly: 99.9,
        annual: 79.9,
      },
      features: [
        { name: "5 Agentes de IA", included: true },
        { name: "1.000 Conversas por mês", included: true },
        { name: "10 GB de armazenamento", included: true },
        { name: "Integrações avançadas", included: true },
        { name: "Suporte por email e chat", included: true },
        { name: "Automações", included: true },
        { name: "Análise avançada", included: true },
        { name: "Suporte prioritário", included: false },
        { name: "API de acesso", included: false },
        { name: "Personalização avançada", included: false },
      ],
      popular: true,
      current: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "Para empresas e equipes grandes",
      price: {
        monthly: 299.9,
        annual: 249.9,
      },
      features: [
        { name: "Agentes de IA ilimitados", included: true },
        { name: "Conversas ilimitadas", included: true },
        { name: "100 GB de armazenamento", included: true },
        { name: "Integrações personalizadas", included: true },
        { name: "Suporte 24/7", included: true },
        { name: "Automações avançadas", included: true },
        { name: "Análise avançada com BI", included: true },
        { name: "Suporte prioritário", included: true },
        { name: "API de acesso completo", included: true },
        { name: "Personalização avançada", included: true },
      ],
      popular: false,
      current: false,
    },
  ]

  const handleSelectPlan = (planId: string) => {
    // Verificar se é o plano atual
    const plan = plans.find((p) => p.id === planId)
    if (plan?.current) {
      toast({
        title: "Plano atual",
        description: "Você já está inscrito neste plano.",
      })
      return
    }

    // Verificar se é o plano gratuito
    if (planId === "free") {
      toast({
        title: "Downgrade para plano gratuito",
        description: "Você será redirecionado para confirmar o downgrade para o plano gratuito.",
      })
      return
    }

    // Abrir checkout para planos pagos
    setSelectedPlan(planId)
    setShowCheckoutDialog(true)
  }

  const getDiscountPercentage = (monthly: number, annual: number) => {
    if (monthly === 0) return 0
    const monthlyTotal = monthly * 12
    const annualTotal = annual * 12
    return Math.round(((monthlyTotal - annualTotal) / monthlyTotal) * 100)
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2">
            <span
              className={`text-sm font-medium ${billingCycle === "monthly" ? "text-primary" : "text-muted-foreground"}`}
            >
              Mensal
            </span>
            <Switch
              checked={billingCycle === "annual"}
              onCheckedChange={(checked) => setBillingCycle(checked ? "annual" : "monthly")}
            />
            <span
              className={`text-sm font-medium ${billingCycle === "annual" ? "text-primary" : "text-muted-foreground"}`}
            >
              Anual
            </span>
          </div>
          {billingCycle === "annual" && <Badge variant="secondary">Economize até 20% com pagamento anual</Badge>}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.id} className={`flex flex-col ${plan.popular ? "border-primary shadow-md" : ""}`}>
              {plan.popular && (
                <div className="absolute top-0 right-0 -mt-2 -mr-2">
                  <Badge className="bg-primary text-primary-foreground">Popular</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-6">
                  <p className="text-3xl font-bold">
                    {plan.price[billingCycle] === 0 ? "Grátis" : `R$ ${plan.price[billingCycle].toFixed(2)}`}
                  </p>
                  {plan.price[billingCycle] > 0 && (
                    <p className="text-sm text-muted-foreground">
                      por mês, {billingCycle === "annual" ? "cobrado anualmente" : "cobrado mensalmente"}
                    </p>
                  )}
                  {billingCycle === "annual" && plan.price.monthly > 0 && (
                    <Badge variant="outline" className="mt-2">
                      Economize {getDiscountPercentage(plan.price.monthly, plan.price.annual)}%
                    </Badge>
                  )}
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      {feature.included ? (
                        <Check className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                      ) : (
                        <X className="mr-2 h-4 w-4 text-gray-300 mt-0.5" />
                      )}
                      <span className={feature.included ? "" : "text-muted-foreground"}>{feature.name}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.current ? "outline" : plan.id === "free" ? "secondary" : "default"}
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={plan.current}
                >
                  {plan.current ? "Plano Atual" : plan.id === "free" ? "Fazer Downgrade" : "Selecionar Plano"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Informação</AlertTitle>
          <AlertDescription>
            Todos os planos incluem atualizações gratuitas. Para necessidades específicas, entre em contato com nossa
            equipe de vendas.
          </AlertDescription>
        </Alert>

        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Comparação de Recursos</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Recurso</th>
                  <th className="text-center py-3 px-4">Gratuito</th>
                  <th className="text-center py-3 px-4">Pro</th>
                  <th className="text-center py-3 px-4">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Agentes de IA</td>
                  <td className="text-center py-3 px-4">1</td>
                  <td className="text-center py-3 px-4">5</td>
                  <td className="text-center py-3 px-4">Ilimitados</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Conversas mensais</td>
                  <td className="text-center py-3 px-4">100</td>
                  <td className="text-center py-3 px-4">1.000</td>
                  <td className="text-center py-3 px-4">Ilimitadas</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Armazenamento</td>
                  <td className="text-center py-3 px-4">1 GB</td>
                  <td className="text-center py-3 px-4">10 GB</td>
                  <td className="text-center py-3 px-4">100 GB</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Integrações</td>
                  <td className="text-center py-3 px-4">Básicas</td>
                  <td className="text-center py-3 px-4">Avançadas</td>
                  <td className="text-center py-3 px-4">Personalizadas</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Suporte</td>
                  <td className="text-center py-3 px-4">Email</td>
                  <td className="text-center py-3 px-4">Email e Chat</td>
                  <td className="text-center py-3 px-4">24/7</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Automações</td>
                  <td className="text-center py-3 px-4">
                    <X className="h-4 w-4 text-gray-300 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="h-4 w-4 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="h-4 w-4 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Análise avançada</td>
                  <td className="text-center py-3 px-4">
                    <X className="h-4 w-4 text-gray-300 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="h-4 w-4 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="h-4 w-4 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">API de acesso</td>
                  <td className="text-center py-3 px-4">
                    <X className="h-4 w-4 text-gray-300 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <X className="h-4 w-4 text-gray-300 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="h-4 w-4 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Personalização avançada</td>
                  <td className="text-center py-3 px-4">
                    <X className="h-4 w-4 text-gray-300 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <X className="h-4 w-4 text-gray-300 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="h-4 w-4 text-green-500 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Dialog open={showCheckoutDialog} onOpenChange={setShowCheckoutDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Checkout</DialogTitle>
            <DialogDescription>Complete o pagamento para ativar seu plano.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <MercadoPagoCheckout
              plan={plans.find((p) => p.id === selectedPlan)}
              billingCycle={billingCycle}
              onSuccess={() => {
                setShowCheckoutDialog(false)
                toast({
                  title: "Pagamento realizado com sucesso",
                  description: "Seu plano foi atualizado. Aproveite os novos recursos!",
                })
              }}
              onCancel={() => {
                setShowCheckoutDialog(false)
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

