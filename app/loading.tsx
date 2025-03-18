import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-4 text-muted-foreground">Carregando...</p>
    </div>
  )
} 