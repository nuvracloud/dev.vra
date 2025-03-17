import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"
import { TestCredentials } from "@/components/auth/test-credentials"

export default function LoginPage() {
  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Bem-vindo de volta</h1>
        <p className="text-sm text-muted-foreground">Entre com seu email e senha para acessar sua conta</p>
      </div>
      <LoginForm />
      <p className="px-8 text-center text-sm text-muted-foreground">
        Ao continuar, você concorda com nossos{" "}
        <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
          Termos de Serviço
        </Link>{" "}
        e{" "}
        <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
          Política de Privacidade
        </Link>
        .
      </p>

      <TestCredentials />
    </div>
  )
}

