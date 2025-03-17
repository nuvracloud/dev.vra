"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"

const formSchema = z.object({
  email: z.string().email({
    message: "Por favor, insira um email válido.",
  }),
})

export function ForgotPasswordForm() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { resetPassword } = useAuth()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const { error, success } = await resetPassword(values.email)

      if (success) {
        setIsSubmitted(true)
        toast({
          title: "Email enviado",
          description: "Verifique seu email para redefinir sua senha.",
        })
      } else if (error) {
        toast({
          title: "Erro ao enviar email",
          description: error.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro ao enviar email",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="space-y-4 text-center">
        <h3 className="text-lg font-medium">Email enviado</h3>
        <p className="text-sm text-muted-foreground">
          Enviamos um link para redefinir sua senha para o email fornecido. Por favor, verifique sua caixa de entrada.
        </p>
      </div>
    )
  }

  return (
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
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Enviando..." : "Enviar link de recuperação"}
        </Button>
      </form>
    </Form>
  )
}

