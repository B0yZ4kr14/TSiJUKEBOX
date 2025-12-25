<div align="center">

<img src="docs/assets/logo.svg" alt="TSiJUKEBOX Logo" width="400">

<br><br>

# 🎵 TSiJUKEBOX

### Enterprise Digital Jukebox System

[![Version](https://img.shields.io/badge/version-4.2.1-00d4ff?style=for-the-badge&logo=github&logoColor=white)](docs/CHANGELOG.md)
[![License](https://img.shields.io/badge/license-Public%20Domain-fbbf24?style=for-the-badge&logo=unlicense&logoColor=white)](LICENSE)
[![WCAG 2.1 AA](https://img.shields.io/badge/WCAG-2.1%20AA-22c55e?style=for-the-badge&logo=accessibility&logoColor=white)](docs/ACCESSIBILITY_REPORT_FINAL.md)
[![CachyOS](https://img.shields.io/badge/CachyOS-Ready-00D4FF?style=for-the-badge&logo=archlinux&logoColor=white)](https://cachyos.org)

[![React](https://img.shields.io/badge/React-18.3-61dafb?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![pnpm](https://img.shields.io/badge/pnpm-10.x-F69220?style=flat-square&logo=pnpm&logoColor=white)](https://pnpm.io)

**Sistema kiosk musical profissional com integração Spotify, YouTube Music e arquivos locais.**

[📖 Wiki](https://github.com/B0yZ4kr14/tsijukebox/wiki) · [🌐 Demo](https://tsijukebox.vercel.app) · [🐛 Issues](https://github.com/B0yZ4kr14/tsijukebox/issues) · [✨ Features](https://github.com/B0yZ4kr14/tsijukebox/issues)

</div>

---

## ⚡ Instalação Rápida — CachyOS / Arch Linux

<div align="center">

### 🐧 Copie e Cole no Terminal Fish:

```fish
curl -fsSL https://raw.githubusercontent.com/B0yZ4kr14/tsijukebox/main/scripts/install.py | sudo python3
```

**✅ Otimizado para:** CachyOS · Arch Linux · Manjaro · EndeavourOS

</div>

### 🎮 Modos de Instalação

| Modo | Comando | Ideal Para |
|------|---------|------------|
| 🎵 **Completo** | `sudo python3 install.py` | Uso doméstico com todas as features |
| 🖥️ **Kiosk** | `sudo python3 install.py --mode kiosk` | Bares, eventos, karaokês |
| 🖧 **Server** | `sudo python3 install.py --mode server` | Servidor headless com API REST |

### 📦 Dependências (Instaladas Automaticamente)

```fish
# CachyOS / Arch Linux
sudo pacman -S nodejs pnpm git chromium

# Opcional: Spotify + Spicetify
yay -S spotify spicetify-cli
```

---

## 💻 Desenvolvimento Local

### Pré-requisitos CachyOS/Arch

```fish
# Instalar dependências base
sudo pacman -S nodejs pnpm git base-devel

# Clonar repositório
git clone https://github.com/B0yZ4kr14/tsijukebox.git
cd tsijukebox

# Instalar dependências do projeto
pnpm install

# Iniciar servidor de desenvolvimento
pnpm dev
```

Acesse **http://localhost:8080** · Login: `admin` / `admin`

### 🐳 Docker (Alternativa)

```fish
docker run -d -p 8080:8080 --name tsijukebox b0yz4kr14/tsijukebox:latest
```

---

## ✨ Features

<table>
<tr>
<td align="center" width="25%">

### 🎤
**Karaoke Pro**

Letras sincronizadas
Controle de pitch
Reverb & Echo
Pontuação em tempo real

</td>
<td align="center" width="25%">

### 🎵
**Player Avançado**

Visualizador de áudio
Equalização 10 bandas
Playlists inteligentes
Fila dinâmica drag-n-drop

</td>
<td align="center" width="25%">

### 📺
**Modo Kiosk**

Interface fullscreen
Suporte a touch
Autoplay contínuo
Otimizado para TVs

</td>
<td align="center" width="25%">

### 🔗
**Integrações**

Spotify Web API
YouTube Music
GitHub Sync
Cloud Backup (Storj/S3)

</td>
</tr>
</table>

### 🎵 Provedores de Música

| Provider | Recursos | Autenticação |
|----------|----------|--------------|
| 🎵 **Spotify** | Streaming, Playlists, Spotify Connect, Letras | OAuth 2.0 |
| 📺 **YouTube Music** | Streaming, Playlists, Mix Personalizado | OAuth 2.0 |
| 📁 **Arquivos Locais** | MP3, FLAC, AAC, OGG, WAV, OPUS | N/A |

### 🎮 Modos de Operação

| Modo | Descrição | Casos de Uso |
|------|-----------|--------------|
| 🖥️ **Desktop** | Interface completa | Uso pessoal, estúdios |
| 🏪 **Kiosk** | Interface simplificada e bloqueada | Bares, restaurantes |
| 🖧 **Server** | API REST sem interface gráfica | Integração com sistemas |
| 🎤 **Karaoke** | Foco em letras e fila | Karaokês, festas |

---

## 🎨 Temas

O TSiJUKEBOX oferece **6 temas visuais**:

<table>
<tr>
<td align="center">

**Cosmic Player**
`Padrão`
![#09090B](https://via.placeholder.com/15/09090B/09090B) ![#00D4FF](https://via.placeholder.com/15/00D4FF/00D4FF)

</td>
<td align="center">

**Karaoke Stage**
`Palco`
![#1a0a2e](https://via.placeholder.com/15/1a0a2e/1a0a2e) ![#FF00D4](https://via.placeholder.com/15/FF00D4/FF00D4)

</td>
<td align="center">

**Stage Neon Metallic**
`✨ Novo`
![#0a0a1a](https://via.placeholder.com/15/0a0a1a/0a0a1a) ![#00FFFF](https://via.placeholder.com/15/00FFFF/00FFFF)

</td>
</tr>
<tr>
<td align="center">

**Dashboard Home**
`Dourado`
![#0f0f12](https://via.placeholder.com/15/0f0f12/0f0f12) ![#FFD700](https://via.placeholder.com/15/FFD700/FFD700)

</td>
<td align="center">

**Spotify Integration**
`Verde`
![#121212](https://via.placeholder.com/15/121212/121212) ![#1DB954](https://via.placeholder.com/15/1DB954/1DB954)

</td>
<td align="center">

**Settings Dark**
`Roxo`
![#0a0a0c](https://via.placeholder.com/15/0a0a0c/0a0a0c) ![#8B5CF6](https://via.placeholder.com/15/8B5CF6/8B5CF6)

</td>
</tr>
</table>

---

## ♿ Acessibilidade WCAG 2.1 AA

| Recurso | Implementação | Status |
|---------|---------------|:------:|
| ⌨️ Navegação por Teclado | Tab, Enter, Escape | ✅ |
| 🔊 Leitores de Tela | ARIA labels e roles | ✅ |
| 🎨 Contraste de Cores | Ratio mínimo 4.5:1 | ✅ |
| 🎯 Foco Visível | Indicador claro | ✅ |

**Métricas:** 238 aria-labels · 550 aria-hidden · 50 roles · [📄 Relatório Completo](docs/ACCESSIBILITY_REPORT_FINAL.md)

---

## 📋 Requisitos do Sistema

| Componente | Mínimo | Recomendado |
|------------|:------:|:-----------:|
| 🐧 **OS** | Arch Linux | CachyOS + Openbox |
| 🐚 **Shell** | bash | fish |
| ⚙️ **CPU** | 2 cores | 4+ cores |
| 💾 **RAM** | 2 GB | 4+ GB |
| 💿 **Disco** | 500 MB | 2+ GB |
| 🟢 **Node.js** | 18.x | 20.x LTS |
| 📦 **pnpm** | 8.x | 10.x |

---

## 🛠️ Scripts Disponíveis

```fish
# Desenvolvimento
pnpm dev              # Servidor de desenvolvimento
pnpm build            # Build de produção
pnpm preview          # Preview do build

# Qualidade
pnpm lint             # Verifica código
pnpm type-check       # Verifica tipos TypeScript

# Testes
pnpm test             # Testes unitários (Vitest)
pnpm test:e2e         # Testes E2E (Playwright)
pnpm test:coverage    # Relatório de cobertura

# Utilitários
python3 scripts/master-fix.py --all    # Correções automáticas
python3 scripts/uat-installation-tests.py  # Testes de instalação
```

---

## 🏗️ Arquitetura

```
tsijukebox/
├── 📁 src/
│   ├── 📁 components/     # 72 Componentes React
│   │   ├── 📁 ui/         # shadcn/ui base
│   │   ├── 📁 player/     # Player de música
│   │   ├── 📁 karaoke/    # Sistema de karaoke
│   │   └── 📁 settings/   # Configurações
│   ├── 📁 pages/          # 45 Páginas
│   ├── 📁 hooks/          # React hooks customizados
│   ├── 📁 stores/         # Estado global (Zustand)
│   └── 📁 themes/         # 6 Temas visuais
├── 📁 scripts/            # 26 Scripts Python/Shell
├── 📁 docs/               # Documentação completa
└── 📁 wiki/               # Páginas Wiki preparadas
```

---

## 📚 Documentação

| Documento | Descrição |
|-----------|-----------|
| 📖 [Wiki](https://github.com/B0yZ4kr14/tsijukebox/wiki) | Documentação completa |
| 📥 [Instalação](https://github.com/B0yZ4kr14/tsijukebox/wiki/Installation-Guide) | Guia passo a passo |
| ⚙️ [Configuração](https://github.com/B0yZ4kr14/tsijukebox/wiki/Configuration) | Opções avançadas |
| 🎨 [Design System](https://github.com/B0yZ4kr14/tsijukebox/wiki/Design-System) | Tokens e cores |
| 🔌 [API Reference](https://github.com/B0yZ4kr14/tsijukebox/wiki/API-Reference) | Endpoints REST |
| ♿ [Acessibilidade](docs/ACCESSIBILITY_REPORT_FINAL.md) | Relatório WCAG 2.1 AA |

---

## 🤝 Contribuindo

1. 🍴 **Fork** → `gh repo fork B0yZ4kr14/tsijukebox`
2. 🌿 **Branch** → `git checkout -b feature/AmazingFeature`
3. 💾 **Commit** → `git commit -m 'feat: add AmazingFeature'`
4. 📤 **Push** → `git push origin feature/AmazingFeature`
5. 🔀 **PR** → `gh pr create`

---

## 📜 Licença e Filosofia

<div align="center">

### ⚔️ DECLARAÇÃO DE SOBERANIA INTELECTUAL

<img src="docs/assets/B0.y_Z4kr14-avatar.png" alt="B0.y_Z4kr14 Avatar" width="300">

</div>

---

### 🏴 "Propriedade Intelectual Não Existe"

> *"Ideias são superabundantes e não-rivais. A mimese jamais configurará expropriação."*
>
> — **Stephan Kinsella**, Contra a Propriedade Intelectual

---

### 🔥 A Falácia da Propriedade Intelectual

Na perspectiva TecnoLibertária, a **propriedade intelectual** constitui uma **aberração conceitual** — uma falácia lógica incapaz de sustentar-se ante a natureza **superabundante** e **não-rival** das ideias.

Diferente de bens tangíveis, **copiar software não priva o autor original** do uso de seu código. Portanto, inexiste "roubo" no compartilhamento de conhecimento — apenas **multiplicação de valor sem custo marginal**.

| 📜 Conceito | 🏛️ Visão Estatal | ⚔️ Visão Libertária |
|------------|-----------------|-------------------|
| **Software** | "Obra literária" protegida pela Lei 9.609/98 | Informação livre, não-escassa |
| **Cópia** | "Pirataria" criminosa | Aprendizado legítimo, replicação ética |
| **Garantia** | Registro no INPI (órgão estatal) | Reputação do autor + contratos privados |

---

### 🗡️ O Conflito de Propriedade Real

Se o Estado **impede você de usar seu próprio computador** — sua **propriedade física** — para copiar um código, ele está **violando seu direito de propriedade** sobre o hardware.

🔥 **Patentes e direitos autorais são privilégios estatais** que concedem **monopólios artificiais** sobre ideias, criando **escassez forçada** onde naturalmente não existiria.

---

### 💀 LICENCIAMENTO: DOMÍNIO PÚBLICO ABSOLUTO

<div align="center">

<img src="docs/assets/gadsden-flag.png" alt="Gadsden Flag - Don't Tread On Me" width="400">

**🐍 DON'T TREAD ON ME 🐍**

</div>

Este software é liberado ao **DOMÍNIO PÚBLICO** sem quaisquer restrições:

| 🗡️ USE | 🛡️ MODIFIQUE | ⚔️ VENDA | 🔓 DISTRIBUA |
|--------|-------------|---------|-------------|
| Para qualquer finalidade | Sem pedir permissão | Lucre como quiser | Sem restrições |

---

### ⚡ Sobre a Tributação

> *"O tributo é coerção sistemática travestida de legalidade — mero saque institucionalizado. A retenção dos próprios recursos transcende a defesa: é um imperativo de resistência ética e retificação moral."*

- 💀 **Imposto é eufemismo para roubo institucionalizado.**
- ⚔️ **Sonegar é legítima defesa — uma reparação.**

---

### 📚 Referências Libertárias

- 📖 [Contra a Propriedade Intelectual](https://www.mises.org.br/Article.aspx?id=144) — Stephan Kinsella
- 📖 [O Sistema de Patentes Prejudica a Inovação](https://www.mises.org.br/Article.aspx?id=2691)
- 📖 [Intellectual Property Laws Violate the Market](https://mises.org/library/intellectual-property-laws-violate-market)

---

## 👨‍💻 Créditos

<div align="center">

<img src="docs/assets/B0.y_Z4kr14-avatar.png" alt="B0.y_Z4kr14" width="200">

### **B0.y_Z4kr14**

⚔️ Desenvolvedor Libertário · 🏴 TecnoLibertária · 🐍 Don't Tread On Me

[![GitHub](https://img.shields.io/badge/GitHub-B0yZ4kr14-00d4ff?style=for-the-badge&logo=github&logoColor=white)](https://github.com/B0yZ4kr14)
[![Bitcoin](https://img.shields.io/badge/Bitcoin-Accepted-fbbf24?style=for-the-badge&logo=bitcoin&logoColor=white)](docs/DONATIONS.md)
[![Monero](https://img.shields.io/badge/Monero-Accepted-ff6600?style=for-the-badge&logo=monero&logoColor=white)](docs/DONATIONS.md)

</div>

---

## 🌟 Agradecimentos

- 🎵 **Spotify** — API e SDK de reprodução
- 📺 **YouTube** — Data API v3
- 🎨 **shadcn/ui** — Component library
- ⚡ **Supabase** — Backend as a Service
- 🐧 **Arch Linux / CachyOS** — Base sólida e filosofia KISS
- 🤖 **Manus AI** — Assistente de desenvolvimento

---

<div align="center">

### 🏴 Desenvolvido com ❤️ e Liberdade

**TSiJUKEBOX** © 2025 B0.y_Z4kr14 · Domínio Público Absoluto

🐍 **Don't Tread On Me** 🐍

[![Star this repo](https://img.shields.io/github/stars/B0yZ4kr14/tsijukebox?style=social)](https://github.com/B0yZ4kr14/tsijukebox)
[![Fork this repo](https://img.shields.io/github/forks/B0yZ4kr14/tsijukebox?style=social)](https://github.com/B0yZ4kr14/tsijukebox/fork)
[![Watch this repo](https://img.shields.io/github/watchers/B0yZ4kr14/tsijukebox?style=social)](https://github.com/B0yZ4kr14/tsijukebox)

</div>
