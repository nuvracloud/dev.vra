"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AuthError, PostgrestError } from "@supabase/supabase-js"
import type { Session, User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import { useLoading } from "@/contexts/loading-context"
import { Button } from "@/components/ui/button"

interface AuthContextType {
  signIn: (email: string, password: string, rememberMe: boolean) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  user: User | null
  session: Session | null
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const getErrorMessage = (error: AuthError): string => {
  switch (error.message) {
    case "Invalid login credentials":
      return "Email ou senha incorretos. Por favor, verifique suas credenciais."
    case "Email not confirmed":
      return "Por favor, confirme seu email antes de fazer login"
    case "User already registered":
      return "Este email já está registrado"
    case "Password should be at least 8 characters":
      return "A senha deve ter pelo menos 8 caracteres"
    case "Rate limit exceeded":
      return "Muitas tentativas. Por favor, aguarde alguns minutos"
    case error.message.match(/security purposes.*(\d+) seconds/)?.input:
      const seconds = error.message.match(/(\d+) seconds/)?.[1] || "60"
      return `Por favor, aguarde ${seconds} segundos antes de tentar novamente`
    default:
      console.error("Erro não tratado:", error)
      return "Ocorreu um erro. Por favor, tente novamente"
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { showLoading, hideLoading } = useLoading()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)

      // Mostrar toast quando a sessão for iniciada
      if (session?.user) {
        // Buscar informações do usuário
        const { data: userData } = await supabase
          .from("users")
          .select("name")
          .eq("id", session.user.id)
          .single()

        toast({
          title: "Autenticado",
          description: `Bem-vindo, ${userData?.name || session.user.user_metadata?.name || 'usuário'}!`,
        })
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      showLoading()
      console.log("Iniciando processo de login para:", email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log("Resposta do Supabase:", { data, error })

      if (error) {
        console.error("Erro detalhado:", error)
        
        // Tratamento específico para erros comuns
        if (error.message === "Invalid login credentials") {
          console.log("Tentativa de login falhou - Credenciais inválidas")
          throw new Error("Invalid login credentials")
        } else if (error.message === "Email not confirmed") {
          console.log("Tentativa de login falhou - Email não confirmado")
          // Mostrar toast com opção de reenvio
          toast({
            title: "Email não confirmado",
            description: (
              <div className="flex flex-col gap-4">
                <p>Por favor, confirme seu email antes de fazer login.</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={async () => {
                    try {
                      const { error } = await supabase.auth.resend({
                        type: 'signup',
                        email,
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
                  }}
                >
                  Reenviar email de confirmação
                </Button>
              </div>
            ),
            variant: "destructive",
          })
          throw new Error("Email not confirmed")
        }
        
        throw error
      }

      // Se rememberMe for true, armazenamos no localStorage (apenas no cliente)
      if (typeof window !== "undefined") {
        if (rememberMe) {
          localStorage.setItem("rememberMe", "true")
        } else {
          localStorage.removeItem("rememberMe")
        }
      }

      console.log("Login realizado com sucesso")
      
      // Forçar atualização da sessão
      const { data: { session: newSession } } = await supabase.auth.getSession()
      setSession(newSession)
      setUser(newSession?.user ?? null)
      
      // Mostrar toast de boas-vindas
      toast({
        title: "Bem-vindo de volta!",
        description: `Olá, ${newSession?.user?.user_metadata?.name || 'usuário'}! Login realizado com sucesso.`,
      })
      
      // Garantir que a sessão foi atualizada antes de redirecionar
      if (newSession?.user) {
        console.log("Sessão atualizada, verificando workspace do usuário...")
        
        try {
          // Verificar se o usuário tem workspace
          const { data: workspace, error: workspaceError } = await supabase
            .from("workspaces")
            .select("id")
            .eq("user_id", newSession.user.id)
            .single()

          if (workspaceError && workspaceError.code !== "PGRST116") {
            console.error("Erro ao buscar workspace:", workspaceError)
          }

          // Verificar se o usuário está associado a algum workspace
          const { data: userWorkspace, error: userWorkspaceError } = await supabase
            .from("users")
            .select("workspace_id")
            .eq("id", newSession.user.id)
            .single()

          if (userWorkspaceError && userWorkspaceError.code !== "PGRST116") {
            console.error("Erro ao buscar workspace do usuário:", userWorkspaceError)
          }

          // Aguardar um momento para garantir que a sessão foi propagada
          await new Promise(resolve => setTimeout(resolve, 100))
          router.refresh()

          // Decidir para onde redirecionar
          const hasWorkspace = workspace || userWorkspace?.workspace_id
          if (!hasWorkspace) {
            console.log("Usuário sem workspace, redirecionando para /workspaces")
            router.replace("/workspaces")
          } else {
            console.log("Usuário com workspace, redirecionando para /dashboard")
            router.replace("/dashboard")
          }
        } catch (error) {
          console.error("Erro ao verificar workspace:", error)
          // Em caso de erro na verificação do workspace, redirecionar para /workspaces
          router.replace("/workspaces")
        }
      } else {
        console.error("Sessão não foi atualizada corretamente após o login")
        throw new Error("Erro ao atualizar sessão")
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      
      // Não exibimos toast para erros que já são tratados no formulário
      if (error instanceof Error && 
          error.message !== "Invalid login credentials" && 
          error.message !== "Email not confirmed") {
        let errorMessage = "Erro ao fazer login"
        if (error instanceof AuthError) {
          errorMessage = getErrorMessage(error)
        }

        toast({
          title: "Erro no Login",
          description: errorMessage,
          variant: "destructive",
        })
      }
      
      throw error
    } finally {
      hideLoading()
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    if (name.length > 50) {
      throw new Error("Nome muito longo")
    }

    try {
      showLoading()
      console.log("Iniciando processo de registro para:", email)

      // Verificar se o email já está em uso
      const { data: existingUser, error: existingUserError } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .single()

      console.log("Verificação de email existente:", { existingUser, existingUserError })

      if (existingUserError && existingUserError.code !== "PGRST116") {
        console.error("Erro ao verificar email existente:", existingUserError)
        throw new Error(`Erro ao verificar disponibilidade do email: ${existingUserError.message}`)
      }

      if (existingUser) {
        throw new Error("Este email já está registrado")
      }

      console.log("Registrando usuário no Auth...")
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      })

      console.log("Resposta do registro Auth:", { data, signUpError })

      if (signUpError) {
        console.error("Erro no registro Auth:", signUpError)
        throw signUpError
      }

      if (!data?.user?.id) {
        console.error("Dados do usuário ausentes:", data)
        throw new Error("Dados do usuário não foram criados corretamente")
      }

      console.log("Usuário criado com sucesso no Auth. ID:", data.user.id)

      // Criar perfil do usuário
      console.log("Criando perfil do usuário...")
      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .insert([
          {
            id: data.user.id,
            email: data.user.email,
            name: name.trim()
          },
        ])
        .select()
        .single()

      console.log("Resposta da criação do perfil:", { profileData, profileError })

      if (profileError) {
        console.error("Erro detalhado ao criar perfil:", {
          code: profileError.code,
          message: profileError.message,
          details: profileError.details,
          hint: profileError.hint
        })
        throw new Error(`Erro ao criar perfil: ${profileError.message}`)
      }

      console.log("Perfil do usuário criado com sucesso:", profileData)

      toast({
        title: "Registro realizado!",
        description: "Por favor, verifique seu email para confirmar sua conta.",
      })

      // Redirecionar para login após registro bem-sucedido
      router.push("/login")
    } catch (error) {
      console.error("Erro completo no registro:", {
        error,
        type: typeof error,
        isError: error instanceof Error,
        message: error instanceof Error ? error.message : 'Erro desconhecido',
        stack: error instanceof Error ? error.stack : undefined
      })
      
      let errorMessage = "Erro ao criar conta"
      
      if (error instanceof AuthError) {
        errorMessage = getErrorMessage(error)
      } else if (error instanceof Error) {
        errorMessage = error.message
      } else if (error instanceof Object) {
        errorMessage = JSON.stringify(error, null, 2)
      }

      toast({
        title: "Erro no Registro",
        description: errorMessage,
        variant: "destructive",
      })
      
      throw new Error(errorMessage)
    } finally {
      hideLoading()
    }
  }

  const signOut = async () => {
    try {
      showLoading()
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.push("/login")
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
      toast({
        title: "Erro",
        description: error instanceof AuthError 
          ? getErrorMessage(error) 
          : "Erro ao fazer logout",
        variant: "destructive",
      })
    } finally {
      hideLoading()
    }
  }

  const resetPassword = async (email: string) => {
    try {
      showLoading()
      console.log("Iniciando processo de redefinição de senha para:", email)

      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      console.log("Resposta do Supabase:", { data, error })

      if (error) {
        console.error("Erro detalhado:", error)
        throw error
      }

      console.log("Email de redefinição enviado com sucesso")
      
      toast({
        title: "Email enviado",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      })
    } catch (error) {
      console.error("Erro ao enviar email de redefinição:", error)
      
      // Melhor tratamento de erros específicos
      let errorMessage = "Erro ao enviar email"
      if (error instanceof AuthError) {
        if (error.message.includes("60 seconds")) {
          errorMessage = "Por favor, aguarde 60 segundos antes de tentar novamente"
        } else if (error.message.includes("Invalid email")) {
          errorMessage = "Email inválido ou não encontrado"
        } else {
          errorMessage = getErrorMessage(error)
        }
      }

      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
      throw error
    } finally {
      hideLoading()
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

