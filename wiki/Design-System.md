<h1 align="center">
  <img src="https://img.shields.io/badge/🎨-Design_System-FF00D4?style=for-the-badge&labelColor=09090B" alt="Design System">
</h1>

<p align="center">
  <strong>Tokens, Cores e Componentes do TSiJUKEBOX</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/componentes-72-00D4FF?style=flat-square" alt="Componentes">
  <img src="https://img.shields.io/badge/temas-6-FF00D4?style=flat-square" alt="Temas">
  <img src="https://img.shields.io/badge/ícones-176-FFD400?style=flat-square" alt="Ícones">
</p>

---

## 🎨 Paleta de Cores

### Cores Base

<table>
<tr>
<td align="center">

![#09090B](https://via.placeholder.com/50/09090B/09090B?text=+)

`#09090B`
**Background**

</td>
<td align="center">

![#18181B](https://via.placeholder.com/50/18181B/18181B?text=+)

`#18181B`
**Card**

</td>
<td align="center">

![#27272A](https://via.placeholder.com/50/27272A/27272A?text=+)

`#27272A`
**Border**

</td>
</tr>
</table>

### Cores Neon

<table>
<tr>
<td align="center">

![#FBB724](https://via.placeholder.com/50/FBB724/FBB724?text=+)

`#FBB724`
**Gold Neon**
Destaques, CTAs

</td>
<td align="center">

![#00D4FF](https://via.placeholder.com/50/00D4FF/00D4FF?text=+)

`#00D4FF`
**Cyan Neon**
Links, interações

</td>
<td align="center">

![#FF00FF](https://via.placeholder.com/50/FF00FF/FF00FF?text=+)

`#FF00FF`
**Magenta**
Alertas, badges

</td>
<td align="center">

![#22C55E](https://via.placeholder.com/50/22C55E/22C55E?text=+)

`#22C55E`
**Green**
Sucesso

</td>
<td align="center">

![#EF4444](https://via.placeholder.com/50/EF4444/EF4444?text=+)

`#EF4444`
**Red**
Erro

</td>
</tr>
</table>

---

## 📝 Tipografia

<table>
<tr>
<td width="50%">

### Fonte Principal

```css
font-family: 'Inter', system-ui, sans-serif;
```

</td>
<td width="50%">

### Tamanhos

| Token | Tamanho |
|-------|:-------:|
| `text-xs` | 12px |
| `text-sm` | 14px |
| `text-base` | 16px |
| `text-lg` | 18px |
| `text-xl` | 20px |
| `text-2xl` | 24px |
| `text-3xl` | 30px |
| `text-4xl` | 36px |

</td>
</tr>
</table>

---

## 🧩 Componentes

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

---

## ✨ Animações

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

---

## 📏 Espaçamento

<table>
<tr>
<td>

| Token | Valor |
|-------|:-----:|
| `spacing-1` | 4px |
| `spacing-2` | 8px |
| `spacing-3` | 12px |
| `spacing-4` | 16px |

</td>
<td>

| Token | Valor |
|-------|:-----:|
| `spacing-6` | 24px |
| `spacing-8` | 32px |
| `spacing-12` | 48px |
| `spacing-16` | 64px |

</td>
</tr>
</table>

---

## 🔗 Recursos

<table>
<tr>
<td align="center">

[![Showcase](https://img.shields.io/badge/🎨-Showcase-FF00D4?style=for-the-badge)](https://b0yz4kr14.github.io/tsijukebox/showcase.html)

</td>
<td align="center">

[![Mockups](https://img.shields.io/badge/🎭-Mockups-FFD400?style=for-the-badge)](https://b0yz4kr14.github.io/tsijukebox/stage-theme-mockups.html)

</td>
</tr>
</table>

---

<p align="center">
  <a href="Home">← Voltar para Home</a> | <a href="Themes">Temas →</a>
</p>
