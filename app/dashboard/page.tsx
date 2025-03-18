import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { WorkspaceDialog } from "@/components/dashboard/workspace-dialog"

export const revalidate = 0
export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  try {
    const supabase = createServerComponentClient({ cookies })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      console.log("Dashboard - Usuário não autenticado, redirecionando para login")
      redirect("/login")
    }

    console.log("Dashboard - Usuário autenticado:", session.user.email)

    // Verificar se o usuário já tem um workspace
    const { data: workspace, error: workspaceError } = await supabase
      .from("workspaces")
      .select("*")
      .eq("user_id", session.user.id)
      .single()

    // Se houver erro que não seja "no rows found", logar o erro
    if (workspaceError && workspaceError.code !== "PGRST116") {
      console.error("Dashboard - Erro ao buscar workspace:", workspaceError)
    }

    // Verificar se o usuário tem um workspace associado
    const { data: userWorkspace, error: userWorkspaceError } = await supabase
      .from("users")
      .select("workspace_id, workspaces(*)")
      .eq("id", session.user.id)
      .single()

    if (userWorkspaceError && userWorkspaceError.code !== "PGRST116") {
      console.error("Dashboard - Erro ao buscar workspace do usuário:", userWorkspaceError)
    }

    // Mostrar o diálogo se o usuário não tiver workspace próprio nem estiver associado a um
    const shouldShowDialog = !workspace && !userWorkspace?.workspace_id
    const activeWorkspace = workspace || (userWorkspace?.workspaces as any)

    return (
      <div className="flex h-screen flex-col items-center justify-center">
        {shouldShowDialog && <WorkspaceDialog />}
        {activeWorkspace && (
          <div className="text-center">
            <h1 className="text-2xl font-bold">Bem-vindo ao seu Dashboard</h1>
            <p className="text-muted-foreground">
              Você está no departamento: {activeWorkspace.name}
            </p>
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error("Dashboard - Erro crítico:", error)
    redirect("/login")
  }
} 