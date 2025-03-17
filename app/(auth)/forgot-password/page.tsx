import type { Metadata } from "next"
import Link from "next/link"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export const metadata: Metadata = {
  title: "Recuperar Senha | AI Agent Platform",
  description: "Recupere sua senha da AI Agent Platform",
}

export default function ForgotPasswordPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/login" className="absolute left-4 top-4 md:left-8 md:top-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4"
        >
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
        <span className="sr-only">Voltar</span>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Recuperar senha</h1>
          <p className="text-sm text-muted-foreground">Digite seu email para receber um link de recuperação de senha</p>
        </div>
        <ForgotPasswordForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link href="/login" className="underline underline-offset-4 hover:text-primary">
            Voltar para o login
          </Link>
        </p>
      </div>
    </div>
  )
}

