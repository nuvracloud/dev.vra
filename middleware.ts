import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  try {
    // Atualizar cookies de autenticação
    const { data: { session } } = await supabase.auth.getSession()
    console.log("Middleware - Status da sessão:", session ? "Autenticado" : "Não autenticado")
    console.log("Middleware - Rota atual:", req.nextUrl.pathname)

    // Redirecionar para o login se não estiver autenticado e tentar acessar rotas protegidas
    if (!session && (
      req.nextUrl.pathname.startsWith("/dashboard") ||
      req.nextUrl.pathname.startsWith("/settings") ||
      req.nextUrl.pathname.startsWith("/profile") ||
      req.nextUrl.pathname.startsWith("/workspace") ||
      req.nextUrl.pathname.startsWith("/workspaces")
    )) {
      console.log("Middleware - Redirecionando para login: Usuário não autenticado")
      return NextResponse.redirect(new URL("/login", req.url))
    }

    // Redirecionar para o dashboard se estiver autenticado e tentar acessar páginas de auth
    if (session && (
      req.nextUrl.pathname.startsWith("/login") ||
      req.nextUrl.pathname.startsWith("/register") ||
      req.nextUrl.pathname.startsWith("/forgot-password") ||
      req.nextUrl.pathname.startsWith("/reset-password") ||
      req.nextUrl.pathname === "/"
    )) {
      console.log("Middleware - Verificando redirecionamento para usuário autenticado...")

      try {
        // Verificar se o usuário tem workspace
        const { data: workspace, error: workspaceError } = await supabase
          .from("workspaces")
          .select("id")
          .eq("user_id", session.user.id)
          .single()

        if (workspaceError) {
          console.log("Middleware - Erro ao buscar workspace:", workspaceError)
        }

        // Verificar se o usuário está associado a algum workspace
        const { data: userWorkspace, error: userWorkspaceError } = await supabase
          .from("users")
          .select("workspace_id")
          .eq("id", session.user.id)
          .single()

        if (userWorkspaceError) {
          console.log("Middleware - Erro ao buscar workspace do usuário:", userWorkspaceError)
        }

        // Decidir para onde redirecionar
        const hasWorkspace = workspace || userWorkspace?.workspace_id
        const redirectPath = !hasWorkspace ? "/workspaces" : "/dashboard"
        console.log(`Middleware - Redirecionando para ${redirectPath}`)
        return NextResponse.redirect(new URL(redirectPath, req.url))
      } catch (error) {
        console.error("Middleware - Erro ao verificar workspace:", error)
        // Em caso de erro na verificação do workspace, redirecionar para /workspaces
        return NextResponse.redirect(new URL("/workspaces", req.url))
      }
    }

    return res
  } catch (error) {
    console.error("Middleware - Erro:", error)
    // Em caso de erro na sessão, permitir a requisição continuar
    return res
  }
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/settings/:path*",
    "/profile/:path*",
    "/workspace/:path*",
    "/workspaces/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ],
}

