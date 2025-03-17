"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileSettings } from "./profile-settings"
import { AccountSettings } from "./account-settings"
import { SecuritySettings } from "./security-settings"
import { NotificationSettings } from "./notification-settings"
import { AppearanceSettings } from "./appearance-settings"
import { ApiSettings } from "./api-settings"
import { IntegrationSettings } from "./integration-settings"

export function SettingsTabs() {
  return (
    <Tabs defaultValue="profile" className="space-y-4">
      <TabsList className="grid grid-cols-2 md:grid-cols-7 lg:grid-cols-7">
        <TabsTrigger value="profile">Perfil</TabsTrigger>
        <TabsTrigger value="account">Conta</TabsTrigger>
        <TabsTrigger value="security">Segurança</TabsTrigger>
        <TabsTrigger value="notifications">Notificações</TabsTrigger>
        <TabsTrigger value="appearance">Aparência</TabsTrigger>
        <TabsTrigger value="api">API</TabsTrigger>
        <TabsTrigger value="integrations">Integrações</TabsTrigger>
      </TabsList>
      <TabsContent value="profile" className="space-y-4">
        <ProfileSettings />
      </TabsContent>
      <TabsContent value="account" className="space-y-4">
        <AccountSettings />
      </TabsContent>
      <TabsContent value="security" className="space-y-4">
        <SecuritySettings />
      </TabsContent>
      <TabsContent value="notifications" className="space-y-4">
        <NotificationSettings />
      </TabsContent>
      <TabsContent value="appearance" className="space-y-4">
        <AppearanceSettings />
      </TabsContent>
      <TabsContent value="api" className="space-y-4">
        <ApiSettings />
      </TabsContent>
      <TabsContent value="integrations" className="space-y-4">
        <IntegrationSettings />
      </TabsContent>
    </Tabs>
  )
}

