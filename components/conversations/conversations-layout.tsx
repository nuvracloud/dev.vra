"use client"

import { useState } from "react"
import { ConversationsList } from "@/components/conversations/conversations-list"
import { ConversationPanel } from "@/components/conversations/conversation-panel"
import { ContactInfoPanel } from "@/components/conversations/contact-info-panel"

export function ConversationsLayout() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [showContactInfo, setShowContactInfo] = useState(false)

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      <div
        className={`border-r ${selectedConversationId ? "hidden md:block md:w-1/3 lg:w-1/4" : "w-full md:w-1/3 lg:w-1/4"}`}
      >
        <ConversationsList
          selectedConversationId={selectedConversationId}
          onSelectConversation={setSelectedConversationId}
        />
      </div>

      {selectedConversationId ? (
        <>
          <div className={`flex-1 ${showContactInfo ? "hidden md:block" : "block"}`}>
            <ConversationPanel
              conversationId={selectedConversationId}
              onBack={() => setSelectedConversationId(null)}
              onToggleContactInfo={() => setShowContactInfo(!showContactInfo)}
              showContactInfo={showContactInfo}
            />
          </div>

          {showContactInfo && (
            <div className="w-full md:w-1/3 lg:w-1/4 border-l">
              <ContactInfoPanel conversationId={selectedConversationId} onClose={() => setShowContactInfo(false)} />
            </div>
          )}
        </>
      ) : (
        <div className="hidden md:flex md:flex-1 items-center justify-center bg-muted/10">
          <div className="text-center">
            <h3 className="text-xl font-medium">Selecione uma conversa</h3>
            <p className="text-muted-foreground mt-2">Escolha uma conversa da lista para começar a interagir</p>
          </div>
        </div>
      )}
    </div>
  )
}

