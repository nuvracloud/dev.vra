"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { Session, User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  signIn: (
    email: string,
    password: string,
  ) => Promise<{
    error: Error | null
    success: boolean
    message?: string
  }>
  signUp: (
    email: string,
    password: string,
    userData?: { name?: string },
  ) => Promise<{
    error: Error | null
    success: boolean
    message?: string
  }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{
    error: Error | null
    success: boolean
    message?: string
  }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const setData = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()
      if (error) {
        console.error("Error getting session:", error)
        setIsLoading(false)
        return
      }

      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event, session?.user?.email)
      setSession(session)
      setUser(session?.user ?? null)
    })

    setData()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting to sign in with:", email)

      // Verificar se o usuário existe antes de tentar fazer login
      const { data: userExists, error: checkError } = await supabase
        .from("users")
        .select("email")
        .eq("email", email)
        .single()

      if (checkError && checkError.code !== "PGRST116") {
        console.error("Error checking if user exists:", checkError)
        return {
          error: new Error("Erro ao verificar usuário"),
          success: false,
          message: "Ocorreu um erro ao verificar o usuário. Tente novamente.",
        }
      }

      // Se estamos usando autenticação do Supabase sem tabela de usuários personalizada,
      // podemos pular a verificação acima e ir direto para o signInWithPassword

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Supabase auth error:", error)

        // Mensagens de erro mais amigáveis
        let message = "Credenciais inválidas. Verifique seu email e senha."

        if (error.message.includes("Email not confirmed")) {
          message = "Email não confirmado. Verifique sua caixa de entrada."
        }

        return {
          error,
          success: false,
          message,
        }
      }

      console.log("Sign in successful:", data.user?.email)
      router.push("/dashboard")
      return { error: null, success: true }
    } catch (error) {
      console.error("Error signing in:", error)
      return {
        error: error as Error,
        success: false,
        message: "Ocorreu um erro inesperado. Tente novamente.",
      }
    }
  }

  const signUp = async (email: string, password: string, userData?: { name?: string }) => {
    try {
      console.log("Attempting to sign up:", email)

      // Criar o usuário no Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData?.name || email.split("@")[0],
          },
        },
      })

      if (error) {
        console.error("Signup error:", error)

        let message = "Erro ao criar conta. Tente novamente."

        if (error.message.includes("already registered")) {
          message = "Este email já está registrado. Tente fazer login."
        }

        return {
          error,
          success: false,
          message,
        }
      }

      // Se o registro for bem-sucedido, criar entrada na tabela de usuários
      if (data.user) {
        try {
          // Inserir na tabela de usuários personalizada, se existir
          const { error: profileError } = await supabase.from("users").insert([
            {
              id: data.user.id,
              email: data.user.email,
              name: userData?.name || data.user.email?.split("@")[0] || "Usuário",
            },
          ])

          if (profileError) {
            console.error("Error creating user profile:", profileError)
          }

          // Criar um workspace padrão para o novo usuário
          const { error: workspaceError } = await supabase.from("workspaces").insert([
            {
              name: "Meu Workspace",
              description: "Workspace padrão",
              user_id: data.user.id,
            },
          ])

          if (workspaceError) {
            console.error("Error creating default workspace:", workspaceError)
          }
        } catch (err) {
          console.error("Error in post-signup operations:", err)
        }
      }

      console.log("Sign up successful, user created:", data.user?.email)

      // Verificar se o email precisa de confirmação
      if (data.user && !data.user.confirmed_at) {
        return {
          error: null,
          success: true,
          message: "Conta criada com sucesso! Verifique seu email para confirmar o cadastro.",
        }
      }

      return {
        error: null,
        success: true,
        message: "Conta criada com sucesso! Você já pode fazer login.",
      }
    } catch (error) {
      console.error("Error signing up:", error)
      return {
        error: error as Error,
        success: false,
        message: "Ocorreu um erro inesperado. Tente novamente.",
      }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/login")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        console.error("Password reset error:", error)
        return {
          error,
          success: false,
          message: "Erro ao enviar email de recuperação. Tente novamente.",
        }
      }

      return {
        error: null,
        success: true,
        message: "Email de recuperação enviado com sucesso! Verifique sua caixa de entrada.",
      }
    } catch (error) {
      console.error("Error resetting password:", error)
      return {
        error: error as Error,
        success: false,
        message: "Ocorreu um erro inesperado. Tente novamente.",
      }
    }
  }

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

