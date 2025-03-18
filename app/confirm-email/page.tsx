"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function ConfirmEmailPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const token = searchParams.get("token")
        const type = searchParams.get("type")

        if (!token || type !== "signup") {
          setStatus("error")
          setMessage("Link de confirmação inválido ou expirado.")
          return
        }

        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: "signup",
        })

        if (error) {
          console.error("Error confirming email:", error)
          setStatus("error")
          setMessage("Erro ao confirmar email. Tente novamente ou solicite um novo link.")
          return
        }

        setStatus("success")
        setMessage("Email confirmado com sucesso! Você será redirecionado para o dashboard.")

        // Redirecionar para o dashboard após 3 segundos
        setTimeout(() => {
          router.push("/dashboard")
        }, 3000)
      } catch (error) {
        console.error("Error in confirmEmail:", error)
        setStatus("error")
        setMessage("Ocorreu um erro inesperado. Tente novamente.")
      }
    }

    confirmEmail()
  }, [router, searchParams])

  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Confirmação de Email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "loading" && (
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-muted-foreground">Confirmando seu email...</p>
            </div>
          )}

          {status === "success" && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {status === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {status === "error" && (
            <div className="flex justify-center">
              <Button onClick={() => router.push("/login")}>Voltar para Login</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 