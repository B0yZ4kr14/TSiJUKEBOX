# Relatório de Refatoração de Cores Hardcoded

> **Gerado em:** 24/12/2025 01:52  
> **Total de Ocorrências:** 360  
> **Com Sugestão:** 189  
> **Sem Sugestão:** 171

---

## 📊 Resumo por Categoria

| Categoria | Quantidade |
|-----------|------------|
| Background | 38 |
| Brand | 141 |
| Gradient | 3 |
| State | 4 |
| Text | 3 |
| Unknown | 171 |

---

## 🎨 Cores Mais Frequentes

| Cor | Ocorrências | Token Sugerido | Tailwind |
|-----|-------------|----------------|----------|
| `#1DB954` | 100 | `spotify-green` | `text-spotify-green` |
| `#FF0000` | 38 | `youtube-red` | `text-youtube-red` |
| `#333333` | 32 | `background-active` | `bg-accent` |
| `#444444` | 12 | `❌ Não mapeado` | `-` |
| `rgba(0,212,255,0.6)` | 10 | `❌ Não mapeado` | `-` |
| `#FFD93D` | 7 | `❌ Não mapeado` | `-` |
| `#3ECF8E` | 6 | `❌ Não mapeado` | `-` |
| `#00FF88` | 4 | `❌ Não mapeado` | `-` |
| `#00D4FF` | 4 | `❌ Não mapeado` | `-` |
| `#050508` | 4 | `❌ Não mapeado` | `-` |
| `#222222` | 4 | `❌ Não mapeado` | `-` |
| `#000000` | 3 | `background-black` | `bg-black` |
| `rgba(29,185,84,0.6)` | 3 | `❌ Não mapeado` | `-` |
| `#1ED760` | 3 | `spotify-green-light` | `text-spotify-green-light` |
| `rgba(255,0,0,0.5)` | 3 | `❌ Não mapeado` | `-` |
| `#FFFFFF` | 3 | `text-primary` | `text-foreground` |
| `#CCCCCC` | 3 | `❌ Não mapeado` | `-` |
| `#3178C6` | 2 | `❌ Não mapeado` | `-` |
| `#F7DF1E` | 2 | `❌ Não mapeado` | `-` |
| `#3776AB` | 2 | `❌ Não mapeado` | `-` |

---

## 📁 Ocorrências por Arquivo

### `src/components/settings/SpotifySetupWizard.tsx` (43 ocorrências)

| Linha | Cor | Sugestão |
|-------|-----|----------|
| 171 | `#1DB954` | `text-spotify-green` |
| 171 | `#1DB954` | `text-spotify-green` |
| 171 | `#1DB954` | `text-spotify-green` |
| 173 | `#1DB954` | `text-spotify-green` |
| 174 | `#1DB954` | `text-spotify-green` |
| 195 | `#1DB954` | `text-spotify-green` |
| 199 | `#1DB954` | `text-spotify-green` |
| 203 | `#1DB954` | `text-spotify-green` |
| 211 | `#1DB954` | `text-spotify-green` |
| 245 | `#1DB954` | `text-spotify-green` |

*... e mais 33 ocorrências*

### `src/components/settings/ThemeCustomizer.tsx` (23 ocorrências)

| Linha | Cor | Sugestão |
|-------|-----|----------|
| 30 | `#00BFFF` | `❌` |
| 30 | `#00FF7F` | `❌` |
| 30 | `#9B59B6` | `❌` |
| 30 | `#FF6B35` | `❌` |
| 30 | `#FF1493` | `❌` |
| 30 | `#FFD700` | `❌` |
| 31 | `#3B82F6` | `text-blue-500` |
| 31 | `#10B981` | `❌` |
| 31 | `#8B5CF6` | `text-violet-500` |
| 31 | `#F59E0B` | `text-yellow-500` |

*... e mais 13 ocorrências*

### `src/components/player/PlaybackControls.tsx` (20 ocorrências)

| Linha | Cor | Sugestão |
|-------|-----|----------|
| 55 | `#1DB954` | `text-spotify-green` |
| 55 | `#1DB954` | `text-spotify-green` |
| 55 | `#1DB954` | `text-spotify-green` |
| 55 | `#1DB954` | `text-spotify-green` |
| 55 | `#1DB954` | `text-spotify-green` |
| 65 | `#1DB954` | `text-spotify-green` |
| 98 | `#1DB954` | `text-spotify-green` |
| 98 | `#1DB954` | `text-spotify-green` |
| 98 | `#1DB954` | `text-spotify-green` |
| 98 | `#1DB954` | `text-spotify-green` |

*... e mais 10 ocorrências*

### `src/components/weather/AnimatedWeatherIcon.tsx` (17 ocorrências)

| Linha | Cor | Sugestão |
|-------|-----|----------|
| 32 | `#FFD93D` | `❌` |
| 46 | `#FFD93D` | `❌` |
| 49 | `#FFD93D` | `❌` |
| 49 | `#FFD93D` | `❌` |
| 49 | `#FFD93D` | `❌` |
| 58 | `#B0BEC5` | `❌` |
| 85 | `#78909C` | `❌` |
| 97 | `#4FC3F7` | `❌` |
| 121 | `#90A4AE` | `❌` |
| 130 | `#E3F2FD` | `❌` |

*... e mais 7 ocorrências*

### `src/components/settings/DatabaseConfigSection.tsx` (13 ocorrências)

| Linha | Cor | Sugestão |
|-------|-----|----------|
| 115 | `#333333` | `bg-accent` |
| 142 | `#333333` | `bg-accent` |
| 169 | `#333333` | `bg-accent` |
| 196 | `#333333` | `bg-accent` |
| 219 | `#333333` | `bg-accent` |
| 239 | `#333333` | `bg-accent` |
| 307 | `#333333` | `bg-accent` |
| 362 | `#333333` | `bg-accent` |
| 99 | `rgba(0,212,255,0.6)` | `❌` |
| 123 | `rgba(0,212,255,0.6)` | `❌` |

*... e mais 3 ocorrências*

### `src/components/youtube/AddToPlaylistModal.tsx` (12 ocorrências)

| Linha | Cor | Sugestão |
|-------|-----|----------|
| 88 | `#FF0000` | `text-youtube-red` |
| 137 | `#FF0000` | `text-youtube-red` |
| 137 | `#FF0000` | `text-youtube-red` |
| 158 | `#FF0000` | `text-youtube-red` |
| 158 | `#FF0000` | `text-youtube-red` |
| 158 | `#FF0000` | `text-youtube-red` |
| 179 | `#FF0000` | `text-youtube-red` |
| 179 | `#FF0000` | `text-youtube-red` |
| 192 | `#FF0000` | `text-youtube-red` |
| 205 | `#FF0000` | `text-youtube-red` |

*... e mais 2 ocorrências*

### `src/components/spotify/SpotifyPanel.tsx` (11 ocorrências)

| Linha | Cor | Sugestão |
|-------|-----|----------|
| 248 | `#1DB954` | `text-spotify-green` |
| 273 | `#1DB954` | `text-spotify-green` |
| 276 | `#1DB954` | `text-spotify-green` |
| 279 | `#1DB954` | `text-spotify-green` |
| 282 | `#1DB954` | `text-spotify-green` |
| 285 | `#1DB954` | `text-spotify-green` |
| 288 | `#1DB954` | `text-spotify-green` |
| 291 | `#1DB954` | `text-spotify-green` |
| 501 | `#1DB954` | `text-spotify-green` |
| 502 | `#1DB954` | `text-spotify-green` |

*... e mais 1 ocorrências*

### `src/components/github/GitHubDashboardCharts.tsx` (10 ocorrências)

| Linha | Cor | Sugestão |
|-------|-----|----------|
| 31 | `#3178C6` | `❌` |
| 32 | `#F7DF1E` | `❌` |
| 33 | `#3776AB` | `❌` |
| 34 | `#E34C26` | `❌` |
| 35 | `#1572B6` | `❌` |
| 36 | `#89E051` | `❌` |
| 37 | `#2496ED` | `❌` |
| 38 | `#CB171E` | `❌` |
| 39 | `#000000` | `bg-black` |
| 40 | `#083FA1` | `❌` |

### `src/components/github/LanguagesChart.tsx` (10 ocorrências)

| Linha | Cor | Sugestão |
|-------|-----|----------|
| 8 | `#3178C6` | `❌` |
| 9 | `#F7DF1E` | `❌` |
| 10 | `#264DE4` | `❌` |
| 11 | `#E34C26` | `❌` |
| 12 | `#3776AB` | `❌` |
| 13 | `#89E051` | `❌` |
| 14 | `#2496ED` | `❌` |
| 15 | `#000000` | `bg-black` |
| 16 | `#083FA1` | `❌` |
| 17 | `#CB171E` | `❌` |

### `src/components/settings/UserManagementSection.tsx` (10 ocorrências)

| Linha | Cor | Sugestão |
|-------|-----|----------|
| 265 | `#333333` | `bg-accent` |
| 280 | `#333333` | `bg-accent` |
| 313 | `#333333` | `bg-accent` |
| 390 | `#333333` | `bg-accent` |
| 270 | `rgba(0,212,255,0.6)` | `❌` |
| 303 | `rgba(0,212,255,0.6)` | `❌` |
| 322 | `rgba(0,212,255,0.3)` | `❌` |
| 359 | `rgba(239,68,68,0.3)` | `❌` |
| 521 | `rgba(239,68,68,0.3)` | `❌` |
| 522 | `rgba(239,68,68,0.5)` | `❌` |

### `src/components/ui/button.tsx` (10 ocorrências)

| Linha | Cor | Sugestão |
|-------|-----|----------|
| 26 | `#00B8E6` | `❌` |
| 30 | `#333333` | `bg-accent` |
| 30 | `#444444` | `❌` |
| 38 | `#333333` | `bg-accent` |
| 38 | `#444444` | `❌` |
| 42 | `#333333` | `bg-accent` |
| 46 | `#FF3333` | `❌` |
| 50 | `#00E63D` | `❌` |
| 54 | `#E6BD00` | `❌` |
| 58 | `#00B8E6` | `❌` |

### `src/components/ui/__tests__/SectionIconsShowcase.test.tsx` (10 ocorrências)

| Linha | Cor | Sugestão |
|-------|-----|----------|
| 115 | `#00FF88` | `❌` |
| 116 | `#00D4FF` | `❌` |
| 117 | `#FF00D4` | `❌` |
| 118 | `#FFD400` | `❌` |
| 119 | `#D400FF` | `❌` |
| 120 | `#FF4400` | `❌` |
| 121 | `#00FF44` | `❌` |
| 122 | `#4400FF` | `❌` |
| 325 | `#00FF88` | `❌` |
| 334 | `#00D4FF` | `❌` |

### `src/components/ui/card.tsx` (9 ocorrências)

| Linha | Cor | Sugestão |
|-------|-----|----------|
| 25 | `#333333` | `bg-accent` |
| 25 | `#444444` | `❌` |
| 29 | `#444444` | `❌` |
| 33 | `#333333` | `bg-accent` |
| 33 | `#444444` | `❌` |
| 37 | `#444444` | `❌` |
| 41 | `#333333` | `bg-accent` |
| 41 | `#444444` | `❌` |
| 45 | `#333333` | `bg-accent` |

### `src/components/settings/ColorPicker.tsx` (8 ocorrências)

| Linha | Cor | Sugestão |
|-------|-----|----------|
| 76 | `#00BFFF` | `❌` |
| 107 | `#FF0000` | `text-youtube-red` |
| 107 | `#FFFF00` | `❌` |
| 107 | `#00FF00` | `❌` |
| 107 | `#00FFFF` | `❌` |
| 107 | `#0000FF` | `❌` |
| 107 | `#FF00FF` | `❌` |
| 107 | `#FF0000` | `text-youtube-red` |

### `src/components/settings/MusicIntegrationsSection.tsx` (8 ocorrências)

| Linha | Cor | Sugestão |
|-------|-----|----------|
| 46 | `#1DB954` | `text-spotify-green` |
| 59 | `#FF0000` | `text-youtube-red` |
| 68 | `#1ED760` | `text-spotify-green-light` |
| 77 | `#6366F1` | `text-indigo-500` |
| 252 | `#1DB954` | `text-spotify-green` |
| 252 | `#1DB954` | `text-spotify-green` |
| 262 | `#FF0000` | `text-youtube-red` |
| 262 | `#FF0000` | `text-youtube-red` |

### `src/components/settings/SettingsSidebar.tsx` (8 ocorrências)

| Linha | Cor | Sugestão |
|-------|-----|----------|
| 91 | `#222222` | `❌` |
| 177 | `#333333` | `bg-accent` |
| 202 | `#222222` | `❌` |
| 246 | `#333333` | `bg-accent` |
| 266 | `#222222` | `❌` |
| 268 | `#222222` | `❌` |
| 300 | `#333333` | `bg-accent` |
| 227 | `rgba(0,212,255,0.6)` | `❌` |

### `src/components/ui/SectionIconsShowcase.tsx` (8 ocorrências)

| Linha | Cor | Sugestão |
|-------|-----|----------|
| 31 | `#00FF88` | `❌` |
| 41 | `#00D4FF` | `❌` |
| 51 | `#FF00D4` | `❌` |
| 61 | `#FFD400` | `❌` |
| 71 | `#D400FF` | `❌` |
| 81 | `#FF4400` | `❌` |
| 91 | `#00FF44` | `❌` |
| 101 | `#4400FF` | `❌` |

### `src/components/youtube/YouTubeMusicPlaylistCard.tsx` (8 ocorrências)

| Linha | Cor | Sugestão |
|-------|-----|----------|
| 36 | `#FF0000` | `text-youtube-red` |
| 54 | `#FF0000` | `text-youtube-red` |
| 54 | `#FF0000` | `text-youtube-red` |
| 140 | `#FF0000` | `text-youtube-red` |
| 140 | `#FF0000` | `text-youtube-red` |
| 141 | `#FF0000` | `text-youtube-red` |
| 152 | `#FF0000` | `text-youtube-red` |
| 152 | `rgba(255,0,0,0.5)` | `❌` |

### `src/components/player/NowPlaying.tsx` (7 ocorrências)

| Linha | Cor | Sugestão |
|-------|-----|----------|
| 35 | `#050508` | `❌` |
| 36 | `#0A0A12` | `❌` |
| 36 | `#000000` | `bg-black` |
| 46 | `#050508` | `❌` |
| 52 | `#050508` | `❌` |
| 52 | `#050508` | `❌` |
| 55 | `rgba(0,0,0,0.6)` | `❌` |

### `src/components/youtube/YouTubeMusicAlbumCard.tsx` (7 ocorrências)

| Linha | Cor | Sugestão |
|-------|-----|----------|
| 22 | `#FF0000` | `text-youtube-red` |
| 22 | `#FF0000` | `text-youtube-red` |
| 100 | `#FF0000` | `text-youtube-red` |
| 100 | `#FF0000` | `text-youtube-red` |
| 101 | `#FF0000` | `text-youtube-red` |
| 112 | `#FF0000` | `text-youtube-red` |
| 112 | `rgba(255,0,0,0.5)` | `❌` |


---

## 🔧 Design Tokens Recomendados

### CSS Variables

```css
:root {
  /* Background */
  --background: #0a0a0a;
  --background-dark: #121212;
  --background-elevated: #1a1a1a;
  --background-surface: #181818;
  --background-hover: #282828;
  
  /* Text */
  --foreground: #ffffff;
  --muted-foreground: #b3b3b3;
  
  /* Border */
  --border: #404040;
  
  /* Brand */
  --spotify-green: #1DB954;
  --youtube-red: #FF0000;
  
  /* State */
  --success: #22c55e;
  --error: #ef4444;
  --warning: #f59e0b;
  --info: #3b82f6;
}
```

### Tailwind Config

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'spotify-green': '#1DB954',
        'youtube-red': '#FF0000',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
      },
    },
  },
};
```

---

## ✅ Próximos Passos

1. **Prioridade Alta:** Refatorar cores de background (mais frequentes)
2. **Prioridade Média:** Refatorar cores de texto
3. **Prioridade Baixa:** Refatorar cores de borda e estado

### Exemplo de Refatoração

**Antes:**
```tsx
<div style={{ backgroundColor: '#121212' }}>
```

**Depois:**
```tsx
<div className="bg-card">
```

---

## 📚 Referências

- [Design System](../DESIGN-SYSTEM.md)
- [Tailwind CSS](https://tailwindcss.com/docs/customizing-colors)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
