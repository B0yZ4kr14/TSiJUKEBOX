# Arquitetura de Hooks

Este documento descreve a estrutura organizacional e as convenções de uso dos hooks do projeto.

## Estrutura de Diretórios

```
src/hooks/
├── index.ts               # Barrel export principal (re-exporta tudo)
├── common/                # Hooks de uso geral (UI, i18n, utils)
│   ├── index.ts
│   ├── use-mobile.tsx
│   ├── use-toast.ts
│   ├── useDebounce.ts
│   ├── useFirstAccess.ts
│   ├── useGlobalSearch.ts
│   ├── usePWAInstall.ts
│   ├── useReadArticles.ts
│   ├── useRipple.ts
│   ├── useSettingsNotifications.ts
│   ├── useSettingsStatus.ts
│   ├── useSettingsTour.ts
│   ├── useSoundEffects.ts
│   ├── useThemeCustomizer.ts
│   ├── useTouchGestures.ts
│   ├── useTranslation.ts
│   └── useWikiBookmarks.ts
├── player/                # Hooks do player de música
│   ├── index.ts
│   ├── useLibrary.ts
│   ├── useLocalMusic.ts
│   ├── useLyrics.ts
│   ├── usePlaybackControls.ts
│   ├── usePlayer.ts
│   ├── useSpicetifyIntegration.ts
│   └── useVolume.ts
├── spotify/               # Hooks do Spotify
│   ├── index.ts
│   ├── useSpotifyBrowse.ts
│   ├── useSpotifyLibrary.ts
│   ├── useSpotifyPlayer.ts
│   ├── useSpotifyPlaylists.ts
│   ├── useSpotifyRecommendations.ts
│   └── useSpotifySearch.ts
├── youtube/               # Hooks do YouTube Music
│   ├── index.ts
│   ├── useYouTubeMusicLibrary.ts
│   ├── useYouTubeMusicPlayer.ts
│   └── useYouTubeMusicSearch.ts
├── system/                # Hooks de sistema/infraestrutura
│   ├── index.ts
│   ├── useA11yStats.ts
│   ├── useClientWebSocket.ts
│   ├── useConnectionMonitor.ts
│   ├── useContrastDebug.ts
│   ├── useLogs.ts
│   ├── useMockData.ts
│   ├── useNetworkStatus.ts
│   ├── useStatus.ts
│   ├── useStorjClient.ts
│   ├── useWeather.ts
│   ├── useWeatherForecast.ts
│   └── useWebSocketStatus.ts
└── pages/                 # Hooks específicos de páginas
    ├── index.ts
    └── useIndexPage.tsx
```

## Como Importar Hooks

### ✅ CORRETO - Usar barrel export principal

Este é o padrão recomendado para todos os imports:

```typescript
import { useTranslation, usePlayer, useSpotifyLibrary } from '@/hooks';
```

### ✅ CORRETO - Usar barrel export da categoria (quando necessário)

Para casos específicos onde você quer deixar claro o domínio:

```typescript
import { usePlayer, usePlaybackControls } from '@/hooks/player';
import { useSpotifyLibrary, useSpotifyPlayer } from '@/hooks/spotify';
import { useYouTubeMusicLibrary } from '@/hooks/youtube';
```

### ❌ INCORRETO - Import direto do arquivo

**NÃO** faça imports diretos para arquivos individuais:

```typescript
// NÃO FAÇA ISSO!
import { useTranslation } from '@/hooks/useTranslation';
import { usePlayer } from '@/hooks/player/usePlayer';
import { useSpotifyLibrary } from '@/hooks/useSpotifyLibrary';
```

## Convenções

### 1. Criação de Novos Hooks

- **Sempre** crie novos hooks dentro da subpasta apropriada
- **Nunca** crie hooks diretamente na raiz `src/hooks/`
- Escolha a categoria que melhor descreve o domínio do hook:
  - `common/` - hooks genéricos, UI, utils
  - `player/` - relacionados ao player de música
  - `spotify/` - integração Spotify
  - `youtube/` - integração YouTube Music
  - `system/` - infraestrutura, monitoramento, status
  - `pages/` - hooks específicos de páginas

### 2. Atualização dos Barrel Exports

Ao criar um novo hook:

1. Adicione o export no `index.ts` da subpasta correspondente
2. O barrel principal (`src/hooks/index.ts`) já re-exporta todas as subpastas

**Exemplo:**

```typescript
// src/hooks/common/index.ts
export { useNewHook } from './useNewHook';

// Automaticamente disponível via:
import { useNewHook } from '@/hooks';
```

### 3. Exportação de Tipos

Se o hook expõe tipos que precisam ser usados externamente:

```typescript
// src/hooks/common/index.ts
export { useThemeCustomizer } from './useThemeCustomizer';
export type { CustomThemeColors, ThemePreset } from './useThemeCustomizer';
```

### 4. Organização Interna do Hook

```typescript
// Imports
import { useState, useCallback } from 'react';
import { useSettings } from '@/contexts/SettingsContext';

// Tipos (se houver)
interface UseMyHookParams {
  enabled?: boolean;
}

interface UseMyHookReturn {
  data: string[];
  isLoading: boolean;
  refresh: () => void;
}

// Hook
export function useMyHook(params?: UseMyHookParams): UseMyHookReturn {
  // Implementação
}
```

## Categorias de Hooks

### Common (Uso Geral)

| Hook | Descrição |
|------|-----------|
| `useTranslation` | Internacionalização i18n |
| `useDebounce` | Debounce de valores |
| `useRipple` | Efeito ripple em botões |
| `useSoundEffects` | Sons de interface |
| `useToast` | Notificações toast |
| `useThemeCustomizer` | Personalização de tema |
| `useGlobalSearch` | Busca global |
| `useSettingsStatus` | Status das configurações |
| `useSettingsTour` | Tour guiado |

### Player

| Hook | Descrição |
|------|-----------|
| `usePlayer` | Controle principal do player |
| `usePlaybackControls` | Controles de reprodução |
| `useVolume` | Controle de volume |
| `useLyrics` | Letras de música |
| `useLibrary` | Biblioteca local |
| `useLocalMusic` | Músicas locais |

### Spotify

| Hook | Descrição |
|------|-----------|
| `useSpotifyPlaylists` | Playlists do usuário |
| `useSpotifyPlaylist` | Playlist individual |
| `useSpotifyLibrary` | Biblioteca do usuário |
| `useSpotifySearch` | Busca no Spotify |
| `useSpotifyPlayer` | Controle de reprodução |
| `useSpotifyBrowse` | Navegação (lançamentos, etc) |
| `useSpotifyRecommendations` | Recomendações |

### YouTube Music

| Hook | Descrição |
|------|-----------|
| `useYouTubeMusicLibrary` | Biblioteca do usuário |
| `useYouTubeMusicPlayer` | Controle de reprodução |
| `useYouTubeMusicSearch` | Busca |

### System

| Hook | Descrição |
|------|-----------|
| `useStatus` | Status do sistema |
| `useLogs` | Logs do sistema |
| `useWeather` | Dados climáticos |
| `useNetworkStatus` | Status da rede |
| `useConnectionMonitor` | Monitor de conexão |
| `useStorjClient` | Cliente Storj |
| `useContrastDebug` | Debug de contraste |
| `useA11yStats` | Estatísticas de acessibilidade |

## Migração de Código Legado

Se encontrar imports antigos no formato:

```typescript
import { useHook } from '@/hooks/useHook';
```

Atualize para:

```typescript
import { useHook } from '@/hooks';
```

## Troubleshooting

### Erro: Cannot find module '@/hooks/useXxx'

O hook foi movido para uma subpasta. Use o barrel export principal:

```typescript
// Antes (erro)
import { useSpotifyLibrary } from '@/hooks/useSpotifyLibrary';

// Depois (correto)
import { useSpotifyLibrary } from '@/hooks';
```

### Erro: Export not found

Verifique se o hook está exportado no `index.ts` da subpasta correspondente.

### Conflito de nomes

Se dois hooks têm o mesmo nome em categorias diferentes, use o import da categoria específica:

```typescript
import { useLibrary } from '@/hooks/player';
import { useSpotifyLibrary } from '@/hooks/spotify';
```
