"use client"

import { useState, useEffect } from "react"
import type { JSX } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"
import { useLoading } from "@/contexts/loading-context"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { FormError } from "@/components/ui/form-error"
import { Checkbox } from "@/components/ui/checkbox"
import { supabase } from "@/lib/supabase"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

const formSchema = z.object({
  email: z.string().email({
    message: "Digite um email válido.",
  }),
  password: z.string().min(8, {
    message: "A senha deve ter pelo menos 8 caracteres.",
  }),
  rememberMe: z.boolean().default(false),
})

interface EmailNotConfirmedAlertProps {
  email: string
  onResendClick: () => Promise<void>
}

function EmailNotConfirmedAlert({ email, onResendClick }: EmailNotConfirmedAlertProps) {
  const [isResending, setIsResending] = useState(false)

  const handleResend = async () => {
    setIsResending(true)
    try {
      await onResendClick()
    } finally {
      setIsResending(false)
    }
  }

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Email não confirmado</AlertTitle>
      <AlertDescription className="mt-2 flex flex-col gap-4">
        <div className="text-sm">
          <p>O email <span className="font-medium">{email}</span> ainda não foi confirmado.</p>
          <p>Por favor, verifique sua caixa de entrada e confirme seu email antes de fazer login.</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          disabled={isResending}
          onClick={handleResend}
        >
          {isResending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Reenviando...
            </>
          ) : (
            "Reenviar email de confirmação"
          )}
        </Button>
      </AlertDescription>
    </Alert>
  )
}

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | JSX.Element | undefined>(undefined)
  const [showPassword, setShowPassword] = useState(false)
  const { signIn } = useAuth()
  const { showLoading, hideLoading } = useLoading()
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false)
  const [currentEmail, setCurrentEmail] = useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  // Carregar a preferência de "Lembrar-me" do localStorage apenas no cliente
  useEffect(() => {
    const remembered = localStorage.getItem("rememberMe") === "true"
    form.setValue("rememberMe", remembered)
  }, [form])

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    showLoading()
    setError(undefined)
    setEmailNotConfirmed(false)
    form.clearErrors()

    try {
      console.log("Iniciando tentativa de login...")
      await signIn(data.email, data.password, data.rememberMe)
      console.log("Login bem-sucedido, aguardando redirecionamento...")
      
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo(a) de volta à Nuvra Cloud.",
        variant: "default",
        className: "bg-green-50 border-green-200",
      })

      // Forçar o redirecionamento após um breve delay
      setTimeout(() => {
        router.refresh()
        router.replace("/dashboard")
      }, 1000)
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      
      if (error instanceof Error) {
        switch (error.message) {
          case "Invalid login credentials":
            setError("Email ou senha incorretos. Por favor, verifique suas credenciais.")
            form.setError("password", {
              type: "manual",
              message: "Senha incorreta"
            })
            toast({
              title: "Erro no login",
              description: "Email ou senha incorretos.",
              variant: "destructive",
            })
            break
          case "Email not confirmed":
            setEmailNotConfirmed(true)
            setCurrentEmail(data.email)
            break
          default:
            setError("Ocorreu um erro ao tentar fazer login. Por favor, tente novamente mais tarde.")
        }
      }
    } finally {
      setIsLoading(false)
      hideLoading()
    }
  }

  const handleResendConfirmation = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: currentEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        },
      })
      if (error) throw error
      toast({
        title: "Email reenviado",
        description: "Por favor, verifique sua caixa de entrada.",
      })
    } catch (error) {
      console.error("Erro ao reenviar email:", error)
      toast({
        title: "Erro",
        description: "Não foi possível reenviar o email de confirmação.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {emailNotConfirmed && (
        <EmailNotConfirmedAlert
          email={currentEmail}
          onResendClick={handleResendConfirmation}
        />
      )}
      <FormError message={error} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="exemplo@email.com" 
                    type="email"
                    disabled={isLoading}
                    {...field} 
                    autoComplete="email"
                  />
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
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••" 
                      disabled={isLoading}
                      {...field} 
                      autoComplete="current-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal">Lembrar-me</FormLabel>
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </Button>
          <div className="flex flex-col items-center space-y-2 text-sm">
            <Link
              href="/forgot-password"
              className="text-primary hover:underline"
            >
              Esqueceu sua senha?
            </Link>
            <div className="text-muted-foreground">
              Não tem uma conta?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Cadastre-se
              </Link>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}

