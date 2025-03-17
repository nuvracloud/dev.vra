-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Habilitar RLS para a tabela de usuários
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Políticas para a tabela de usuários
CREATE POLICY "Usuários podem ver seus próprios dados"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seus próprios dados"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Criar tabela de workspaces
CREATE TABLE IF NOT EXISTS public.workspaces (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Habilitar RLS para a tabela de workspaces
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

-- Políticas para a tabela de workspaces
CREATE POLICY "Usuários podem ver seus próprios workspaces"
  ON public.workspaces FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seus próprios workspaces"
  ON public.workspaces FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios workspaces"
  ON public.workspaces FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem excluir seus próprios workspaces"
  ON public.workspaces FOR DELETE
  USING (auth.uid() = user_id);

-- Criar funções para configuração
CREATE OR REPLACE FUNCTION create_users_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE '
    CREATE TABLE IF NOT EXISTS public.users (
      id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      email TEXT NOT NULL UNIQUE,
      name TEXT,
      avatar_url TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );
    
    -- Habilitar RLS para a tabela de usuários
    ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
    
    -- Políticas para a tabela de usuários
    CREATE POLICY "Usuários podem ver seus próprios dados"
      ON public.users FOR SELECT
      USING (auth.uid() = id);
    
    CREATE POLICY "Usuários podem atualizar seus próprios dados"
      ON public.users FOR UPDATE
      USING (auth.uid() = id);
  ';
END;
$$;

-- Função para criar tabela de workspaces
CREATE OR REPLACE FUNCTION create_workspaces_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE '
    CREATE TABLE IF NOT EXISTS public.workspaces (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      logo_url TEXT,
      user_id UUID REFERENCES auth.users(id) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );
    
    -- Habilitar RLS para a tabela de workspaces
    ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
    
    -- Políticas para a tabela de workspaces
    CREATE POLICY "Usuários podem ver seus próprios workspaces"
      ON public.workspaces FOR SELECT
      USING (auth.uid() = user_id);
    
    CREATE POLICY "Usuários podem criar seus próprios workspaces"
      ON public.workspaces FOR INSERT
      WITH CHECK (auth.uid() = user_id);
    
    CREATE POLICY "Usuários podem atualizar seus próprios workspaces"
      ON public.workspaces FOR UPDATE
      USING (auth.uid() = user_id);
    
    CREATE POLICY "Usuários podem excluir seus próprios workspaces"
      ON public.workspaces FOR DELETE
      USING (auth.uid() = user_id);
  ';
END;
$$;

