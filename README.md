<div align="center">

# 🎵 TSiJUKEBOX Enterprise

<img src="public/logo/logo-full-dark.svg" alt="TSiJUKEBOX Logo" width="400">

### 🎧 Sistema de Música Kiosk Empresarial com Integração Spotify

[![Version](https://img.shields.io/badge/version-4.2.0-gold.svg?style=for-the-badge)](https://github.com/B0yZ4kr14/TSiJUKEBOX/releases)
[![License](https://img.shields.io/badge/license-MIT-cyan.svg?style=for-the-badge)](LICENSE)
[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6.svg?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

[📖 Documentação](https://github.com/B0yZ4kr14/TSiJUKEBOX/wiki) • 
[🚀 Demo](https://tsijukebox.vercel.app) • 
[📋 Issues](https://github.com/B0yZ4kr14/TSiJUKEBOX/issues) • 
[💬 Discussões](https://github.com/B0yZ4kr14/TSiJUKEBOX/discussions)

</div>

---

## ✨ Características

<table>
<tr>
<td width="50%">

### 🎵 Player de Música
- Integração completa com Spotify Web API
- Controle de reprodução avançado
- Visualizador de áudio em tempo real
- Modo karaoke com letras sincronizadas
- Fila de reprodução inteligente

</td>
<td width="50%">

### 🎨 Interface Moderna
- Design System Dark-Neon-Gold
- Tema escuro otimizado para kiosk
- Animações fluidas com Framer Motion
- Responsivo para todas as telas
- Acessibilidade WCAG 2.1 AA

</td>
</tr>
<tr>
<td width="50%">

### 🔧 Configurações Avançadas
- Painel de administração completo
- Integração com GitHub para versionamento
- Backup automático para nuvem
- Monitoramento com Grafana
- Controle por voz

</td>
<td width="50%">

### 🚀 Instalação Autônoma
- Instalador unificado de 26 fases
- Suporte a modo kiosk
- Configuração automática de Nginx
- SSL com Let's Encrypt
- Systemd services

</td>
</tr>
</table>

---

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 18+ ou 20+
- pnpm 8+
- Conta Spotify Developer (para integração)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/B0yZ4kr14/TSiJUKEBOX.git
cd TSiJUKEBOX

# Instale as dependências
pnpm install

# Configure as variáveis de ambiente
cp .env.example .env

# Inicie o servidor de desenvolvimento
pnpm dev
```

### Instalação em Produção (Linux)

```bash
# Instalação completa com todas as integrações
curl -fsSL https://raw.githubusercontent.com/B0yZ4kr14/TSiJUKEBOX/main/scripts/unified-installer.py | sudo python3 -- --mode full

# Instalação em modo kiosk
curl -fsSL https://raw.githubusercontent.com/B0yZ4kr14/TSiJUKEBOX/main/scripts/unified-installer.py | sudo python3 -- --mode kiosk
```

---

## 📁 Estrutura do Projeto

```
TSiJUKEBOX/
├── 📁 src/
│   ├── 📁 components/     # Componentes React
│   │   ├── 📁 player/     # Componentes do player
│   │   ├── 📁 settings/   # Componentes de configurações
│   │   └── 📁 ui/         # Componentes de UI base
│   ├── 📁 contexts/       # Contextos React
│   ├── 📁 hooks/          # Hooks customizados
│   ├── 📁 lib/            # Utilitários e design tokens
│   ├── 📁 pages/          # Páginas da aplicação
│   └── 📁 types/          # Definições de tipos TypeScript
├── 📁 docs/               # Documentação
├── 📁 scripts/            # Scripts de automação
├── 📁 public/             # Assets públicos
└── 📁 supabase/           # Configurações do Supabase
```

---

## 🎨 Design System

O TSiJUKEBOX utiliza um Design System consistente baseado em:

| Token | Valor | Uso |
|-------|-------|-----|
| **Gold Neon** | `#FBB724` | Destaques e CTAs |
| **Cyan Neon** | `#00D4FF` | Links e interações |
| **Magenta** | `#FF00FF` | Alertas e badges |
| **Background** | `#09090B` | Fundo principal |
| **Card** | `#18181B` | Cards e painéis |

---

## 📖 Documentação

Consulte nossa [Wiki](https://github.com/B0yZ4kr14/TSiJUKEBOX/wiki) para documentação completa:

- [🏠 Home](https://github.com/B0yZ4kr14/TSiJUKEBOX/wiki)
- [🚀 Guia de Instalação](https://github.com/B0yZ4kr14/TSiJUKEBOX/wiki/Installation-Guide)
- [⚙️ Configuração](https://github.com/B0yZ4kr14/TSiJUKEBOX/wiki/Configuration)
- [🎨 Design System](https://github.com/B0yZ4kr14/TSiJUKEBOX/wiki/Design-System)
- [♿ Acessibilidade](https://github.com/B0yZ4kr14/TSiJUKEBOX/wiki/Accessibility)
- [🔌 API Reference](https://github.com/B0yZ4kr14/TSiJUKEBOX/wiki/API-Reference)
- [🤝 Contribuindo](https://github.com/B0yZ4kr14/TSiJUKEBOX/wiki/Contributing)

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, leia nosso [Guia de Contribuição](CONTRIBUTING.md) antes de enviar um Pull Request.

```bash
# Fork o repositório
# Crie uma branch para sua feature
git checkout -b feature/amazing-feature

# Commit suas mudanças
git commit -m 'feat: add amazing feature'

# Push para a branch
git push origin feature/amazing-feature

# Abra um Pull Request
```

---

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 🙏 Agradecimentos

- [Spotify](https://developer.spotify.com/) pela API de música
- [Radix UI](https://www.radix-ui.com/) pelos componentes acessíveis
- [Tailwind CSS](https://tailwindcss.com/) pelo sistema de estilos
- [Framer Motion](https://www.framer.com/motion/) pelas animações

---

<div align="center">

**Feito com ❤️ por [B0yZ4kr14](https://github.com/B0yZ4kr14) e [Manus AI](https://manus.im)**

⭐ Se este projeto te ajudou, considere dar uma estrela!

</div>
