import { Check, X } from "lucide-react"

interface PasswordRequirementsProps {
  password: string
  confirmPassword: string
}

export function PasswordRequirements({ password, confirmPassword }: PasswordRequirementsProps) {
  const requirements = [
    {
      text: "Mínimo de 8 caracteres",
      met: password.length >= 8,
    },
    {
      text: "Pelo menos uma letra maiúscula",
      met: /[A-Z]/.test(password),
    },
    {
      text: "Pelo menos uma letra minúscula",
      met: /[a-z]/.test(password),
    },
    {
      text: "Pelo menos um número",
      met: /[0-9]/.test(password),
    },
    {
      text: "Pelo menos um caractere especial",
      met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
    {
      text: "As senhas são iguais",
      met: password && confirmPassword && password === confirmPassword,
    },
  ]

  return (
    <div className="space-y-2 text-sm mt-2">
      <p className="text-muted-foreground font-medium">Requisitos da senha:</p>
      <div className="space-y-1">
        {requirements.map((req, index) => (
          <div key={index} className="flex items-center space-x-2">
            {req.met ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <X className="w-4 h-4 text-destructive" />
            )}
            <span className={req.met ? "text-green-500" : "text-destructive"}>
              {req.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
} 