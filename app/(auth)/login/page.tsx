import type { Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"
import { AuthLayout } from "@/components/auth/auth-layout"

export const metadata: Metadata = {
  title: "Login | Nuvra Cloud",
  description: "Entre na sua conta na Nuvra Cloud",
}

export default function LoginPage() {
  return (
    <AuthLayout
      title="Bem-vindo de volta"
      description="Entre com seu email e senha para acessar a plataforma"
    >
      <LoginForm />
    </AuthLayout>
  )
}

