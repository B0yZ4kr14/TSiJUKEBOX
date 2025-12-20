# 📚 Referência da API

Documentação completa das APIs do TSiJUKEBOX.

---

## 🔗 Edge Functions

Base URL: `https://<project-id>.supabase.co/functions/v1`

### Autenticação

Todas as requests autenticadas requerem header:
```
Authorization: Bearer <access_token>
```

---

## 🎵 Spotify Auth

### `POST /spotify-auth`

Gerencia autenticação OAuth do Spotify.

**Request:**
```json
{
  "action": "getAuthUrl" | "exchangeCode" | "refreshToken",
  "code": "string (para exchangeCode)",
  "refreshToken": "string (para refreshToken)"
}
```

**Response (getAuthUrl):**
```json
{
  "url": "https://accounts.spotify.com/authorize?..."
}
```

**Response (exchangeCode):**
```json
{
  "access_token": "string",
  "refresh_token": "string",
  "expires_in": 3600
}
```

---

## 🎤 YouTube Music Auth

### `POST /youtube-music-auth`

Gerencia autenticação do YouTube Music.

**Request:**
```json
{
  "action": "getAuthUrl" | "exchangeCode" | "refreshToken"
}
```

---

## 📝 Lyrics Search

### `POST /lyrics-search`

Busca letras de músicas.

**Request:**
```json
{
  "track": "Nome da Música",
  "artist": "Nome do Artista"
}
```

**Response:**
```json
{
  "lyrics": "Texto da letra...",
  "synced": true,
  "source": "provider-name",
  "lrc": "[00:00.00]Linha 1\n[00:03.50]Linha 2..."
}
```

---

## 📊 Track Playback

### `POST /track-playback`

Registra reprodução de música.

**Request:**
```json
{
  "trackId": "string",
  "trackName": "string",
  "artistName": "string",
  "albumName": "string",
  "provider": "spotify" | "youtube" | "local",
  "durationMs": 180000,
  "completed": true
}
```

**Response:**
```json
{
  "success": true,
  "id": "uuid"
}
```

---

## 🔍 GitHub Repo

### `POST /github-repo`

Acessa informações do repositório GitHub.

**Request:**
```json
{
  "action": "contents" | "file" | "info" | "commits" | "releases",
  "path": "docs/README.md",
  "ref": "main"
}
```

**Response (contents):**
```json
{
  "data": [
    {
      "name": "README.md",
      "path": "docs/README.md",
      "type": "file",
      "size": 1234
    }
  ]
}
```

---

## 🔔 Alert Notifications

### `POST /alert-notifications`

Gerencia notificações de alerta.

**Request:**
```json
{
  "action": "create" | "list" | "markRead",
  "notification": {
    "title": "string",
    "message": "string",
    "type": "info" | "warning" | "error",
    "severity": "low" | "medium" | "high"
  }
}
```

---

## 📈 Installer Metrics

### `POST /installer-metrics`

Coleta métricas de instalação (anônimo).

**Request:**
```json
{
  "sessionId": "uuid",
  "status": "started" | "completed" | "failed",
  "distroName": "CachyOS",
  "distroFamily": "arch",
  "installerVersion": "2.0.0",
  "steps": [...],
  "errors": [...]
}
```

---

## 🔄 Code Scan

### `POST /code-scan`

Analisa código para qualidade.

**Request:**
```json
{
  "code": "function example() {...}",
  "fileName": "example.ts",
  "language": "typescript"
}
```

**Response:**
```json
{
  "score": 85,
  "issues": [
    {
      "line": 5,
      "severity": "warning",
      "message": "Unused variable"
    }
  ],
  "summary": "Good code quality with minor issues"
}
```

---

## 🗄️ Database Tables

### playback_stats

```sql
SELECT * FROM playback_stats 
WHERE played_at > NOW() - INTERVAL '7 days'
ORDER BY played_at DESC
LIMIT 100;
```

### notifications

```sql
SELECT * FROM notifications 
WHERE read = false 
ORDER BY created_at DESC;
```

### user_roles

```sql
SELECT * FROM user_roles 
WHERE user_id = auth.uid();
```

---

## 🔌 Client SDK

### Supabase Client

```typescript
import { supabase } from '@/integrations/supabase/client';

// Query data
const { data, error } = await supabase
  .from('playback_stats')
  .select('*')
  .order('played_at', { ascending: false })
  .limit(10);

// Insert data
const { data, error } = await supabase
  .from('playback_stats')
  .insert({
    track_id: 'abc123',
    track_name: 'Song Name',
    artist_name: 'Artist',
    provider: 'spotify'
  });

// Realtime subscription
const subscription = supabase
  .channel('notifications')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'notifications' },
    (payload) => console.log(payload)
  )
  .subscribe();
```

### Edge Function Call

```typescript
const { data, error } = await supabase.functions.invoke('lyrics-search', {
  body: {
    track: 'Bohemian Rhapsody',
    artist: 'Queen'
  }
});
```

---

## 📐 TypeScript Types

### Tipos Gerados

```typescript
import type { Database } from '@/integrations/supabase/types';

type PlaybackStats = Database['public']['Tables']['playback_stats']['Row'];
type Notification = Database['public']['Tables']['notifications']['Row'];
type UserRole = Database['public']['Tables']['user_roles']['Row'];
type AppRole = Database['public']['Enums']['app_role'];
```

### Tipos Customizados

```typescript
// src/types/track.ts
interface Track {
  id: string;
  name: string;
  artists: Artist[];
  album: Album;
  duration_ms: number;
  provider: 'spotify' | 'youtube' | 'local';
}

// src/types/user.ts
interface User {
  id: string;
  email: string;
  role: 'admin' | 'user' | 'newbie';
  permissions: Permission[];
}
```

---

## ⚠️ Códigos de Erro

| Código | Descrição |
|--------|-----------|
| 400 | Bad Request - Parâmetros inválidos |
| 401 | Unauthorized - Token inválido ou expirado |
| 403 | Forbidden - Sem permissão |
| 404 | Not Found - Recurso não encontrado |
| 429 | Too Many Requests - Rate limit |
| 500 | Internal Error - Erro no servidor |

### Formato de Erro

```json
{
  "error": {
    "code": "INVALID_TOKEN",
    "message": "The provided token is invalid or expired",
    "details": {}
  }
}
```

---

## 📊 Rate Limits

| Endpoint | Limite |
|----------|--------|
| Auth | 10 req/min |
| Lyrics | 30 req/min |
| Playback | 100 req/min |
| General | 60 req/min |

---

## 📚 Mais Informações

- [Documentação Supabase](https://supabase.com/docs)
- [Arquitetura do Sistema](Dev-Architecture.md)
- [Guia de Contribuição](Dev-Contributing.md)

---

[← Arquitetura](Dev-Architecture.md) | [Próximo: Contribuir →](Dev-Contributing.md)
