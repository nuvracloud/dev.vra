"use client"

import type React from "react"

import { useState } from "react"
import { Loader2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"

export function ProfileSettings() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "João Silva",
    email: "joao.silva@exemplo.com",
    bio: "Especialista em automação e inteligência artificial.",
    avatar: "/placeholder.svg?height=100&width=100",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulando uma chamada de API
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Perfil atualizado",
        description: "Suas informações de perfil foram atualizadas com sucesso.",
      })
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações do Perfil</CardTitle>
          <CardDescription>Atualize suas informações pessoais e como você aparece na plataforma.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={formData.avatar} alt="Avatar" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm" className="flex items-center">
                  <Upload className="mr-2 h-4 w-4" />
                  Alterar foto
                </Button>
              </div>
              <div className="flex-1 space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bio">Biografia</Label>
                  <Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows={4} />
                </div>
              </div>
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

