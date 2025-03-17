"use client"

import { useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

const formSchema = z.object({
  email: z.string().email({
    message: "Por favor, insira um email válido.",
  }),
  password: z.string().min(6, {
    message: "A senha deve ter pelo menos 6 caracteres.",
  }),
})

export function LoginForm() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { signIn } = useAuth()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      console.log("Submitting login form with email:", values.email)
      const { error, success, message } = await signIn(values.email, values.password)

      if (success) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Redirecionando para o dashboard...",
        })
      } else if (error) {
        console.error("Login error:", error)
        setErrorMessage(message || error.message || "Credenciais inválidas. Verifique seu email e senha.")
      }
    } catch (error) {
      console.error("Unexpected login error:", error)
      setErrorMessage("Ocorreu um erro inesperado. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="nome@exemplo.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Senha</FormLabel>
                  <Link href="/forgot-password" className="text-xs text-muted-foreground hover:text-primary">
                    Esqueceu a senha?
                  </Link>
                </div>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        <p className="text-muted-foreground">
          Não tem uma conta?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Registre-se
          </Link>
        </p>
      </div>
    </div>
  )
}

