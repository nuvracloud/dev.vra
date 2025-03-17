"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConversationsList } from "@/components/crm/conversations-list"
import { ContactsList } from "@/components/crm/contacts-list"
import { LeadsKanban } from "@/components/crm/leads-kanban"

export function CrmTabs() {
  const [activeTab, setActiveTab] = useState("conversations")

  return (
    <Tabs defaultValue="conversations" className="w-full" onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="conversations">Conversas</TabsTrigger>
        <TabsTrigger value="contacts">Contatos</TabsTrigger>
        <TabsTrigger value="kanban">Kanban de Leads</TabsTrigger>
      </TabsList>
      <TabsContent value="conversations" className="mt-6">
        <ConversationsList />
      </TabsContent>
      <TabsContent value="contacts" className="mt-6">
        <ContactsList />
      </TabsContent>
      <TabsContent value="kanban" className="mt-6">
        <LeadsKanban />
      </TabsContent>
    </Tabs>
  )
}

