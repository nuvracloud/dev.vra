import { supabase } from "./supabase"

export async function setupSupabaseTables() {
  console.log("Setting up Supabase tables...")

  // Verificar se a tabela de usuários existe
  const { error: userTableError } = await supabase.from("users").select("id").limit(1)

  if (userTableError) {
    console.log("Users table doesn't exist, creating...")
    // Criar tabela de usuários
    const { error } = await supabase.rpc("create_users_table")
    if (error) console.error("Error creating users table:", error)
  }

  // Verificar se a tabela de workspaces existe
  const { error: workspaceTableError } = await supabase.from("workspaces").select("id").limit(1)

  if (workspaceTableError) {
    console.log("Workspaces table doesn't exist, creating...")
    // Criar tabela de workspaces
    const { error } = await supabase.rpc("create_workspaces_table")
    if (error) console.error("Error creating workspaces table:", error)
  }

  console.log("Supabase setup complete")
}

// Função para criar um usuário de teste
export async function createTestUser() {
  const testEmail = "teste@exemplo.com"
  const testPassword = "senha123"

  // Verificar se o usuário já existe
  const { data: existingUser } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  })

  if (existingUser.user) {
    console.log("Test user already exists")
    return { email: testEmail, password: testPassword }
  }

  // Criar usuário de teste
  const { data, error } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
    options: {
      data: {
        name: "Usuário Teste",
      },
    },
  })

  if (error) {
    console.error("Error creating test user:", error)
    return null
  }

  console.log("Test user created:", data.user?.email)

  // Criar entrada na tabela de usuários
  if (data.user) {
    const { error: profileError } = await supabase.from("users").insert([
      {
        id: data.user.id,
        email: data.user.email,
        name: "Usuário Teste",
      },
    ])

    if (profileError) console.error("Error creating user profile:", profileError)

    // Criar workspace padrão
    const { error: workspaceError } = await supabase.from("workspaces").insert([
      {
        name: "Workspace de Teste",
        description: "Workspace padrão para testes",
        user_id: data.user.id,
      },
    ])

    if (workspaceError) console.error("Error creating default workspace:", workspaceError)
  }

  return { email: testEmail, password: testPassword }
}

