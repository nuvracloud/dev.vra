import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, MessageSquare, Users } from "lucide-react"

export function DashboardCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Agentes Ativos</CardTitle>
          <Bot className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2</div>
          <p className="text-xs text-muted-foreground">+0% em relação ao mês passado</p>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">Limite do plano: 3 agentes</p>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Mensagens Enviadas</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">245</div>
          <p className="text-xs text-muted-foreground">+12% em relação ao mês passado</p>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">Limite do plano: 1.000 mensagens</p>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Contatos</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12</div>
          <p className="text-xs text-muted-foreground">+3 novos contatos este mês</p>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">Sem limite no plano atual</p>
        </CardFooter>
      </Card>
    </div>
  )
}

