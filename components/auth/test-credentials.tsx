"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Info } from "lucide-react"

export function TestCredentials() {
  const [isLoading, setIsLoading] = useState(false)
  const [testUser, setTestUser] = useState<{ email: string; password: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function setupTestUser() {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/setup")
      const data = await response.json()

      if (data.success && data.testUser) {
        setTestUser(data.testUser)
      } else {
        setError("Não foi possível criar usuário de teste.")
      }
    } catch (err) {
      setError("Erro ao configurar ambiente de teste.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Ambiente de Teste</CardTitle>
        <CardDescription>Configure um usuário de teste para acessar a plataforma</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {testUser ? (
          <div className="space-y-2">
            <Alert className="bg-blue-50 text-blue-800 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription>
                <p>
                  <strong>Email:</strong> {testUser.email}
                </p>
                <p>
                  <strong>Senha:</strong> {testUser.password}
                </p>
              </AlertDescription>
            </Alert>
            <p className="text-sm text-muted-foreground">Use estas credenciais para fazer login na plataforma.</p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Clique no botão abaixo para configurar um usuário de teste.</p>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={setupTestUser}
          disabled={isLoading || !!testUser}
          variant={testUser ? "outline" : "default"}
          className="w-full"
        >
          {isLoading ? "Configurando..." : testUser ? "Usuário Configurado" : "Configurar Usuário de Teste"}
        </Button>
      </CardFooter>
    </Card>
  )
}

