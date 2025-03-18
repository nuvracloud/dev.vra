"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"

const formSchema = z.object({
  email: z.string().email({
    message: "Por favor, insira um email válido.",
  }),
})

export function ForgotPasswordForm() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const { resetPassword } = useAuth()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (timeLeft > 0) {
      toast({
        title: "Aguarde",
        description: `Aguarde ${timeLeft} segundos antes de tentar novamente.`,
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await resetPassword(values.email)
      setIsSubmitted(true)
    } catch (error) {
      if (error instanceof Error && error.message.includes("60 seconds")) {
        setTimeLeft(60)
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="space-y-4">
        <Alert className="bg-green-50 border-green-200">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="flex flex-col space-y-2">
            <h3 className="font-medium text-green-800">Email enviado com sucesso!</h3>
            <p className="text-sm text-green-700">
              Enviamos um link para redefinir sua senha para o email fornecido. 
              Por favor, verifique sua caixa de entrada e spam.
            </p>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {timeLeft > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Por favor, aguarde {timeLeft} segundos antes de tentar novamente.
            </AlertDescription>
          </Alert>
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  placeholder="nome@exemplo.com" 
                  disabled={isLoading || timeLeft > 0}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading || timeLeft > 0}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : timeLeft > 0 ? (
            `Aguarde ${timeLeft}s`
          ) : (
            "Enviar link de recuperação"
          )}
        </Button>
      </form>
    </Form>
  )
}

