# 🗄️ Configuração de Banco de Dados

Guia de configuração e gerenciamento do banco de dados do TSiJUKEBOX.

---

## 🏗️ Arquitetura

O TSiJUKEBOX utiliza **Supabase** (PostgreSQL) como backend:

```
┌─────────────────┐     ┌─────────────────┐
│   TSiJUKEBOX    │────▶│    Supabase     │
│   (Frontend)    │     │   (PostgreSQL)  │
└─────────────────┘     └─────────────────┘
         │                       │
         │                       │
         ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│  Edge Functions │     │  Row Level      │
│  (Serverless)   │     │  Security (RLS) │
└─────────────────┘     └─────────────────┘
```

---

## 📊 Tabelas Principais

### `playback_stats`
Registra histórico de reprodução.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único |
| track_id | TEXT | ID da faixa |
| track_name | TEXT | Nome da música |
| artist_name | TEXT | Nome do artista |
| provider | TEXT | Spotify/YouTube/Local |
| played_at | TIMESTAMP | Data/hora |
| duration_ms | INTEGER | Duração em ms |
| completed | BOOLEAN | Se tocou completa |

### `notifications`
Sistema de notificações.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único |
| title | TEXT | Título da notificação |
| message | TEXT | Conteúdo |
| type | TEXT | Tipo (info/warning/error) |
| read | BOOLEAN | Status de leitura |
| created_at | TIMESTAMP | Data de criação |

### `user_roles`
Papéis de usuário (RBAC).

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único |
| user_id | UUID | Referência ao usuário |
| role | ENUM | admin/user/newbie |
| created_at | TIMESTAMP | Data de atribuição |

### `code_scan_history`
Histórico de análises de código.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único |
| file_name | TEXT | Arquivo analisado |
| score | INTEGER | Pontuação (0-100) |
| issues | JSONB | Lista de problemas |
| scanned_at | TIMESTAMP | Data da análise |

---

## 🔐 Row Level Security (RLS)

Todas as tabelas possuem RLS habilitado para segurança.

### Políticas Padrão

```sql
-- Usuários podem ver seus próprios dados
CREATE POLICY "Users can view own data" 
ON playback_stats FOR SELECT 
USING (auth.uid() = user_id);

-- Usuários podem inserir próprios dados
CREATE POLICY "Users can insert own data" 
ON playback_stats FOR INSERT 
WITH CHECK (auth.uid() = user_id);
```

### Verificar Políticas
```sql
SELECT * FROM pg_policies 
WHERE tablename = 'playback_stats';
```

---

## ⚙️ Configuração

### Variáveis de Ambiente

O TSiJUKEBOX usa estas variáveis (configuradas automaticamente):

```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbG...
VITE_SUPABASE_PROJECT_ID=xxx
```

### Conexão Manual

Se precisar conectar diretamente:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);
```

---

## 📈 Performance

### Índices Recomendados

```sql
-- Busca rápida por data
CREATE INDEX idx_playback_played_at 
ON playback_stats(played_at DESC);

-- Busca por usuário
CREATE INDEX idx_playback_user 
ON playback_stats(user_id);

-- Busca por provedor
CREATE INDEX idx_playback_provider 
ON playback_stats(provider);
```

### Vacuum e Analyze

Execute periodicamente:
```sql
VACUUM ANALYZE playback_stats;
VACUUM ANALYZE notifications;
```

---

## 💾 Backup

### Backup via Supabase
1. Acesse o dashboard Supabase
2. Vá em **Database > Backups**
3. Backups automáticos diários disponíveis

### Backup Manual
```bash
pg_dump -h db.xxx.supabase.co \
  -U postgres \
  -d postgres \
  -F c \
  -f backup.dump
```

### Restaurar
```bash
pg_restore -h db.xxx.supabase.co \
  -U postgres \
  -d postgres \
  backup.dump
```

---

## 🔧 Manutenção

### Verificar Tamanho das Tabelas
```sql
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size(tablename::text)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(tablename::text) DESC;
```

### Limpar Dados Antigos
```sql
-- Remover playbacks com mais de 1 ano
DELETE FROM playback_stats 
WHERE played_at < NOW() - INTERVAL '1 year';

-- Remover notificações lidas antigas
DELETE FROM notifications 
WHERE read = true 
AND created_at < NOW() - INTERVAL '30 days';
```

### Verificar Conexões Ativas
```sql
SELECT * FROM pg_stat_activity 
WHERE datname = 'postgres';
```

---

## 🚨 Troubleshooting

### Erro de conexão
1. Verifique variáveis de ambiente
2. Teste conectividade de rede
3. Verifique status do Supabase

### Query lenta
1. Verifique se índices existem
2. Analise com `EXPLAIN ANALYZE`
3. Considere particionar tabelas grandes

### RLS bloqueando acesso
1. Verifique se usuário está autenticado
2. Revise políticas da tabela
3. Teste como usuário específico

---

## 📚 Referências

- [Documentação Supabase](https://supabase.com/docs)
- [PostgreSQL Manual](https://www.postgresql.org/docs/)
- [Guia de RLS](https://supabase.com/docs/guides/auth/row-level-security)

---

[← Administração](User-Guide-Admin.md) | [Próximo: Backup na Nuvem →](Config-Cloud-Backup.md)
