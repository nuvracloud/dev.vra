import type { Metadata } from "next"
import { ConversationsLayout } from "@/components/conversations/conversations-layout"

export const metadata: Metadata = {
  title: "Conversas | AI Agent Platform",
  description: "Gerencie suas conversas com clientes e leads",
}

export default function ConversationsPage() {
  return <ConversationsLayout />
}

