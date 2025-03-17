"use client"

import type React from "react"

import { useState } from "react"
import { Loader2, Shield, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export function SecuritySettings() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Dados simulados de sessões ativas
  const activeSessions = [
    {
      id: 1,
      device: "Chrome em Windows",
      location: "São Paulo, Brasil",
      lastActive: "Agora mesmo",
      current: true,
    },
    {
      id: 2,
      device: "Safari em iPhone",
      location: "Rio de Janeiro, Brasil",
      lastActive: "2 horas atrás",
      current: false,
    },
  ]

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulando uma chamada de API
    setTimeout(() => {
      setIsLoading(false)
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      toast({
        title: "Senha atualizada",
        description: "Sua senha foi atualizada com sucesso.",
      })
    }, 1500)
  }

  const handleToggleTwoFactor = (checked: boolean) => {
    setTwoFactorEnabled(checked)

    toast({
      title: checked ? "Autenticação de dois fatores ativada" : "Autenticação de dois fatores desativada",
      description: checked
        ? "Sua conta está mais segura agora."
        : "Recomendamos ativar a autenticação de dois fatores para maior segurança.",
    })
  }

  const handleTerminateSession = (sessionId: number) => {
    // Simulando uma chamada de API
    toast({
      title: "Sessão encerrada",
      description: "A sessão foi encerrada com sucesso.",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Alterar Senha</CardTitle>
          <CardDescription>Atualize sua senha para manter sua conta segura.</CardDescription>
        </CardHeader>
        <form onSubmit={handlePasswordSubmit}>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="currentPassword">Senha atual</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newPassword">Nova senha</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Atualizando...
                </>
              ) : (
                "Atualizar senha"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Autenticação de Dois Fatores</CardTitle>
          <CardDescription>Adicione uma camada extra de segurança à sua conta.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="font-medium">Autenticação de dois fatores</p>
                <p className="text-sm text-muted-foreground">Proteja sua conta com autenticação de dois fatores.</p>
              </div>
            </div>
            <Switch checked={twoFactorEnabled} onCheckedChange={handleToggleTwoFactor} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sessões Ativas</CardTitle>
          <CardDescription>Gerencie os dispositivos conectados à sua conta.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeSessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
              <div>
                <p className="font-medium">{session.device}</p>
                <p className="text-sm text-muted-foreground">{session.location}</p>
                <p className="text-xs text-muted-foreground">
                  {session.lastActive}
                  {session.current && (
                    <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                      Atual
                    </span>
                  )}
                </p>
              </div>
              {!session.current && (
                <Button variant="outline" size="sm" onClick={() => handleTerminateSession(session.id)}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Encerrar
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

