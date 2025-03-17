import { NextResponse } from "next/server"
import { createTestUser, setupSupabaseTables } from "@/lib/supabase-setup"

export async function GET() {
  try {
    // Configurar tabelas
    await setupSupabaseTables()

    // Criar usuário de teste
    const testUser = await createTestUser()

    return NextResponse.json({
      success: true,
      message: "Setup completed successfully",
      testUser: testUser
        ? {
            email: testUser.email,
            password: testUser.password,
          }
        : null,
    })
  } catch (error) {
    console.error("Setup error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to complete setup",
      },
      { status: 500 },
    )
  }
}

