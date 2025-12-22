-- Tabela para comandos remotos de kiosks
CREATE TABLE public.kiosk_commands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    machine_id TEXT NOT NULL,
    command TEXT NOT NULL,
    params JSONB DEFAULT '{}',
    status TEXT DEFAULT 'pending',
    result TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    executed_at TIMESTAMPTZ,
    created_by UUID
);

-- Índices para performance
CREATE INDEX idx_kiosk_commands_machine_id ON public.kiosk_commands(machine_id);
CREATE INDEX idx_kiosk_commands_status ON public.kiosk_commands(status);
CREATE INDEX idx_kiosk_commands_pending ON public.kiosk_commands(machine_id, status) WHERE status = 'pending';

-- Habilitar RLS
ALTER TABLE public.kiosk_commands ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Allow public insert kiosk_commands" ON public.kiosk_commands
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read kiosk_commands" ON public.kiosk_commands
    FOR SELECT USING (true);

CREATE POLICY "Allow public update kiosk_commands" ON public.kiosk_commands
    FOR UPDATE USING (true);

CREATE POLICY "Allow public delete kiosk_commands" ON public.kiosk_commands
    FOR DELETE USING (true);

-- Adicionar colunas extras à kiosk_connections se não existirem
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'kiosk_connections' AND column_name = 'cpu_usage_percent') THEN
        ALTER TABLE public.kiosk_connections ADD COLUMN cpu_usage_percent NUMERIC DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'kiosk_connections' AND column_name = 'memory_used_mb') THEN
        ALTER TABLE public.kiosk_connections ADD COLUMN memory_used_mb INTEGER DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'kiosk_connections' AND column_name = 'last_screenshot_url') THEN
        ALTER TABLE public.kiosk_connections ADD COLUMN last_screenshot_url TEXT;
    END IF;
END $$;

-- Habilitar realtime para comandos
ALTER PUBLICATION supabase_realtime ADD TABLE public.kiosk_commands;