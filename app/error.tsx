"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Logar o erro para um serviço de monitoramento
    console.error("Erro na aplicação:", error)
  }, [error])

  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-4">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-destructive">Oops!</h1>
        <h2 className="text-2xl font-semibold">Algo deu errado</h2>
        <p className="text-muted-foreground">
          {error.message || "Ocorreu um erro inesperado. Por favor, tente novamente."}
        </p>
      </div>
      <div className="flex space-x-4">
        <Button
          variant="outline"
          onClick={() => window.location.href = "/"}
        >
          Voltar ao início
        </Button>
        <Button onClick={() => reset()}>Tentar novamente</Button>
      </div>
    </div>
  )
} 