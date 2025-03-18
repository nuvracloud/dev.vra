import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { ReactNode } from "react"

interface FormErrorProps {
  message?: ReactNode
}

export function FormError({ message }: FormErrorProps) {
  if (!message) return null

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
} 