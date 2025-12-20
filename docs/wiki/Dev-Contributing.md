# 🤝 Guia de Contribuição

Obrigado por considerar contribuir com o TSiJUKEBOX! Este guia vai ajudá-lo a começar.

---

## 📋 Código de Conduta

Ao contribuir, você concorda em seguir nosso [Código de Conduta](../../CODE_OF_CONDUCT.md).

---

## 🚀 Primeiros Passos

### 1. Fork o Repositório

1. Acesse [github.com/B0yZ4kr14/TSiJUKEBOX](https://github.com/B0yZ4kr14/TSiJUKEBOX)
2. Clique em "Fork"
3. Clone seu fork:
```bash
git clone https://github.com/seu-usuario/TSiJUKEBOX.git
cd TSiJUKEBOX
```

### 2. Configure o Ambiente

```bash
# Instale dependências
npm install
# ou
bun install

# Configure variáveis de ambiente
cp .env.example .env

# Inicie desenvolvimento
npm run dev
```

### 3. Crie uma Branch

```bash
git checkout -b feature/minha-feature
# ou
git checkout -b fix/meu-bugfix
```

---

## 📝 Padrões de Commit

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

### Formato
```
<tipo>(<escopo>): <descrição>

[corpo opcional]

[rodapé opcional]
```

### Tipos

| Tipo | Descrição |
|------|-----------|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `docs` | Documentação |
| `style` | Formatação (não afeta código) |
| `refactor` | Refatoração |
| `test` | Testes |
| `chore` | Manutenção |
| `perf` | Performance |
| `ci` | CI/CD |

### Exemplos
```bash
feat(player): adicionar suporte a crossfade
fix(spotify): corrigir refresh token expirado
docs(wiki): adicionar guia de instalação
test(hooks): adicionar testes para usePlayer
```

---

## 🔍 Antes de Enviar

### Checklist

- [ ] Código segue os padrões do projeto
- [ ] Testes passam: `npm test`
- [ ] Linting ok: `npm run lint`
- [ ] Build ok: `npm run build`
- [ ] Acessibilidade verificada
- [ ] Documentação atualizada (se necessário)

### Scripts Úteis

```bash
# Rodar todos os checks
npm run check

# Testes com coverage
npm run test:coverage

# Lint e fix
npm run lint:fix

# Type check
npm run typecheck

# Testes E2E
npm run test:e2e
```

---

## 📤 Pull Request

### 1. Push sua Branch

```bash
git push origin feature/minha-feature
```

### 2. Abra o PR

1. Vá para seu fork no GitHub
2. Clique em "Compare & pull request"
3. Preencha o template:
   - Descrição clara do que foi feito
   - Issue relacionada (se houver)
   - Screenshots (para mudanças visuais)
   - Tipo de mudança

### 3. Revisão

- Aguarde revisão de um maintainer
- Responda comentários
- Faça ajustes se solicitados
- PR será merged após aprovação

---

## 🏗️ Estrutura do Projeto

### Onde Adicionar Código

| Tipo | Localização |
|------|-------------|
| Componentes UI | `src/components/ui/` |
| Componentes de feature | `src/components/<feature>/` |
| Hooks | `src/hooks/<categoria>/` |
| Páginas | `src/pages/` |
| Utilitários | `src/lib/` |
| Types | `src/types/` |
| Edge Functions | `supabase/functions/` |
| Testes E2E | `e2e/` |

### Convenções de Nomenclatura

| Item | Convenção | Exemplo |
|------|-----------|---------|
| Componentes | PascalCase | `PlayerControls.tsx` |
| Hooks | camelCase com 'use' | `usePlayer.ts` |
| Utils | camelCase | `formatTime.ts` |
| Types | PascalCase | `Track.ts` |
| Constantes | UPPER_SNAKE | `MAX_QUEUE_SIZE` |

---

## 🎨 Padrões de Código

### TypeScript

```typescript
// ✅ Bom - Tipagem explícita
interface PlayerProps {
  track: Track;
  onPlay: (track: Track) => void;
}

// ❌ Evitar - any
const handlePlay = (track: any) => { ... }
```

### React

```tsx
// ✅ Bom - Functional components com hooks
export function PlayerControls({ onPlay, onPause }: PlayerControlsProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  
  return (
    <div className="flex gap-2">
      <Button onClick={isPlaying ? onPause : onPlay}>
        {isPlaying ? 'Pause' : 'Play'}
      </Button>
    </div>
  );
}

// ❌ Evitar - Class components
class PlayerControls extends Component { ... }
```

### CSS/Tailwind

```tsx
// ✅ Bom - Usar tokens do design system
<div className="bg-background text-foreground">

// ❌ Evitar - Cores hardcoded
<div className="bg-[#1a1a2e] text-white">
```

---

## 🧪 Escrevendo Testes

### Unit Tests (Vitest)

```typescript
// src/hooks/player/__tests__/usePlayer.test.ts
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePlayer } from '../usePlayer';

describe('usePlayer', () => {
  it('should play track', async () => {
    const { result } = renderHook(() => usePlayer());
    
    await act(async () => {
      await result.current.play(mockTrack);
    });
    
    expect(result.current.isPlaying).toBe(true);
  });
});
```

### E2E Tests (Playwright)

```typescript
// e2e/specs/player-controls.spec.ts
import { test, expect } from '@playwright/test';

test('should play and pause music', async ({ page }) => {
  await page.goto('/');
  
  await page.click('[data-testid="play-button"]');
  await expect(page.locator('[data-testid="now-playing"]')).toBeVisible();
  
  await page.click('[data-testid="pause-button"]');
  await expect(page.locator('[data-testid="paused-indicator"]')).toBeVisible();
});
```

---

## ♿ Acessibilidade

Todas as contribuições devem seguir WCAG 2.1 AA:

```tsx
// ✅ Bom
<button 
  aria-label="Reproduzir música"
  onClick={handlePlay}
>
  <PlayIcon aria-hidden="true" />
</button>

// ❌ Evitar
<div onClick={handlePlay}>
  <PlayIcon />
</div>
```

### Verificação
```bash
npm run a11y:check
```

---

## 🐛 Reportando Bugs

Use o template de [Bug Report](https://github.com/B0yZ4kr14/TSiJUKEBOX/issues/new?template=bug_report.md):

1. **Descrição clara** do problema
2. **Passos para reproduzir**
3. **Comportamento esperado** vs atual
4. **Screenshots/logs** se relevante
5. **Ambiente**: OS, browser, versão

---

## 💡 Sugerindo Features

Use o template de [Feature Request](https://github.com/B0yZ4kr14/TSiJUKEBOX/issues/new?template=feature_request.md):

1. **Descrição** da feature
2. **Motivação** - Por que é útil?
3. **Comportamento esperado**
4. **Alternativas** consideradas

---

## 📚 Recursos

- [Documentação Principal](../README.md)
- [Arquitetura](Dev-Architecture.md)
- [API Reference](Dev-API-Reference.md)
- [Guia de Testes](Dev-Testing.md)

---

## ❓ Dúvidas?

- Abra uma [Discussion](https://github.com/B0yZ4kr14/TSiJUKEBOX/discussions)
- Pergunte no issue relacionado
- Consulte a documentação

---

**Obrigado por contribuir! 🎵**

---

[← API Reference](Dev-API-Reference.md) | [Próximo: Testes →](Dev-Testing.md)
