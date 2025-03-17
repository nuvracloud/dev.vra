"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ApiIntegrations } from "@/components/integrations/api-integrations"
import { WebhookIntegrations } from "@/components/integrations/webhook-integrations"
import { IntegrationsMarketplace } from "@/components/integrations/integrations-marketplace"

export function IntegrationsTabs() {
  const [activeTab, setActiveTab] = useState("api")

  return (
    <Tabs defaultValue="api" className="w-full" onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="api">Integrações de API</TabsTrigger>
        <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
      </TabsList>
      <TabsContent value="api" className="mt-6">
        <ApiIntegrations />
      </TabsContent>
      <TabsContent value="webhooks" className="mt-6">
        <WebhookIntegrations />
      </TabsContent>
      <TabsContent value="marketplace" className="mt-6">
        <IntegrationsMarketplace />
      </TabsContent>
    </Tabs>
  )
}

