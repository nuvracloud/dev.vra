import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { BillingPlans } from "@/components/billing/billing-plans"
import { CurrentSubscription } from "@/components/billing/current-subscription"
import { InvoiceHistory } from "@/components/billing/invoice-history"
import { PaymentMethods } from "@/components/billing/payment-methods"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Assinatura | AI Agent Platform",
  description: "Gerencie sua assinatura e planos",
}

export default function BillingPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Assinatura" text="Gerencie sua assinatura, planos e métodos de pagamento." />
      <div className="space-y-6">
        <CurrentSubscription />

        <Tabs defaultValue="plans">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="plans">Planos</TabsTrigger>
            <TabsTrigger value="invoices">Faturas</TabsTrigger>
            <TabsTrigger value="payment">Métodos de Pagamento</TabsTrigger>
          </TabsList>
          <TabsContent value="plans" className="space-y-4 pt-4">
            <BillingPlans />
          </TabsContent>
          <TabsContent value="invoices" className="space-y-4 pt-4">
            <InvoiceHistory />
          </TabsContent>
          <TabsContent value="payment" className="space-y-4 pt-4">
            <PaymentMethods />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  )
}

