# TSiJUKEBOX Logo Assets

Este diretório contém os assets oficiais da marca TSiJUKEBOX.

## Arquivos Disponíveis

| Arquivo | Formato | Uso Recomendado |
|---------|---------|-----------------|
| `tsijukebox-logo.svg` | SVG vetorial | Web, documentação, impressão |
| `../pwa-192x192.png` | PNG 192x192 | PWA, ícone de app |
| `../pwa-512x512.png` | PNG 512x512 | PWA, splash screen |

## Uso

### Em HTML
```html
<img src="/logo/tsijukebox-logo.svg" alt="TSiJUKEBOX Logo" width="300">
```

### Em React
```tsx
import { LogoBrand } from '@/components/ui/LogoBrand';

<LogoBrand size="md" variant="metal" />
```

### Em Markdown
```markdown
![TSiJUKEBOX Logo](./public/logo/tsijukebox-logo.svg)
```

## Paleta de Cores

- **Chrome/Metal**: `#f0f0f0` → `#b0b0b0` (gradient)
- **Gold (JUKE)**: `#FFD700` → `#FFA500`
- **Cyan Neon (BOX)**: `#00d4ff` → `#0099cc`
- **Background**: `#0a0a14`

## Download

Clique com botão direito → "Salvar como" ou use o componente `LogoDownload`:

```tsx
import { LogoDownload } from '@/components/ui/LogoDownload';

<LogoDownload formats={['svg', 'png']} />
```

---

© TSiJUKEBOX Enterprise - Uso livre conforme Declaração de Soberania
