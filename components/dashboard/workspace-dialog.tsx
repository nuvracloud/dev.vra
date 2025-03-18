import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

const MAX_WORKSPACE_NAME = 50
const CODE_LENGTH = 6

const generateCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let code = ""
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export function WorkspaceDialog() {
  const [open, setOpen] = useState(true)
  const [loading, setLoading] = useState(false)
  const [workspaceName, setWorkspaceName] = useState("")
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!workspaceName.trim()) {
      toast.error("Por favor, insira um nome para o departamento")
      return
    }

    try {
      setLoading(true)

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        toast.error("Sessão expirada. Por favor, faça login novamente.")
        router.push("/login")
        return
      }

      // Criar novo workspace
      const { data: workspace, error: workspaceError } = await supabase
        .from("workspaces")
        .insert([
          {
            name: workspaceName,
            user_id: session.user.id,
          },
        ])
        .select()
        .single()

      if (workspaceError) {
        throw workspaceError
      }

      // Atualizar o usuário com o workspace_id
      const { error: userError } = await supabase
        .from("users")
        .update({ workspace_id: workspace.id })
        .eq("id", session.user.id)

      if (userError) {
        throw userError
      }

      toast.success("Departamento criado com sucesso!")
      setOpen(false)
      router.refresh()
    } catch (error: any) {
      console.error("Erro ao criar workspace:", error)
      toast.error(error.message || "Erro ao criar departamento")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Departamento</DialogTitle>
          <DialogDescription>
            Para começar, crie um departamento para sua organização.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Departamento</Label>
            <Input
              id="name"
              placeholder="Ex: Vendas, Marketing, RH..."
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              disabled={loading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Criando..." : "Criar Departamento"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 