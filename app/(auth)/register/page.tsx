import type { Metadata } from "next"
import Link from "next/link"
import { RegisterForm } from "@/components/auth/register-form"
import { AuthLayout } from "@/components/auth/auth-layout"

export const metadata: Metadata = {
  title: "Registro | Nuvra Cloud",
  description: "Crie sua conta na Nuvra Cloud",
}

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Crie sua conta"
      description="Preencha os dados abaixo para criar sua conta"
    >
      <RegisterForm />
      <p className="px-8 text-center text-sm text-muted-foreground">
        Já tem uma conta?{" "}
        <Link href="/login" className="underline underline-offset-4 hover:text-primary">
          Faça login
        </Link>
      </p>
    </AuthLayout>
  )
}

