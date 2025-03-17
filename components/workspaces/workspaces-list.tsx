"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { WorkspaceCard } from "./workspace-card"

type Workspace = {
  id: string
  name: string
  description: string
  created_at: string
  user_id: string
}

export function WorkspacesList() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [newWorkspace, setNewWorkspace] = useState({ name: "", description: "" })
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchWorkspaces()
    }
  }, [user])

  async function fetchWorkspaces() {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from("workspaces")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setWorkspaces(data || [])
    } catch (error) {
      console.error("Error fetching workspaces:", error)
      toast({
        title: "Erro ao carregar workspaces",
        description: "Não foi possível carregar seus workspaces. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function createWorkspace() {
    if (!newWorkspace.name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, forneça um nome para o workspace.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsCreating(true)
      const { data, error } = await supabase
        .from("workspaces")
        .insert([
          {
            name: newWorkspace.name,
            description: newWorkspace.description,
            user_id: user?.id,
          },
        ])
        .select()

      if (error) throw error

      toast({
        title: "Workspace criado",
        description: "Seu novo workspace foi criado com sucesso.",
      })

      setWorkspaces([data[0], ...workspaces])
      setNewWorkspace({ name: "", description: "" })
      setOpen(false)
    } catch (error) {
      console.error("Error creating workspace:", error)
      toast({
        title: "Erro ao criar workspace",
        description: "Não foi possível criar o workspace. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  async function deleteWorkspace(id: string) {
    try {
      const { error } = await supabase.from("workspaces").delete().eq("id", id)

      if (error) throw error

      toast({
        title: "Workspace excluído",
        description: "O workspace foi excluído com sucesso.",
      })

      setWorkspaces(workspaces.filter((workspace) => workspace.id !== id))
    } catch (error) {
      console.error("Error deleting workspace:", error)
      toast({
        title: "Erro ao excluir workspace",
        description: "Não foi possível excluir o workspace. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Workspace
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar novo workspace</DialogTitle>
              <DialogDescription>Adicione um novo workspace para organizar seus agentes e conversas.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  placeholder="Meu Workspace"
                  value={newWorkspace.name}
                  onChange={(e) => setNewWorkspace({ ...newWorkspace, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  placeholder="Descrição do workspace"
                  value={newWorkspace.description}
                  onChange={(e) => setNewWorkspace({ ...newWorkspace, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={createWorkspace} disabled={isCreating}>
                {isCreating ? "Criando..." : "Criar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-24 bg-muted" />
              <CardContent className="h-20" />
              <CardFooter className="h-12" />
            </Card>
          ))}
        </div>
      ) : workspaces.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Nenhum workspace encontrado</CardTitle>
            <CardDescription>Você ainda não tem nenhum workspace. Crie um para começar.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => setOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Criar Workspace
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((workspace) => (
            <WorkspaceCard key={workspace.id} workspace={workspace} onDelete={() => deleteWorkspace(workspace.id)} />
          ))}
        </div>
      )}
    </div>
  )
}

