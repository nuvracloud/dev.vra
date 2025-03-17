"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"

type Workspace = {
  id: string
  name: string
  description: string
}

export function WorkspaceSwitcher() {
  const [open, setOpen] = React.useState(false)
  const [showNewWorkspaceDialog, setShowNewWorkspaceDialog] = React.useState(false)
  const [workspaces, setWorkspaces] = React.useState<Workspace[]>([])
  const [selectedWorkspace, setSelectedWorkspace] = React.useState<Workspace | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [newWorkspace, setNewWorkspace] = React.useState({ name: "", description: "" })
  const [isCreating, setIsCreating] = React.useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()

  React.useEffect(() => {
    if (user) {
      fetchWorkspaces()
    }
  }, [user])

  async function fetchWorkspaces() {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from("workspaces")
        .select("id, name, description")
        .eq("user_id", user?.id)
        .order("name")

      if (error) throw error

      setWorkspaces(data || [])

      // Se houver workspaces, selecione o primeiro
      if (data && data.length > 0) {
        setSelectedWorkspace(data[0])
      }
    } catch (error) {
      console.error("Error fetching workspaces:", error)
      toast({
        title: "Erro ao carregar workspaces",
        description: "Não foi possível carregar seus workspaces.",
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

      const newWorkspaceData = data[0] as Workspace
      setWorkspaces([...workspaces, newWorkspaceData])
      setSelectedWorkspace(newWorkspaceData)
      setNewWorkspace({ name: "", description: "" })
      setShowNewWorkspaceDialog(false)
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

  function selectWorkspace(workspace: Workspace) {
    setSelectedWorkspace(workspace)
    setOpen(false)
    // Aqui você pode implementar a lógica para mudar o contexto do workspace
    router.push(`/dashboard?workspace=${workspace.id}`)
  }

  return (
    <Dialog open={showNewWorkspaceDialog} onOpenChange={setShowNewWorkspaceDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Selecione um workspace"
            className="w-[200px] justify-between"
          >
            {isLoading ? "Carregando..." : selectedWorkspace ? selectedWorkspace.name : "Selecione um workspace"}
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Buscar workspace..." />
              <CommandEmpty>Nenhum workspace encontrado.</CommandEmpty>
              {!isLoading && (
                <CommandGroup heading="Workspaces">
                  {workspaces.map((workspace) => (
                    <CommandItem key={workspace.id} onSelect={() => selectWorkspace(workspace)} className="text-sm">
                      {workspace.name}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedWorkspace?.id === workspace.id ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setOpen(false)
                    setShowNewWorkspaceDialog(true)
                  }}
                >
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Criar Workspace
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar workspace</DialogTitle>
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
          <Button variant="outline" onClick={() => setShowNewWorkspaceDialog(false)}>
            Cancelar
          </Button>
          <Button onClick={createWorkspace} disabled={isCreating}>
            {isCreating ? "Criando..." : "Criar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

