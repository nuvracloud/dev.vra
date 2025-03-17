"use client"

import type React from "react"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export function NotificationSettings() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [notifications, setNotifications] = useState({
    email: {
      marketing: true,
      social: true,
      security: true,
      updates: false,
    },
    push: {
      marketing: false,
      social: true,
      security: true,
      updates: true,
    },
    sms: {
      marketing: false,
      social: false,
      security: true,
      updates: false,
    },
  })

  const handleToggleNotification = (category: string, type: string, checked: boolean) => {
    setNotifications((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [type]: checked,
      },
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulando uma chamada de API
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Preferências atualizadas",
        description: "Suas preferências de notificação foram atualizadas com sucesso.",
      })
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Notificações por Email</CardTitle>
            <CardDescription>Gerencie quais emails você deseja receber.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-marketing">Marketing</Label>
                <p className="text-sm text-muted-foreground">Receba emails sobre novos produtos, recursos e ofertas.</p>
              </div>
              <Switch
                id="email-marketing"
                checked={notifications.email.marketing}
                onCheckedChange={(checked) => handleToggleNotification("email", "marketing", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-social">Social</Label>
                <p className="text-sm text-muted-foreground">
                  Receba emails sobre atividades sociais, como menções e comentários.
                </p>
              </div>
              <Switch
                id="email-social"
                checked={notifications.email.social}
                onCheckedChange={(checked) => handleToggleNotification("email", "social", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-security">Segurança</Label>
                <p className="text-sm text-muted-foreground">
                  Receba emails sobre atividades de segurança, como logins e alterações de senha.
                </p>
              </div>
              <Switch
                id="email-security"
                checked={notifications.email.security}
                onCheckedChange={(checked) => handleToggleNotification("email", "security", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-updates">Atualizações</Label>
                <p className="text-sm text-muted-foreground">
                  Receba emails sobre atualizações da plataforma e novos recursos.
                </p>
              </div>
              <Switch
                id="email-updates"
                checked={notifications.email.updates}
                onCheckedChange={(checked) => handleToggleNotification("email", "updates", checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Notificações Push</CardTitle>
            <CardDescription>Gerencie quais notificações push você deseja receber.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-marketing">Marketing</Label>
                <p className="text-sm text-muted-foreground">
                  Receba notificações push sobre novos produtos, recursos e ofertas.
                </p>
              </div>
              <Switch
                id="push-marketing"
                checked={notifications.push.marketing}
                onCheckedChange={(checked) => handleToggleNotification("push", "marketing", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-social">Social</Label>
                <p className="text-sm text-muted-foreground">
                  Receba notificações push sobre atividades sociais, como menções e comentários.
                </p>
              </div>
              <Switch
                id="push-social"
                checked={notifications.push.social}
                onCheckedChange={(checked) => handleToggleNotification("push", "social", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-security">Segurança</Label>
                <p className="text-sm text-muted-foreground">
                  Receba notificações push sobre atividades de segurança, como logins e alterações de senha.
                </p>
              </div>
              <Switch
                id="push-security"
                checked={notifications.push.security}
                onCheckedChange={(checked) => handleToggleNotification("push", "security", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-updates">Atualizações</Label>
                <p className="text-sm text-muted-foreground">
                  Receba notificações push sobre atualizações da plataforma e novos recursos.
                </p>
              </div>
              <Switch
                id="push-updates"
                checked={notifications.push.updates}
                onCheckedChange={(checked) => handleToggleNotification("push", "updates", checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Notificações SMS</CardTitle>
            <CardDescription>Gerencie quais notificações SMS você deseja receber.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sms-marketing">Marketing</Label>
                <p className="text-sm text-muted-foreground">Receba SMS sobre novos produtos, recursos e ofertas.</p>
              </div>
              <Switch
                id="sms-marketing"
                checked={notifications.sms.marketing}
                onCheckedChange={(checked) => handleToggleNotification("sms", "marketing", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sms-social">Social</Label>
                <p className="text-sm text-muted-foreground">
                  Receba SMS sobre atividades sociais, como menções e comentários.
                </p>
              </div>
              <Switch
                id="sms-social"
                checked={notifications.sms.social}
                onCheckedChange={(checked) => handleToggleNotification("sms", "social", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sms-security">Segurança</Label>
                <p className="text-sm text-muted-foreground">
                  Receba SMS sobre atividades de segurança, como logins e alterações de senha.
                </p>
              </div>
              <Switch
                id="sms-security"
                checked={notifications.sms.security}
                onCheckedChange={(checked) => handleToggleNotification("sms", "security", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sms-updates">Atualizações</Label>
                <p className="text-sm text-muted-foreground">
                  Receba SMS sobre atualizações da plataforma e novos recursos.
                </p>
              </div>
              <Switch
                id="sms-updates"
                checked={notifications.sms.updates}
                onCheckedChange={(checked) => handleToggleNotification("sms", "updates", checked)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar preferências"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

