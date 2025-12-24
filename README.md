<div align="center">

<img src="docs/assets/logo.svg" alt="TSiJUKEBOX Logo" width="400">

<br><br>

# 🎵 TSiJUKEBOX
### Enterprise Digital Jukebox System

[![Version](https://img.shields.io/badge/version-4.2.0-00d4ff?style=for-the-badge&logo=github&logoColor=white)](docs/CHANGELOG.md)
[![License](https://img.shields.io/badge/license-Public%20Domain-fbbf24?style=for-the-badge&logo=unlicense&logoColor=white)](LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/B0yZ4kr14/TSiJUKEBOX/ci.yml?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/B0yZ4kr14/TSiJUKEBOX/actions)
[![Coverage](https://img.shields.io/badge/coverage-70%25-22c55e?style=for-the-badge&logo=codecov&logoColor=white)](docs/testing/TEST_COVERAGE_90_ACTION_PLAN.md)
[![WCAG 2.1 AA](https://img.shields.io/badge/WCAG-2.1%20AA-22c55e?style=for-the-badge&logo=accessibility&logoColor=white)](docs/ACCESSIBILITY.md)
[![React](https://img.shields.io/badge/React-18.3-61dafb?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

**Sistema kiosk musical profissional com integração Spotify, YouTube Music e arquivos locais.**

[📖 Documentação](docs/WIKI.md) · [🌐 Wiki](https://github.com/B0yZ4kr14/TSiJUKEBOX/wiki) · [🎮 Demo](https://tsijukebox.lovable.app) · [🐛 Report Bug](https://github.com/B0yZ4kr14/TSiJUKEBOX/issues) · [✨ Request Feature](https://github.com/B0yZ4kr14/TSiJUKEBOX/issues)

</div>

---

## ⚡ Instalação

### 🚀 Instalação Remota (Um Comando)

```bash
curl -fsSL https://raw.githubusercontent.com/B0yZ4kr14/TSiJUKEBOX/main/scripts/install.py | sudo python3
```

> **Nota:** O comando acima baixa um shim que executa o instalador principal (`unified-installer.py`).

**✅ Compatível com:** Arch Linux · CachyOS · Manjaro · EndeavourOS

### 🖥️ Instalação Local

```bash
git clone https://github.com/B0yZ4kr14/TSiJUKEBOX.git
cd TSiJUKEBOX
sudo python3 scripts/unified-installer.py
```

### 🎮 Modos de Instalação

| Modo | Comando | Ideal Para | Recursos |
|------|---------|------------|----------|
| 🎵 **Full** | `--mode full` | Uso doméstico completo | Spotify + YouTube + Local + Karaoke + Dev Tools |
| 🖥️ **Kiosk** | `--mode kiosk` | Bares, eventos, karaokês | Interface touch + Autostart + Bloqueio |
| 🖧 **Server** | `--mode server` | Servidor headless | API REST + WebSocket + Monitoramento |
| ⚡ **Minimal** | `--mode minimal` | Sistemas com recursos limitados | Apenas componentes essenciais |

### 📋 26 Fases Automatizadas

O instalador executa **26 fases** estruturadas:

<details>
<summary>Ver todas as fases</summary>

| # | Fase | Descrição |
|---|------|-----------|
| 1 | Hardware | Análise de CPU, RAM, GPU, disco |
| 2 | Sistema | Verificação de pacman e AUR helper |
| 3 | Node.js | Instalação do Node.js 20.x LTS |
| 4 | Firewall | Configuração do UFW |
| 5 | NTP | Sincronização de tempo |
| 6 | Fontes | Instalação de fontes do sistema |
| 7 | Áudio | Configuração PipeWire/PulseAudio |
| 8 | Database | Configuração Supabase |
| 9 | Nginx | Proxy reverso |
| 10 | Monitoring | Grafana + Prometheus |
| 11 | Backup | rclone para nuvem |
| 12 | Spotify | Cliente oficial |
| 13 | Spicetify | Temas e extensões |
| 14 | Spotify CLI | spotify-tui + spotifyd |
| 15 | Kiosk | Openbox + Chromium |
| 16 | Voice | Controle por voz |
| 17 | Dev Tools | Ferramentas de desenvolvimento |
| 18 | Autologin | Login automático |
| 19 | Clone | Repositório GitHub |
| 20 | Build | npm install && build |
| 21 | Services | Systemd autostart |
| 22 | SSL | Certificados HTTPS |
| 23 | mDNS | Avahi |
| 24 | Shell | Fish shell |
| 25 | GitHub | gh CLI |
| 26 | Verify | Verificação final |

</details>

### 🔧 Opções Avançadas

```bash
# Simular instalação (dry-run)
sudo python3 unified-installer.py --dry-run

# Modo kiosk para usuário específico
sudo python3 unified-installer.py --mode kiosk --user pi

# Sem Spotify e monitoramento
sudo python3 unified-installer.py --no-spotify --no-monitoring

# Com Let's Encrypt SSL
sudo python3 unified-installer.py --ssl-mode letsencrypt --ssl-domain meudominio.com --ssl-email admin@meudominio.com

# Instalação não-interativa
sudo python3 unified-installer.py --mode full --auto -y
```

<details>
<summary>Ver todas as opções</summary>

#### Opções Gerais

| Opção | Descrição |
|-------|-----------|
| `--mode {full,server,kiosk,minimal}` | Modo de instalação |
| `--user USER` | Usuário do sistema (auto-detectado) |
| `--dry-run` | Simular sem fazer alterações |
| `--verbose, -v` | Saída detalhada |
| `--quiet, -q` | Saída mínima |
| `--auto, -y` | Modo não-interativo |

#### Opções de Skip

| Opção | Descrição |
|-------|-----------|
| `--no-nodejs` | Não instalar Node.js |
| `--no-ufw` | Não configurar firewall |
| `--no-nginx` | Não instalar Nginx |
| `--no-monitoring` | Não instalar Grafana/Prometheus |
| `--no-spotify` | Não instalar Spotify |
| `--no-ssl` | Não configurar SSL |

#### Opções de SSL

| Opção | Descrição |
|-------|-----------|
| `--ssl-mode {self-signed,letsencrypt}` | Tipo de certificado |
| `--ssl-domain DOMAIN` | Domínio para SSL (padrão: midiaserver.local) |
| `--ssl-email EMAIL` | Email para Let's Encrypt |

#### Opções de Configuração

| Opção | Descrição |
|-------|-----------|
| `--supabase-url URL` | URL do Supabase |
| `--supabase-key KEY` | Chave do Supabase |
| `--timezone TIMEZONE` | Timezone (padrão: America/Sao_Paulo) |

</details>

### 📦 Componentes Instalados Automaticamente

| Categoria | Componentes |
|-----------|-------------|
| **Core** | Node.js 20.x, UFW, PipeWire, Nginx |
| **Spotify** | Spotify, Spicetify, spotify-tui, spotifyd |
| **Monitoring** | Grafana, Prometheus, node_exporter |
| **Kiosk** | Openbox, Chromium, Autologin |
| **Tools** | rclone, Fish Shell, GitHub CLI, Avahi |

[📖 Guia Completo de Instalação](docs/QUICK-INSTALL.md) · [🏭 Deploy em Produção](docs/PRODUCTION-DEPLOY.md) · [🐧 CachyOS Setup](https://github.com/B0yZ4kr14/TSiJUKEBOX/wiki/Install-CachyOS)

---

## 📸 Preview

<div align="center">

### 🎯 Setup Wizard

<img src="public/screenshots/preview-setup-wizard.png" alt="Setup Wizard" width="800">

*Configuração inicial guiada com 9 etapas intuitivas para personalizar completamente sua experiência.*

---

### 📊 Dashboard de Estatísticas

<img src="public/screenshots/preview-dashboard.png" alt="Dashboard" width="800">

*Monitoramento em tempo real de CPU, Memória, Temperatura e Top Músicas com gráficos interativos.*

---

### 🎵 Integração Spotify

<img src="public/screenshots/preview-spotify.png" alt="Spotify Integration" width="800">

*Conecte sua conta Spotify e acesse todas as suas playlists com controle total de reprodução.*

---

### 🎨 Brand Guidelines

<img src="public/screenshots/preview-brand.png" alt="Brand Guidelines" width="800">

*Paleta Neon completa com gradientes, tipografia e componentes do Design System.*

---

### 🎬 Demo em Ação

<img src="public/screenshots/demo-animated.gif" alt="Demo Animado" width="800">

*Navegação animada pelo sistema mostrando Setup Wizard, Dashboard, Spotify Connect e Karaoke Mode.*

---

### 🎵 Player Interface

<img src="docs/assets/mockups/player-screen.png" alt="Player Screen" width="800">

*Interface principal do player com controles completos, visualização de álbum e fila de reprodução.*

</div>

> 💡 **Dica:** Execute a edge function `screenshot-service` para gerar screenshots reais:
>
> ```bash
> # Capture screenshots e salve em public/screenshots/
> scrot -d 3 public/screenshots/dashboard.png
> ```

---

## 🎨 Seções da Documentação

<div align="center">

<table>
  <tr>
    <td align="center" width="25%">
      <img src="docs/assets/icons/installation.png" width="80" alt="Installation"/>
      <br/><strong>Instalação</strong>
      <br/><sub>Verde Neon</sub>
    </td>
    <td align="center" width="25%">
      <img src="docs/assets/icons/configuration.png" width="80" alt="Configuration"/>
      <br/><strong>Configuração</strong>
      <br/><sub>Cyan</sub>
    </td>
    <td align="center" width="25%">
      <img src="docs/assets/icons/tutorials.png" width="80" alt="Tutorials"/>
      <br/><strong>Tutoriais</strong>
      <br/><sub>Magenta</sub>
    </td>
    <td align="center" width="25%">
      <img src="docs/assets/icons/development.png" width="80" alt="Development"/>
      <br/><strong>Desenvolvimento</strong>
      <br/><sub>Amarelo Ouro</sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="25%">
      <img src="docs/assets/icons/api.png" width="80" alt="API"/>
      <br/><strong>API</strong>
      <br/><sub>Roxo</sub>
    </td>
    <td align="center" width="25%">
      <img src="docs/assets/icons/security.png" width="80" alt="Security"/>
      <br/><strong>Segurança</strong>
      <br/><sub>Laranja</sub>
    </td>
    <td align="center" width="25%">
      <img src="docs/assets/icons/monitoring.png" width="80" alt="Monitoring"/>
      <br/><strong>Monitoramento</strong>
      <br/><sub>Verde Lima</sub>
    </td>
    <td align="center" width="25%">
      <img src="docs/assets/icons/testing.png" width="80" alt="Testing"/>
      <br/><strong>Testes</strong>
      <br/><sub>Azul Elétrico</sub>
    </td>
  </tr>
</table>

[📖 Ver Documentação Completa dos Ícones](docs/assets/icons/README.md)

</div>

---

## ✨ Features

### 🎯 Recursos Principais

| Feature | Descrição | Status |
|---------|-----------|--------|
| 🎧 **Multi-Provider** | Spotify, YouTube Music, Arquivos Locais | ✅ Completo |
| 📱 **Kiosk Mode** | Interface touch otimizada para uso público | ✅ Completo |
| 🎤 **Karaoke Mode** | Letras sincronizadas em fullscreen | ✅ Completo |
| ☁️ **Cloud Backup** | Storj, Google Drive, AWS S3 | ✅ Completo |
| 🔐 **RBAC** | Roles: Admin, User, Newbie | ✅ Completo |
| 📊 **System Monitor** | CPU, RAM, temperatura em tempo real | ✅ Completo |
| 🌐 **i18n** | Português, English, Español | ✅ Completo |
| ♿ **WCAG 2.1 AA** | Acessibilidade validada | ✅ Completo |
| 📱 **PWA** | Progressive Web App com offline support | ✅ Completo |
| 🔄 **Auto-Update** | Atualizações automáticas em background | ✅ Completo |

### 🚀 Recursos Avançados

| Feature | Descrição | Status |
|---------|-----------|--------|
| 🎉 **JAM Sessions** | Sessões colaborativas com votação em tempo real | ✅ Completo |
| 🎙️ **Voice Control** | Controle por voz com comandos em português | ✅ Completo |
| 🐙 **GitHub Sync** | Sincronização automática de configurações | ✅ Completo |
| 🤖 **AI Suggestions** | Sugestões inteligentes baseadas em histórico | ✅ Completo |
| 👆 **Touch Gestures** | Gestos touch para modo kiosk | ✅ Completo |
| ⌨️ **Keyboard Shortcuts** | 50+ atalhos de teclado | ✅ Completo |
| 🔔 **Discord Webhooks** | Notificações em tempo real | ✅ Completo |

### 🎵 Integrações de Música

| Provider | Recursos | Autenticação |
|----------|----------|--------------|
| 🎵 **Spotify** | Streaming, Playlists, Spotify Connect, Letras | OAuth 2.0 |
| 📺 **YouTube Music** | Streaming, Playlists, Mix Personalizado | OAuth 2.0 |
| 📁 **Arquivos Locais** | MP3, FLAC, AAC, OGG, WAV, OPUS | N/A |
| ☁️ **SoundCloud** | Streaming, Playlists (Beta) | OAuth 2.0 |

### 🎮 Modos de Operação

| Modo | Descrição | Casos de Uso |
|------|-----------|--------------|
| 🖥️ **Desktop** | Interface completa com todas as funcionalidades | Uso pessoal, estúdios |
| 🏪 **Kiosk** | Interface simplificada e bloqueada | Bares, restaurantes, eventos |
| 🖧 **Server** | API REST sem interface gráfica | Integração com sistemas externos |
| 🎤 **Karaoke** | Foco em letras e fila de músicas | Karaokês, festas |

---

## 📊 Métricas do Projeto

| Métrica | Valor |
|---------|-------|
| 📁 **Arquivos** | 1.209 |
| 🧩 **Componentes** | 241 |
| 🪝 **Hooks** | 187 |
| 📄 **Documentação** | 226 arquivos |
| 🧪 **Testes** | 70 unit + 31 E2E |
| ⚡ **Edge Functions** | 31 |

---

## 🚀 Quick Start

### 💻 Desenvolvimento Local

```bash
# Clone o repositório
git clone https://github.com/B0yZ4kr14/TSiJUKEBOX.git

# Entre no diretório
cd TSiJUKEBOX

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse **http://localhost:5173** · Login padrão: `admin` / `admin`

### 🔐 Variáveis de Ambiente

Copie `.env.example` para `.env` e configure:

| Variável | Descrição | Obrigatório |
|----------|-----------|-------------|
| `VITE_SUPABASE_URL` | URL do projeto Supabase | ✅ |
| `VITE_SUPABASE_ANON_KEY` | Chave anônima do Supabase | ✅ |
| `VITE_SPOTIFY_CLIENT_ID` | Client ID do Spotify | ⚠️ Para Spotify |
| `VITE_YOUTUBE_API_KEY` | API Key do YouTube | ⚠️ Para YouTube |

### 🐳 Docker (Recomendado para Produção)

```bash
# Build e start com Docker Compose
docker-compose up -d

# Ou use o Makefile
make docker-up
```

### 🛠️ Comandos Úteis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build |
| `npm run lint` | Verificar código |
| `npm run test` | Executar testes |
| `npm run test:e2e` | Testes E2E (Playwright) |

### 📋 Requisitos do Sistema

| Componente | Mínimo | Recomendado |
|------------|--------|-------------|
| 🖥️ **OS** | Linux, Windows, macOS | CachyOS / Arch Linux |
| ⚙️ **CPU** | 2 cores | 4+ cores |
| 💾 **RAM** | 2 GB | 4+ GB |
| 💿 **Disco** | 500 MB | 2+ GB (com cache de mídia) |
| 🖥️ **Display** | 1280x720 | 1920x1080+ |
| 🌐 **Browser** | Chrome 90+ | Chrome 120+ |
| 🟢 **Node.js** | 18.x | 20.x LTS |

---

## 🧪 Testes

### 📊 Cobertura Atual

| Tipo | Arquivos | Cobertura | Meta |
|------|----------|-----------|------|
| Unit Tests | 70 | 70% | 90% |
| E2E Tests | 31 specs | - | 50+ |
| Integration | 10 | 80% | 90% |

### 🎯 Comandos de Teste

| Tipo | Comando | Descrição |
|------|---------|-----------|
| 🔬 **Unit** | `npm run test:unit` | Testes unitários com Vitest |
| 🔗 **Integration** | `npm run test:integration` | Testes de integração |
| 🌐 **E2E** | `npm run test:e2e` | Testes end-to-end (Playwright) |
| 🖥️ **E2E UI** | `npm run test:e2e:ui` | Playwright UI Mode |
| ♿ **A11y** | `npm run test:a11y` | Testes de acessibilidade |
| 📊 **Coverage** | `npm run test:coverage` | Relatório de cobertura |
| 🖥️ **UI** | `npm run test:ui` | Vitest UI no navegador |
| 📋 **All** | `npm run test:all` | Executar todos os testes |

### 🌐 Projetos Playwright

- ✅ Chromium, Firefox, WebKit
- ✅ Mobile (Pixel 5, iPhone 12)
- ✅ Kiosk Mode (1080x1920)
- ✅ Accessibility Testing
- ✅ Performance Testing

### 🐍 Python (Instalador)

| Tipo | Comando | Descrição |
|------|---------|-----------|
| 🐍 **Unit** | `make test-python` | Testes unitários Python |
| 📊 **Coverage** | `make test-python-coverage` | Cobertura Python |

```bash
# Executar testes Python
cd scripts && pytest tests/ -v

# Com cobertura
cd scripts && pytest tests/ --cov=. --cov-report=term-missing
```

**📊 [Dashboard de Cobertura](https://B0yZ4kr14.github.io/TSiJUKEBOX/)**

---

## 🏗️ Stack Tecnológico

### 🎨 Frontend

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| ⚛️ **React** | 18.3 | UI Library |
| 📘 **TypeScript** | 5.0 | Type Safety |
| ⚡ **Vite** | 5.0 | Build Tool |
| 🎨 **Tailwind CSS** | 3.4 | Styling |
| 🧩 **shadcn/ui** | Latest | Component Library |
| 🎬 **Framer Motion** | 11.x | Animations |
| 🔄 **React Query** | 5.x | Server State |
| 🗄️ **Zustand** | 4.x | Client State |
| 🎨 **Radix UI** | Latest | Componentes Acessíveis |

### 🖧 Backend & Infraestrutura

| Tecnologia | Propósito |
|------------|-----------|
| ⚡ **Supabase** | Backend as a Service |
| 🔥 **Edge Functions** | Serverless Functions |
| 🐘 **PostgreSQL** | Database |
| 🔴 **Redis** | Caching |
| 🌐 **Nginx** | Reverse Proxy |

### 🔌 Integrações

| Serviço | API |
|---------|-----|
| 🎵 **Spotify** | Web API + Playback SDK |
| 📺 **YouTube Music** | Data API v3 |
| 🎨 **Spicetify** | CLI + Extensions |
| 📊 **Grafana** | Dashboards |
| 📈 **Prometheus** | Metrics |
| 🐙 **GitHub** | API + OAuth |
| 💬 **Discord** | Webhooks |

### 🔧 Ferramentas de Desenvolvimento

| Ferramenta | Propósito |
|------------|-----------|
| 🧪 **Vitest** | Unit Testing |
| 🎭 **Playwright** | E2E Testing |
| ♿ **axe-core** | Accessibility Testing |
| 📊 **Chart.js** | Visualizações |
| 🔍 **ESLint** | Linting |
| 💅 **Prettier** | Formatting |

---

## 🔒 Segurança

| Feature | Descrição |
|---------|-----------|
| 🔐 **OAuth 2.0** | Autenticação segura |
| 🛡️ **RBAC** | 3 níveis de permissão |
| 🔥 **UFW** | Firewall configurado |
| 🔒 **SSL/TLS** | Certificados configuráveis |

📋 [Política de Segurança](docs/SECURITY.md) · 🐛 [Reportar Vulnerabilidade](https://github.com/B0yZ4kr14/TSiJUKEBOX/security/advisories)

---

## 🗺️ Roadmap

### Q1 2025
- [ ] Atingir 90% de cobertura de testes
- [ ] Completar conformidade WCAG 2.1 AA
- [ ] Lançar versão 5.0

### Q2 2025
- [ ] Integração com Apple Music
- [ ] App mobile nativo (React Native)
- [ ] Marketplace de temas

---

## ❓ FAQ (Perguntas Frequentes)

### 🔧 Instalação e Configuração

**P: Quais sistemas operacionais são suportados?**

R: O TSiJUKEBOX é compatível com Linux (CachyOS, Arch, Manjaro, EndeavourOS recomendados), Windows e macOS. Para melhor experiência, recomendamos CachyOS com Openbox.

**P: Preciso de uma conta Spotify Premium?**

R: Não é obrigatório, mas o Spotify Premium é altamente recomendado para acesso completo a recursos como Spotify Connect e streaming de alta qualidade.

**P: Como altero a senha padrão?**

R: Após o primeiro login com `admin`/`admin`, acesse **Configurações > Segurança > Alterar Senha** e defina uma nova senha.

**P: O instalador funciona em outras distribuições Linux?**

R: O instalador automático é otimizado para Arch Linux e derivados. Para outras distribuições, consulte o [Guia de Instalação Manual](docs/INSTALLATION.md).

**P: Como configuro as JAM Sessions?**

R: Acesse **Configurações > JAM Sessions** e configure:
- Número máximo de participantes
- Sistema de votação
- Integração com Discord

**P: O sistema suporta controle por voz?**

R: Sim! Ative em **Configurações > Acessibilidade > Controle por Voz**. Comandos disponíveis: "reproduzir", "pausar", "próxima", "anterior", "volume".

**P: Como sincronizo com GitHub?**

R: Acesse **Configurações > Integrações > GitHub** e autorize o acesso. O sistema fará backup automático das configurações.

---

### 🎵 Uso e Funcionalidades

**P: Como adiciono músicas locais?**

R: Acesse **Configurações > Música Local**, clique em "Adicionar Diretório" e selecione a pasta com seus arquivos de música. O sistema escaneará automaticamente os arquivos compatíveis.

**P: Posso usar o TSiJUKEBOX sem internet?**

R: Sim! O modo offline permite reproduzir músicas locais e acessar playlists previamente sincronizadas. Recursos de streaming (Spotify, YouTube) requerem conexão.

**P: Como ativo o modo Karaoke?**

R: Clique no ícone 🎤 no player ou acesse **Configurações > Modos > Karaoke**. As letras serão exibidas em fullscreen sincronizadas com a música.

**P: O sistema suporta múltiplos usuários?**

R: Sim! O TSiJUKEBOX possui sistema RBAC com 3 níveis: **Admin** (controle total), **User** (uso padrão) e **Newbie** (acesso limitado).

---

### 🛠️ Troubleshooting

**P: O Spotify não conecta. O que fazer?**

R: Verifique se suas credenciais OAuth estão corretas em **Configurações > Integrações > Spotify**. Certifique-se de que a URI de redirecionamento está configurada no Spotify Developer Dashboard.

**P: O sistema está lento. Como otimizar?**

R: Acesse **Configurações > Performance** e ajuste:
- Desabilite animações complexas
- Reduza o cache de álbuns
- Limite o histórico de reprodução
- Ative o modo de baixo consumo

**P: Como faço backup das configurações?**

R: Acesse **Configurações > Backup** e escolha:
- **Manual:** Exportar para arquivo local
- **Automático:** Configurar backup em nuvem (Storj, Google Drive, S3)

**P: Erro ao instalar no CachyOS. O que fazer?**

R: Consulte o [Guia de Instalação CachyOS](https://github.com/B0yZ4kr14/TSiJUKEBOX/wiki/Install-CachyOS) ou abra uma [issue no GitHub](https://github.com/B0yZ4kr14/TSiJUKEBOX/issues).

---

## 📚 Documentação Completa

### 📖 Guias Principais

| Documento | Descrição |
|-----------|-----------|
| 🚀 [Getting Started](docs/guides/GETTING_STARTED.md) | Primeiros passos |
| 🏗️ [Developer Guide](docs/guides/DEVELOPER_GUIDE.md) | Guia do desenvolvedor |
| 🏭 [Deployment Guide](docs/guides/DEPLOYMENT_GUIDE.md) | Deploy em produção |
| 📚 [Wiki Completa](docs/WIKI.md) | Documentação detalhada |

### 🎨 Design e Arquitetura

| Documento | Descrição |
|-----------|-----------|
| 🎨 [Design System](docs/DESIGN_SYSTEM.md) | Tokens e componentes |
| 🏛️ [Architecture](docs/ARCHITECTURE.md) | Arquitetura do sistema |
| 🪝 [Hooks Architecture](docs/HOOKS-ARCHITECTURE.md) | Arquitetura de hooks |
| 🎨 [Color Tokens](docs/COLOR_TOKENS_MAPPING.md) | Mapeamento de cores |

### ♿ Acessibilidade

| Documento | Descrição |
|-----------|-----------|
| ♿ [Accessibility](docs/ACCESSIBILITY.md) | Visão geral |
| 📋 [WCAG Compliance](docs/accessibility/WCAG_COMPLIANCE.md) | Conformidade WCAG |
| 🏷️ [ARIA Guide](docs/accessibility/ARIA_IMPLEMENTATION_GUIDE.md) | Implementação ARIA |
| ⌨️ [Keyboard Navigation](docs/accessibility/KEYBOARD_NAVIGATION.md) | Navegação por teclado |

### 🧪 Testes

| Documento | Descrição |
|-----------|-----------|
| 📋 [Test Plan](docs/testing/TEST_COVERAGE_90_ACTION_PLAN.md) | Plano de cobertura 90% |
| 🌐 [E2E Tests](docs/testing/E2E_TESTS.md) | Testes end-to-end |
| 🔬 [Unit Tests](docs/testing/UNIT_TESTS.md) | Testes unitários |

### 📊 Análises

| Documento | Descrição |
|-----------|-----------|
| 📊 [Complete Analysis](docs/COMPLETE_REPOSITORY_ANALYSIS.md) | Análise completa do repositório |
| 🎨 [Color Refactor](docs/COLOR_REFACTOR_REPORT.md) | Relatório de refatoração de cores |
| 🔐 [Security](docs/SECURITY.md) | Políticas de segurança |
| 🔄 [Changelog](docs/CHANGELOG.md) | Histórico de versões |

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Siga os passos:

1. 🍴 Fork o projeto
2. 🌿 Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. 💾 Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. 📤 Push para a branch (`git push origin feature/AmazingFeature`)
5. 🔀 Abra um Pull Request

### 🎯 Como Contribuir

| Tipo | Descrição |
|------|-----------|
| 🐛 **Bug Fix** | Corrigir bugs existentes |
| ✨ **Feature** | Adicionar novas funcionalidades |
| 📖 **Docs** | Melhorar documentação |
| 🧪 **Tests** | Adicionar testes |
| ♿ **A11y** | Melhorar acessibilidade |
| 🌐 **i18n** | Adicionar traduções |

**📋 [Guia de Contribuição](CONTRIBUTING.md)** · **📜 [Code of Conduct](CODE_OF_CONDUCT.md)** · **🐛 [Report Bug](https://github.com/B0yZ4kr14/TSiJUKEBOX/issues)**

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

Na perspectiva anarcocapitalista, a **propriedade intelectual** constitui uma **aberração conceitual** — uma falácia lógica incapaz de sustentar-se ante a natureza **superabundante** e **não-rival** das ideias.

Diferente de bens tangíveis, **copiar software não priva o autor original** do uso de seu código. Portanto, inexiste "roubo" no compartilhamento de conhecimento — apenas **multiplicação de valor sem custo marginal**.

| 📜 Conceito | 🏛️ Visão Estatal | ⚔️ Visão Libertária |
|-------------|------------------|---------------------|
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
|--------|--------------|----------|--------------|
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

⚔️ Desenvolvedor Libertário · 🏴 Anarcocapitalista · 🐍 Don't Tread On Me

[![GitHub](https://img.shields.io/badge/GitHub-B0yZ4kr14-00d4ff?style=for-the-badge&logo=github&logoColor=white)](https://github.com/B0yZ4kr14)
[![Bitcoin](https://img.shields.io/badge/Bitcoin-Accepted-fbbf24?style=for-the-badge&logo=bitcoin&logoColor=white)](docs/DONATIONS.md)
[![Monero](https://img.shields.io/badge/Monero-Accepted-ff6600?style=for-the-badge&logo=monero&logoColor=white)](docs/DONATIONS.md)

</div>

---

## 🌟 Agradecimentos

Agradecimentos especiais a todos os contribuidores e à comunidade open source:

- 🎵 **Spotify** - API e SDK de reprodução
- 📺 **YouTube** - Data API v3
- 🎨 **shadcn/ui** - Component library
- ⚡ **Supabase** - Backend as a Service
- 🐧 **Arch Linux Community** - Base sólida e filosofia KISS

---

## 📞 Suporte e Comunidade

| Canal | Link |
|-------|------|
| 🐛 **Issues** | [GitHub Issues](https://github.com/B0yZ4kr14/TSiJUKEBOX/issues) |
| 💬 **Discussions** | [GitHub Discussions](https://github.com/B0yZ4kr14/TSiJUKEBOX/discussions) |
| 📖 **Wiki** | [GitHub Wiki](https://github.com/B0yZ4kr14/TSiJUKEBOX/wiki) |
| 📧 **Email** | [b0yz4kr14@proton.me](mailto:b0yz4kr14@proton.me) |

---

<div align="center">

### 🏴 Desenvolvido com ❤️ e Liberdade

**TSiJUKEBOX** © 2025 B0.y_Z4kr14 · Domínio Público Absoluto

🐍 **Don't Tread On Me** 🐍

[![Star this repo](https://img.shields.io/github/stars/B0yZ4kr14/tsijukebox?style=social)](https://github.com/B0yZ4kr14/tsijukebox)
[![Fork this repo](https://img.shields.io/github/forks/B0yZ4kr14/tsijukebox?style=social)](https://github.com/B0yZ4kr14/tsijukebox/fork)
[![Watch this repo](https://img.shields.io/github/watchers/B0yZ4kr14/tsijukebox?style=social)](https://github.com/B0yZ4kr14/tsijukebox)

</div>
