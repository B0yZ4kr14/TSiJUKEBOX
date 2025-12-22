# 🛣️ Sistema de Rotas - TSiJUKEBOX

<p align="center">
  <strong>Documentação Completa do Sistema de Rotas</strong>
  <br>
  Versão 4.2.0
</p>

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Categorias de Rotas](#categorias-de-rotas)
- [Tabela Completa de Rotas](#tabela-completa-de-rotas)
- [Permissões](#permissões)
- [Uso no Código](#uso-no-código)
- [Testes](#testes)

---

## Visão Geral

O sistema de rotas do TSiJUKEBOX foi refatorado para usar uma arquitetura centralizada, facilitando manutenção, testes e adição de novas rotas.

### Características

- **Centralizado**: Todas as rotas definidas em `src/routes/index.tsx`
- **Tipado**: Interface `RouteConfig` com suporte a TypeScript
- **Categorizado**: 6 categorias de rotas + catch-all para 404
- **Permissões**: Sistema de permissões integrado
- **Lazy Loading**: Páginas carregadas sob demanda

---

## Arquitetura

```
src/
├── routes/
│   └── index.tsx          # Definição centralizada de rotas
├── pages/
│   ├── public/            # Páginas públicas
│   ├── admin/             # Páginas administrativas
│   ├── dashboards/        # Dashboards
│   ├── spotify/           # Integração Spotify
│   ├── youtube/           # Integração YouTube Music
│   ├── settings/          # Configurações
│   ├── brand/             # Identidade visual
│   ├── tools/             # Ferramentas
│   └── social/            # Jam Session
└── App.tsx                # Usa allRoutes
```

### Diagrama de Fluxo

```mermaid
graph TD
    A[App.tsx] --> B[BrowserRouter]
    B --> C[Routes]
    C --> D{allRoutes.map}
    
    D --> E[publicRoutes]
    D --> F[protectedRoutes]
    D --> G[dashboardRoutes]
    D --> H[spotifyRoutes]
    D --> I[youtubeRoutes]
    D --> J[adminRoutes]
    D --> K[catchAllRoute]
    
    E --> L[/]
    E --> M[/auth]
    E --> N[/help]
    
    F --> O[/settings]
    F --> P[/dashboard]
    
    G --> Q[/dashboard/health]
    G --> R[/dashboard/github]
    
    H --> S[/spotify]
    H --> T[/spotify/search]
    
    I --> U[/youtube-music]
    I --> V[/youtube-music/search]
    
    J --> W[/admin]
    J --> X[/admin/logs]
    
    K --> Y[/*]
```

---

## Categorias de Rotas

### 1. Public Routes (publicRoutes)

Rotas acessíveis sem autenticação.

| Path | Componente | Descrição |
|------|------------|-----------|
| `/` | `Index` | Página inicial |
| `/auth` | `Auth` | Login/Registro |
| `/setup-wizard` | `SetupWizard` | Configuração inicial |
| `/help` | `Help` | Ajuda |
| `/wiki` | `Wiki` | Documentação |
| `/landing` | `LandingPage` | Landing page |
| `/install` | `Install` | Instruções de instalação |
| `/changelog` | `Changelog` | Histórico de versões |
| `/showcase` | `ComponentsShowcase` | Galeria de componentes |

### 2. Protected Routes (protectedRoutes)

Requerem autenticação e permissões específicas.

| Path | Componente | Permissão |
|------|------------|-----------|
| `/settings` | `Settings` | `canAccessSettings` |
| `/theme-preview` | `ThemePreview` | `canAccessSettings` |
| `/diagnostics` | `SystemDiagnostics` | `canAccessSettings` |
| `/lyrics-test` | `LyricsTest` | `canAccessSettings` |
| `/wcag-exceptions` | `WcagExceptions` | `canAccessSettings` |

### 3. Dashboard Routes (dashboardRoutes)

Dashboards de monitoramento do sistema.

| Path | Componente | Permissão |
|------|------------|-----------|
| `/dashboard` | `Dashboard` | `canAccessSystemControls` |
| `/dashboard/health` | `HealthDashboard` | `canAccessSystemControls` |
| `/dashboard/github` | `GitHubDashboard` | `canAccessSystemControls` |
| `/dashboard/kiosk` | `KioskMonitorDashboard` | `canAccessSystemControls` |
| `/dashboard/clients` | `ClientsMonitorDashboard` | `canAccessSystemControls` |
| `/dashboard/stats` | `JukeboxStatsDashboard` | `canAccessSystemControls` |
| `/dashboard/a11y` | `A11yDashboard` | `canAccessSystemControls` |

### 4. Spotify Routes (spotifyRoutes)

Integração com Spotify.

| Path | Componente | Descrição |
|------|------------|-----------|
| `/spotify` | `SpotifyBrowser` | Navegador |
| `/spotify/search` | `SpotifySearch` | Busca |
| `/spotify/library` | `SpotifyLibrary` | Biblioteca |
| `/spotify/playlist` | `SpotifyPlaylist` | Playlists |

### 5. YouTube Routes (youtubeRoutes)

Integração com YouTube Music.

| Path | Componente | Descrição |
|------|------------|-----------|
| `/youtube-music` | `YouTubeMusicBrowser` | Navegador |
| `/youtube-music/search` | `YouTubeMusicSearch` | Busca |
| `/youtube-music/library` | `YouTubeMusicLibrary` | Biblioteca |
| `/youtube-music/playlist` | `YouTubeMusicPlaylist` | Playlists |

### 6. Admin Routes (adminRoutes)

Administração do sistema.

| Path | Componente | Permissão |
|------|------------|-----------|
| `/admin` | `Admin` | `canManageUsers` |
| `/admin/logs` | `AdminLogs` | `canManageUsers` |
| `/admin/feedback` | `AdminFeedback` | `canManageUsers` |
| `/admin/library` | `AdminLibrary` | `canManageUsers` |

### 7. Catch-All Route

| Path | Componente | Descrição |
|------|------------|-----------|
| `*` | `NotFound` | Página 404 |

---

## Tabela Completa de Rotas

| # | Path | Categoria | Componente | Permissão | Lazy |
|---|------|-----------|------------|-----------|------|
| 1 | `/` | Public | Index | - | ❌ |
| 2 | `/auth` | Public | Auth | - | ❌ |
| 3 | `/setup-wizard` | Public | SetupWizard | - | ❌ |
| 4 | `/help` | Public | Help | - | ✅ |
| 5 | `/wiki` | Public | Wiki | - | ✅ |
| 6 | `/landing` | Public | LandingPage | - | ✅ |
| 7 | `/install` | Public | Install | - | ✅ |
| 8 | `/changelog` | Public | Changelog | - | ✅ |
| 9 | `/showcase` | Public | ComponentsShowcase | - | ✅ |
| 10 | `/settings` | Protected | Settings | canAccessSettings | ✅ |
| 11 | `/theme-preview` | Protected | ThemePreview | canAccessSettings | ✅ |
| 12 | `/diagnostics` | Protected | SystemDiagnostics | canAccessSettings | ✅ |
| 13 | `/lyrics-test` | Protected | LyricsTest | canAccessSettings | ✅ |
| 14 | `/wcag-exceptions` | Protected | WcagExceptions | canAccessSettings | ✅ |
| 15 | `/dashboard` | Dashboard | Dashboard | canAccessSystemControls | ✅ |
| 16 | `/dashboard/health` | Dashboard | HealthDashboard | canAccessSystemControls | ✅ |
| 17 | `/dashboard/github` | Dashboard | GitHubDashboard | canAccessSystemControls | ✅ |
| 18 | `/dashboard/kiosk` | Dashboard | KioskMonitorDashboard | canAccessSystemControls | ✅ |
| 19 | `/dashboard/clients` | Dashboard | ClientsMonitorDashboard | canAccessSystemControls | ✅ |
| 20 | `/dashboard/stats` | Dashboard | JukeboxStatsDashboard | canAccessSystemControls | ✅ |
| 21 | `/dashboard/a11y` | Dashboard | A11yDashboard | canAccessSystemControls | ✅ |
| 22 | `/spotify` | Spotify | SpotifyBrowser | - | ✅ |
| 23 | `/spotify/search` | Spotify | SpotifySearch | - | ✅ |
| 24 | `/spotify/library` | Spotify | SpotifyLibrary | - | ✅ |
| 25 | `/spotify/playlist` | Spotify | SpotifyPlaylist | - | ✅ |
| 26 | `/youtube-music` | YouTube | YouTubeMusicBrowser | - | ✅ |
| 27 | `/youtube-music/search` | YouTube | YouTubeMusicSearch | - | ✅ |
| 28 | `/youtube-music/library` | YouTubeMusicLibrary | - | ✅ |
| 29 | `/youtube-music/playlist` | YouTubeMusicPlaylist | - | ✅ |
| 30 | `/admin` | Admin | Admin | canManageUsers | ✅ |
| 31 | `/admin/logs` | Admin | AdminLogs | canManageUsers | ✅ |
| 32 | `/admin/feedback` | Admin | AdminFeedback | canManageUsers | ✅ |
| 33 | `/admin/library` | Admin | AdminLibrary | canManageUsers | ✅ |
| 34 | `/brand` | Public | BrandGuidelines | - | ✅ |
| 35 | `/logo-preview` | Public | LogoGitHubPreview | - | ✅ |
| 36 | `/jam/:code?` | Social | JamSession | - | ✅ |
| 37 | `/version-compare` | Tools | VersionComparison | canAccessSettings | ✅ |
| 38 | `*` | 404 | NotFound | - | ❌ |

---

## Permissões

### Tipos de Permissão

```typescript
type RequiredPermission = 
  | 'canAccessSettings' 
  | 'canManageUsers' 
  | 'canAccessSystemControls';
```

### Mapeamento Role → Permissão

| Role | canAccessSettings | canManageUsers | canAccessSystemControls |
|------|-------------------|----------------|-------------------------|
| `admin` | ✅ | ✅ | ✅ |
| `user` | ✅ | ❌ | ✅ |
| `newbie` | ❌ | ❌ | ❌ |

---

## Uso no Código

### Importação

```typescript
import { 
  allRoutes, 
  publicRoutes,
  protectedRoutes,
  dashboardRoutes,
  spotifyRoutes,
  youtubeRoutes,
  adminRoutes,
  getProtectedRoutes,
  getRoutesByCategory 
} from '@/routes';
```

### Renderização de Rotas

```tsx
// App.tsx
import { allRoutes } from '@/routes';

function App() {
  return (
    <Routes>
      {allRoutes.map(route => (
        <Route 
          key={route.path} 
          path={route.path} 
          element={route.element} 
        />
      ))}
    </Routes>
  );
}
```

### Obter Rotas Protegidas

```typescript
const protectedRoutes = getProtectedRoutes();
// Retorna apenas rotas com requiredPermission definido
```

### Obter Rotas por Categoria

```typescript
const { 
  public: publicRoutes,
  protected: protectedRoutes,
  dashboards,
  spotify,
  youtube,
  admin 
} = getRoutesByCategory();
```

### Verificar Permissão

```typescript
import { RouteConfig } from '@/routes';

function hasAccess(route: RouteConfig, userPermissions: string[]): boolean {
  if (!route.requiredPermission) return true;
  return userPermissions.includes(route.requiredPermission);
}
```

---

## Testes

### Arquivo de Testes E2E

Os testes de validação de rotas estão em:

```
e2e/specs/routes-validation.spec.ts
```

### Executar Testes

```bash
# Todos os testes E2E
npx playwright test

# Apenas testes de rotas
npx playwright test routes-validation

# Com UI
npx playwright test --ui
```

### Cobertura de Testes

| Categoria | Testes | Status |
|-----------|--------|--------|
| Public Routes | ✅ | Validação de carregamento |
| Spotify Routes | ✅ | Validação de carregamento |
| YouTube Routes | ✅ | Validação de carregamento |
| Dashboard Routes | ✅ | Validação de redirecionamento |
| Protected Routes | ✅ | Validação de autenticação |
| 404 Handling | ✅ | Validação de catch-all |
| Navigation | ✅ | Back/Forward browser |
| Performance | ✅ | Tempo de carregamento |

---

## Manutenção

### Adicionar Nova Rota

1. Criar componente em `src/pages/{categoria}/`
2. Exportar no barrel `src/pages/{categoria}/index.ts`
3. Adicionar em `src/routes/index.tsx` na categoria apropriada
4. Adicionar teste em `e2e/specs/routes-validation.spec.ts`
5. Atualizar esta documentação

### Exemplo

```typescript
// 1. Criar componente
// src/pages/tools/NewTool.tsx

// 2. Exportar
// src/pages/tools/index.ts
export { default as NewTool } from './NewTool';

// 3. Adicionar rota
// src/routes/index.tsx
const toolsRoutes: RouteConfig[] = [
  // ...existing routes
  { path: '/tools/new-tool', element: <NewTool /> },
];

// 4. Adicionar teste
// e2e/specs/routes-validation.spec.ts
const toolsRoutes = [
  // ...existing routes
  { path: '/tools/new-tool', name: 'New Tool' },
];
```

---

<p align="center">
  <strong>TSiJUKEBOX Enterprise</strong> — Sistema de Rotas
  <br>
  Última atualização: Dezembro 2025
</p>
