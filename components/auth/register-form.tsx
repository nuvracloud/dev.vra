"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

const formSchema = z
  .object({
    name: z.string().min(2, {
      message: "O nome deve ter pelo menos 2 caracteres.",
    }),
    email: z.string().email({
      message: "Por favor, insira um email válido.",
    }),
    password: z.string().min(6, {
      message: "A senha deve ter pelo menos 6 caracteres.",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  })

export function RegisterForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const { signUp } = useAuth()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const { error, success, message } = await signUp(values.email, values.password, { name: values.name })

      if (success) {
        setSuccessMessage(message || "Conta criada com sucesso! Você já pode fazer login.")

        // Redirecionar para login após 3 segundos
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      } else if (error) {
        setErrorMessage(message || error.message || "Erro ao criar conta. Tente novamente.")
      }
    } catch (error) {
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

      {successMessage && (
        <Alert variant="success" className="bg-green-50 text-green-800 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Seu nome" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar Senha</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Registrando..." : "Registrar"}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        <p className="text-muted-foreground">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  )
}

