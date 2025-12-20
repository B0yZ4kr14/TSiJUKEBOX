# 🏗️ Arquitetura do Sistema

Visão técnica da arquitetura do TSiJUKEBOX para desenvolvedores.

---

## 📐 Visão Geral

```
┌─────────────────────────────────────────────────────────────┐
│                        TSiJUKEBOX                           │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   React     │  │  TanStack   │  │     Tailwind        │  │
│  │   18.3      │  │   Query     │  │       CSS           │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    Components                           ││
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐          ││
│  │  │Player│ │Queue │ │Browse│ │Admin │ │Settings│         ││
│  │  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘          ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                      Hooks                              ││
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐                ││
│  │  │usePlayer │ │useSpotify│ │useYouTube│                ││
│  │  └──────────┘ └──────────┘ └──────────┘                ││
│  └─────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│                     Supabase (Backend)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │PostgreSQL│  │   Auth   │  │  Storage │  │Edge Funcs│    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Estrutura de Pastas

```
TSiJUKEBOX/
├── src/
│   ├── components/          # Componentes React
│   │   ├── player/          # Componentes do player
│   │   ├── settings/        # Configurações
│   │   ├── spotify/         # Integração Spotify
│   │   ├── youtube/         # Integração YouTube
│   │   ├── ui/              # shadcn/ui components
│   │   └── auth/            # Autenticação
│   │
│   ├── hooks/               # Custom hooks
│   │   ├── player/          # Hooks de reprodução
│   │   ├── spotify/         # Hooks Spotify
│   │   ├── youtube/         # Hooks YouTube
│   │   ├── auth/            # Hooks de auth
│   │   ├── common/          # Hooks utilitários
│   │   └── system/          # Hooks de sistema
│   │
│   ├── contexts/            # React Contexts
│   │   ├── SettingsContext
│   │   ├── UserContext
│   │   ├── SpotifyContext
│   │   └── YouTubeMusicContext
│   │
│   ├── lib/                 # Utilitários
│   │   ├── api/             # Clientes API
│   │   ├── auth/            # Autenticação
│   │   └── utils.ts         # Funções helper
│   │
│   ├── pages/               # Páginas/Rotas
│   ├── types/               # TypeScript types
│   └── i18n/                # Internacionalização
│
├── supabase/
│   ├── functions/           # Edge Functions
│   │   ├── spotify-auth/
│   │   ├── youtube-music-auth/
│   │   ├── lyrics-search/
│   │   └── ...
│   └── migrations/          # DB migrations
│
├── docs/                    # Documentação
├── e2e/                     # Testes E2E
├── scripts/                 # Scripts de build/deploy
└── packaging/               # Pacotes de distribuição
```

---

## 🔧 Stack Tecnológico

### Frontend

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| React | 18.3 | UI Framework |
| TypeScript | 5.0 | Type Safety |
| Vite | 5.x | Build Tool |
| Tailwind CSS | 3.x | Styling |
| TanStack Query | 5.x | Server State |
| React Router | 6.x | Routing |
| Framer Motion | 11.x | Animations |
| shadcn/ui | Latest | UI Components |

### Backend

| Tecnologia | Propósito |
|------------|-----------|
| Supabase | BaaS (Backend as a Service) |
| PostgreSQL | Database |
| Edge Functions | Serverless Logic |
| Realtime | WebSocket subscriptions |
| Storage | File storage |

### Integrações

| Serviço | API |
|---------|-----|
| Spotify | Web API + Playback SDK |
| YouTube Music | ytmusicapi |
| Storj | S3-compatible storage |
| Last.fm | Scrobbling API |

---

## 🔄 Fluxo de Dados

### Reprodução de Música

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  User   │────▶│ UI Click│────▶│usePlayer│────▶│ Provider│
│ Action  │     │Component│     │  Hook   │     │  API    │
└─────────┘     └─────────┘     └─────────┘     └─────────┘
                                     │               │
                                     ▼               ▼
                               ┌─────────┐     ┌─────────┐
                               │  Queue  │◀────│ Stream  │
                               │ Context │     │  Audio  │
                               └─────────┘     └─────────┘
```

### Autenticação

```
┌─────────┐     ┌─────────┐     ┌─────────┐
│  Login  │────▶│Supabase │────▶│   JWT   │
│  Form   │     │  Auth   │     │  Token  │
└─────────┘     └─────────┘     └─────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    ▼                ▼                ▼
              ┌─────────┐     ┌─────────┐     ┌─────────┐
              │  User   │     │   RLS   │     │ Session │
              │ Context │     │ Policies│     │ Storage │
              └─────────┘     └─────────┘     └─────────┘
```

---

## 🧩 Padrões de Design

### Component Composition
```tsx
// Componentes compostos para flexibilidade
<Player>
  <Player.Controls />
  <Player.Progress />
  <Player.Queue />
</Player>
```

### Custom Hooks
```tsx
// Lógica encapsulada em hooks
const { play, pause, next, isPlaying } = usePlayer();
const { search, results, loading } = useSpotifySearch();
```

### Context Providers
```tsx
// Estado global via Context
<SettingsProvider>
  <UserProvider>
    <SpotifyProvider>
      <App />
    </SpotifyProvider>
  </UserProvider>
</SettingsProvider>
```

### Type-Safe APIs
```tsx
// Types derivados do Supabase
import type { Database } from '@/integrations/supabase/types';
type PlaybackStats = Database['public']['Tables']['playback_stats']['Row'];
```

---

## 📦 Edge Functions

### Estrutura
```typescript
// supabase/functions/example/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  // CORS headers
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { action } = await req.json();
    // Logic here
    return new Response(JSON.stringify({ success: true }));
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 400 
    });
  }
});
```

### Funções Disponíveis
| Função | Propósito |
|--------|-----------|
| spotify-auth | OAuth Spotify |
| youtube-music-auth | OAuth YouTube |
| lyrics-search | Busca de letras |
| github-repo | Acesso ao GitHub |
| track-playback | Registrar reprodução |

---

## 🗄️ Database Schema

### Diagrama ER
```
┌─────────────────┐     ┌─────────────────┐
│   auth.users    │     │   user_roles    │
├─────────────────┤     ├─────────────────┤
│ id (PK)         │◀────│ user_id (FK)    │
│ email           │     │ role            │
│ ...             │     │ created_at      │
└─────────────────┘     └─────────────────┘

┌─────────────────┐     ┌─────────────────┐
│ playback_stats  │     │  notifications  │
├─────────────────┤     ├─────────────────┤
│ id (PK)         │     │ id (PK)         │
│ track_id        │     │ title           │
│ track_name      │     │ message         │
│ artist_name     │     │ type            │
│ provider        │     │ read            │
│ played_at       │     │ created_at      │
└─────────────────┘     └─────────────────┘
```

---

## 🔐 Segurança

### Row Level Security (RLS)
Todas as tabelas possuem políticas de segurança:
```sql
-- Apenas usuários autenticados podem inserir
CREATE POLICY "Users can insert own data"
ON playback_stats FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);
```

### RBAC
Sistema de papéis:
- **admin**: Acesso total
- **user**: Acesso padrão
- **newbie**: Acesso restrito

### Tokens
- JWT para autenticação
- Refresh tokens para sessões longas
- Access tokens temporários para APIs

---

## 📊 Performance

### Otimizações
- **Code splitting**: Páginas lazy-loaded
- **Query caching**: TanStack Query com staleTime
- **Image optimization**: Thumbnails e lazy loading
- **Bundle size**: Tree shaking e minificação

### Métricas Alvo
| Métrica | Alvo | Atual |
|---------|------|-------|
| FCP | < 1.5s | ~1.2s |
| LCP | < 2.5s | ~2.0s |
| TTI | < 3.5s | ~3.0s |
| Bundle | < 500KB | ~400KB |

---

## 📚 Mais Informações

- [API Reference](Dev-API-Reference.md)
- [Guia de Contribuição](Dev-Contributing.md)
- [Guia de Testes](Dev-Testing.md)
- [Documentação Completa](../ARCHITECTURE.md)

---

[← Acessibilidade](Config-Accessibility.md) | [Próximo: API Reference →](Dev-API-Reference.md)
