"use client"

import type React from "react"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export function AccountSettings() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: "joaosilva",
    language: "pt-BR",
    timezone: "America/Sao_Paulo",
    dateFormat: "DD/MM/YYYY",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulando uma chamada de API
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Conta atualizada",
        description: "As configurações da sua conta foram atualizadas com sucesso.",
      })
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações da Conta</CardTitle>
          <CardDescription>Gerencie as configurações básicas da sua conta.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Nome de usuário</Label>
              <Input id="username" name="username" value={formData.username} onChange={handleChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="language">Idioma</Label>
              <Select value={formData.language} onValueChange={(value) => handleSelectChange("language", value)}>
                <SelectTrigger id="language">
                  <SelectValue placeholder="Selecione um idioma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="timezone">Fuso horário</Label>
              <Select value={formData.timezone} onValueChange={(value) => handleSelectChange("timezone", value)}>
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Selecione um fuso horário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Sao_Paulo">Brasília (GMT-3)</SelectItem>
                  <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                  <SelectItem value="Europe/London">London (GMT+0)</SelectItem>
                  <SelectItem value="Asia/Tokyo">Tokyo (GMT+9)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dateFormat">Formato de data</Label>
              <Select value={formData.dateFormat} onValueChange={(value) => handleSelectChange("dateFormat", value)}>
                <SelectTrigger id="dateFormat">
                  <SelectValue placeholder="Selecione um formato de data" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
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
                "Salvar alterações"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

