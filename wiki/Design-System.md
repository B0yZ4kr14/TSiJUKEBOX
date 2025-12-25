# 🎨 Design System

## Paleta de Cores

| Token | Hex | RGB | Uso |
|-------|-----|-----|-----|
| **Gold Neon** | `#FBB724` | `251, 183, 36` | Destaques, CTAs |
| **Cyan Neon** | `#00D4FF` | `0, 212, 255` | Links, interações |
| **Magenta** | `#FF00FF` | `255, 0, 255` | Alertas, badges |
| **Green** | `#22C55E` | `34, 197, 94` | Sucesso |
| **Red** | `#EF4444` | `239, 68, 68` | Erro |
| **Background** | `#09090B` | `9, 9, 11` | Fundo principal |
| **Card** | `#18181B` | `24, 24, 27` | Cards, painéis |
| **Border** | `#27272A` | `39, 39, 42` | Bordas |

## Tipografia

```css
/* Fonte Principal */
font-family: 'Inter', system-ui, sans-serif;

/* Tamanhos */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
```

## Componentes

### Button

```tsx
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="spotify">Spotify</Button>
<Button variant="youtube">YouTube</Button>
```

### Card

```tsx
<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
    <CardDescription>Descrição</CardDescription>
  </CardHeader>
  <CardContent>Conteúdo</CardContent>
  <CardFooter>Rodapé</CardFooter>
</Card>
```

### Badge

```tsx
<Badge variant="default">Default</Badge>
<Badge variant="primary">Primary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>
```

## Animações

```css
/* Transições */
--transition-fast: 150ms ease;
--transition-normal: 300ms ease;
--transition-slow: 500ms ease;

/* Efeitos Neon */
.neon-glow {
  text-shadow: 0 0 10px currentColor,
               0 0 20px currentColor,
               0 0 30px currentColor;
}
```

## Espaçamento

```css
--spacing-1: 0.25rem;  /* 4px */
--spacing-2: 0.5rem;   /* 8px */
--spacing-3: 0.75rem;  /* 12px */
--spacing-4: 1rem;     /* 16px */
--spacing-6: 1.5rem;   /* 24px */
--spacing-8: 2rem;     /* 32px */
--spacing-12: 3rem;    /* 48px */
```
