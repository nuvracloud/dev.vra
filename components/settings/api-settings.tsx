"use client"

import { useState } from "react"
import { Loader2, Copy, RefreshCw, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export function ApiSettings() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const [apiKey, setApiKey] = useState("sk_test_51NXxkpLmT6XM8AOXnYTGFSFd7YxhKnKlK")

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey)
    toast({
      title: "Copiado!",
      description: "Chave API copiada para a área de transferência.",
    })
  }

  const handleRegenerateApiKey = () => {
    setIsLoading(true)

    // Simulando uma chamada de API
    setTimeout(() => {
      setIsLoading(false)
      setApiKey("sk_test_" + Math.random().toString(36).substring(2, 15))
      toast({
        title: "Chave API regenerada",
        description: "Uma nova chave API foi gerada com sucesso.",
      })
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Chaves API</CardTitle>
          <CardDescription>Gerencie suas chaves API para integrar com outros serviços.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">Chave API</Label>
            <div className="flex">
              <div className="relative flex-1">
                <Input id="api-key" value={apiKey} type={showApiKey ? "text" : "password"} readOnly className="pr-10" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">{showApiKey ? "Ocultar" : "Mostrar"} chave API</span>
                </Button>
              </div>
              <Button type="button" variant="outline" size="icon" className="ml-2" onClick={handleCopyApiKey}>
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copiar chave API</span>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Esta chave dá acesso completo à sua conta. Mantenha-a segura!
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="button" variant="outline" onClick={handleRegenerateApiKey} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Regenerando...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerar chave
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documentação da API</CardTitle>
          <CardDescription>Recursos para ajudá-lo a integrar com nossa API.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border p-4">
            <h3 className="font-medium">Guia de início rápido</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Aprenda os conceitos básicos para começar a usar nossa API.
            </p>
            <Button variant="link" className="mt-2 h-auto p-0 text-sm">
              Ver documentação
            </Button>
          </div>
          <div className="rounded-md border p-4">
            <h3 className="font-medium">Referência da API</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Documentação detalhada de todos os endpoints disponíveis.
            </p>
            <Button variant="link" className="mt-2 h-auto p-0 text-sm">
              Ver referência
            </Button>
          </div>
          <div className="rounded-md border p-4">
            <h3 className="font-medium">Exemplos de código</h3>
            <p className="mt-1 text-sm text-muted-foreground">Exemplos práticos em várias linguagens de programação.</p>
            <Button variant="link" className="mt-2 h-auto p-0 text-sm">
              Ver exemplos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

