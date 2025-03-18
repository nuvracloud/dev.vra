"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Eye, EyeOff, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { useLoading } from "@/contexts/loading-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 as CheckCircle2Icon } from "lucide-react"
import { FormError } from "@/components/ui/form-error"
import { FormSuccess } from "@/components/ui/form-success"
import { PasswordRequirements } from "@/components/auth/password-requirements"
import type { JSX } from "react"

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(50, "Nome muito longo"),
  email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
  password: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "A senha deve conter pelo menos um número")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "A senha deve conter pelo menos um caractere especial"
    ),
  confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
})

export function RegisterForm() {
  const router = useRouter()
  const { toast } = useToast()
  const { showLoading, hideLoading } = useLoading()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | JSX.Element | undefined>(undefined)
  const [success, setSuccess] = useState<string | undefined>(undefined)
  const [emailExists, setEmailExists] = useState(false)
  const [existingEmail, setExistingEmail] = useState("")
  const { signUp } = useAuth()
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    showLoading()
    setError(undefined)
    setSuccess(undefined)
    form.clearErrors()
    setEmailExists(false)

    try {
      await signUp(data.email, data.password, data.name)
      setSuccess("Conta criada com sucesso! Redirecionando...")
    } catch (error) {
      console.error("Erro ao registrar:", error)
      
      if (error instanceof Error) {
        if (error.message.includes("security purposes")) {
          const seconds = error.message.match(/(\d+) seconds/)?.[1] || "60"
          setError(
            <div className="flex flex-col items-center space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-800 text-center">
                Por favor, aguarde {seconds} segundos antes de tentar novamente.
              </p>
              <div className="text-green-600 text-sm">
                Esta limitação existe para proteger nosso sistema contra abusos.
              </div>
            </div>
          )
        } else {
          setError(error.message)
        }
      }
    } finally {
      setIsLoading(false)
      hideLoading()
    }
  }

  return (
    <div className="space-y-6">
      {emailExists ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-1">
              <p className="font-semibold">Email já registrado</p>
              <p className="text-sm">O email {existingEmail} já possui uma conta.</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="default"
                className="flex-1"
                onClick={() => router.push("/login")}
              >
                Fazer login
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setEmailExists(false)
                  form.reset()
                }}
              >
                Tentar novamente
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="João Silva" {...field} />
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
                          autoComplete="new-password"
                          onChange={(e) => {
                            field.onChange(e)
                            setPassword(e.target.value)
                          }}
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
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••" 
                          disabled={isLoading}
                          {...field} 
                          autoComplete="new-password"
                          onChange={(e) => {
                            field.onChange(e)
                            setConfirmPassword(e.target.value)
                          }}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
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
              <PasswordRequirements password={password} confirmPassword={confirmPassword} />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  "Criar conta"
                )}
              </Button>
            </form>
          </Form>
        </>
      )}
    </div>
  )
}

