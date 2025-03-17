"use client"

import type React from "react"

import { useState } from "react"
import { Loader2, Sun, Moon, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export function AppearanceSettings() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [theme, setTheme] = useState("system")
  const [fontSize, setFontSize] = useState("medium")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulando uma chamada de API
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Aparência atualizada",
        description: "Suas preferências de aparência foram atualizadas com sucesso.",
      })
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Aparência</CardTitle>
            <CardDescription>Personalize a aparência da interface de acordo com suas preferências.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>Tema</Label>
              <RadioGroup value={theme} onValueChange={setTheme} className="grid grid-cols-3 gap-4">
                <Label
                  htmlFor="theme-light"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                >
                  <RadioGroupItem value="light" id="theme-light" className="sr-only" />
                  <Sun className="mb-3 h-6 w-6" />
                  <span className="text-center text-sm font-medium">Claro</span>
                </Label>
                <Label
                  htmlFor="theme-dark"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                >
                  <RadioGroupItem value="dark" id="theme-dark" className="sr-only" />
                  <Moon className="mb-3 h-6 w-6" />
                  <span className="text-center text-sm font-medium">Escuro</span>
                </Label>
                <Label
                  htmlFor="theme-system"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                >
                  <RadioGroupItem value="system" id="theme-system" className="sr-only" />
                  <Monitor className="mb-3 h-6 w-6" />
                  <span className="text-center text-sm font-medium">Sistema</span>
                </Label>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fontSize">Tamanho da fonte</Label>
              <Select value={fontSize} onValueChange={setFontSize}>
                <SelectTrigger id="fontSize">
                  <SelectValue placeholder="Selecione um tamanho de fonte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Pequeno</SelectItem>
                  <SelectItem value="medium">Médio</SelectItem>
                  <SelectItem value="large">Grande</SelectItem>
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
                "Salvar preferências"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

