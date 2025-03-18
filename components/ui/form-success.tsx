import { CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface FormSuccessProps {
  message?: string
}

export function FormSuccess({ message }: FormSuccessProps) {
  if (!message) return null

  return (
    <Alert className="bg-green-50 text-green-800 border-green-200">
      <CheckCircle2 className="h-4 w-4 text-green-600" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
} 