"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MoreHorizontal, Pencil, Trash2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"

type Workspace = {
  id: string
  name: string
  description: string
  created_at: string
  user_id: string
}

interface WorkspaceCardProps {
  workspace: Workspace
  onDelete: () => void
}

export function WorkspaceCard({ workspace, onDelete }: WorkspaceCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [editedWorkspace, setEditedWorkspace] = useState({
    name: workspace.name,
    description: workspace.description,
  })
  const router = useRouter()
  const { toast } = useToast()

  async function updateWorkspace() {
    if (!editedWorkspace.name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, forneça um nome para o workspace.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsUpdating(true)
      const { error } = await supabase
        .from("workspaces")
        .update({
          name: editedWorkspace.name,
          description: editedWorkspace.description,
        })
        .eq("id", workspace.id)

      if (error) throw error

      toast({
        title: "Workspace atualizado",
        description: "As alterações foram salvas com sucesso.",
      })

      // Atualiza o workspace localmente
      workspace.name = editedWorkspace.name
      workspace.description = editedWorkspace.description

      setIsEditing(false)
    } catch (error) {
      console.error("Error updating workspace:", error)
      toast({
        title: "Erro ao atualizar workspace",
        description: "Não foi possível atualizar o workspace. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  function handleSelect() {
    // Aqui você pode implementar a lógica para selecionar o workspace
    router.push(`/dashboard?workspace=${workspace.id}`)
  }

  const formattedDate = new Date(workspace.created_at).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="truncate">{workspace.name}</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CardDescription className="truncate">{workspace.description || "Sem descrição"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            <p>Criado em: {formattedDate}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="sm" onClick={handleSelect}>
            Selecionar
          </Button>
          <Button variant="outline" size="sm">
            <Users className="mr-2 h-4 w-4" />
            Colaboradores
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar workspace</DialogTitle>
            <DialogDescription>Faça alterações no seu workspace.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome</Label>
              <Input
                id="edit-name"
                value={editedWorkspace.name}
                onChange={(e) => setEditedWorkspace({ ...editedWorkspace, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Descrição</Label>
              <Input
                id="edit-description"
                value={editedWorkspace.description}
                onChange={(e) => setEditedWorkspace({ ...editedWorkspace, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancelar
            </Button>
            <Button onClick={updateWorkspace} disabled={isUpdating}>
              {isUpdating ? "Salvando..." : "Salvar alterações"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

