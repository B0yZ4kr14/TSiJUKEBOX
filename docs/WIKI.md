# TSiJUKEBOX - Wiki Completa

**Versão:** 4.2.1  
**Última Atualização:** 24/12/2024  
**Status:** 100% Completo ✅

---

## 🎯 Visão Geral

O TSiJUKEBOX é um sistema completo de jukebox digital com suporte a múltiplas fontes de música, modo karaokê, controle por voz e interface kiosk. Esta Wiki contém toda a documentação necessária para instalar, configurar, desenvolver e manter o sistema.

---

## 📚 Índice Geral

### 🚀 Início Rápido
- [Home](wiki/Home.md) - Página inicial da Wiki
- [Getting Started](GETTING-STARTED.md) - Primeiros passos
- [Instalação Rápida](QUICK-INSTALL.md) - Instalação em um comando
- [Primeiro Setup](wiki/Tutorial-First-Setup.md) - Tutorial de configuração inicial

### 📦 Instalação
- [Instalação Completa](INSTALLATION.md) - Guia detalhado de instalação
- [Instalação CachyOS](wiki/Install-CachyOS.md) - Instalação específica para CachyOS
- [Docker + Kiosk](wiki/Install-Docker-Kiosk.md) - Instalação com Docker em modo Kiosk
- [Instalação com Um Comando](wiki/Install-OneCommand.md) - Script automatizado
- [Referência do Instalador v6](wiki/Installer-v6-Reference.md) - Documentação do instalador

### ⚙️ Configuração
- [Configuração Geral](CONFIGURATION.md) - Todas as opções de configuração
- [Banco de Dados](wiki/Config-Database.md) - SQLite, MariaDB, PostgreSQL
- [Temas](wiki/Config-Themes.md) - Personalização visual
- [Acessibilidade](wiki/Config-Accessibility.md) - Configurações de acessibilidade
- [Cloud Backup](wiki/Config-Cloud-Backup.md) - Backup na nuvem
- [Shell (Fish)](wiki/Shell-Configuration.md) - Configuração do Fish Shell

### 🎵 Integrações de Música
- [Spotify](wiki/API-Spotify-Integration.md) - Integração com Spotify
- [YouTube Music](wiki/API-YouTube-Music-Integration.md) - Integração com YouTube Music
- [Arquivos Locais](wiki/User-Guide-Local-Files.md) - Reprodução de arquivos locais
- [Tutorial Spotify](wiki/Tutorial-Spotify-Integration.md) - Passo a passo Spotify
- [Tutorial YouTube Music](wiki/Tutorial-YouTube-Music.md) - Passo a passo YouTube

### 🎤 Recursos Avançados
- [Modo Karaokê](wiki/Tutorial-Karaoke-Mode.md) - Como usar o modo karaokê
- [Modo Kiosk](wiki/Tutorial-Kiosk-Mode.md) - Configuração do modo kiosk
- [Openbox Kiosk](wiki/Openbox-Kiosk-Setup.md) - Setup completo do Openbox
- [Controle por Voz](docs/integrations/VOICE_CONTROL.md) - Comandos de voz
- [WebSocket Real-time](docs/integrations/WEBSOCKET.md) - Comunicação em tempo real

### 👥 Guias do Usuário
- [Guia Básico](wiki/User-Guide-Basic.md) - Uso básico do sistema
- [Guia Avançado](wiki/User-Guide-Advanced.md) - Recursos avançados
- [Guia do Administrador](wiki/User-Guide-Admin.md) - Administração do sistema

---

## 🛠️ Desenvolvimento

### 📐 Arquitetura
- [Arquitetura Geral](ARCHITECTURE.md) - Visão geral da arquitetura
- [Análise de Arquitetura](ARCHITECTURE-ANALYSIS.md) - Análise detalhada
- [Mapa do Projeto](PROJECT-MAP.md) - Estrutura de diretórios
- [Arquitetura de Hooks](HOOKS-ARCHITECTURE.md) - Sistema de hooks
- [Rotas](ROUTES.md) - Sistema de roteamento

### 🎨 Design System
- [Design System](DESIGN-SYSTEM.md) - Sistema de design completo
- [Migração do Design System](DESIGN_SYSTEM_MIGRATION_GUIDE.md) - Guia de migração
- [Componentes de Marca](BRAND-COMPONENTS.md) - Logo, cores, tipografia
- [Ícones das Seções](assets/icons/README.md) - 8 ícones modernos
- [Mockups](assets/mockups/README.md) - Mockups de alta fidelidade

### 🧩 Componentes

#### Navegação
- [GlobalSidebar](components/GLOBAL_SIDEBAR.md) - Sidebar principal
- [Header & Layout](components/HEADER_AND_LAYOUT.md) - Header e MainLayout

#### UI Components
- [Card System](components/CARD_SYSTEM.md) - Sistema de cards
- [Modal System](components/MODAL_SYSTEM.md) - Sistema de modais
- [Toast System](components/TOAST_SYSTEM.md) - Sistema de notificações
- [Button System](components/BUTTON_SYSTEM.md) - Botões e variantes
- [Badge System](components/BADGE_SYSTEM.md) - Badges
- [Form Components](components/FORM_COMPONENTS.md) - Inputs, selects, etc.
- [Specialized Cards](components/SPECIALIZED_CARDS.md) - MusicCard, StatCard, etc.

#### Player
- [PlayerControls](components/PLAYER_CONTROLS.md) - Controles do player
- [NowPlaying](components/NOW_PLAYING.md) - Exibição da música atual
- [VolumeSlider](components/VOLUME_SLIDER.md) - Controle de volume
- [ProgressBar](components/PROGRESS_BAR.md) - Barra de progresso
- [Queue](components/QUEUE.md) - Fila de reprodução

### 🪝 Hooks
- [usePlayer](hooks/USEPLAYER.md) - Hook do player
- [useQueue](hooks/USEQUEUE.md) - Hook da fila
- [useSpotify](hooks/USESPOTIFY.md) - Hook do Spotify
- [useYouTube](hooks/USEYOUTUBE.md) - Hook do YouTube Music
- [useKaraoke](hooks/USEKARAOKE.md) - Hook do karaokê
- [useLayout](hooks/USELAYOUT.md) - Hook do layout
- [useTheme](hooks/USETHEME.md) - Hook de temas
- [useModal](hooks/USEMODAL.md) - Hook de modais
- [useToast](hooks/USETOAST.md) - Hook de toasts

### 🌐 Contextos
- [UserContext](contexts/USERCONTEXT.md) - Contexto de usuário
- [PlayerContext](contexts/PLAYERCONTEXT.md) - Contexto do player
- [QueueContext](contexts/QUEUECONTEXT.md) - Contexto da fila
- [LayoutContext](contexts/LAYOUTCONTEXT.md) - Contexto do layout
- [ThemeContext](contexts/THEMECONTEXT.md) - Contexto de temas

### 🔌 Integrações
- [Spotify API](integrations/SPOTIFY_API.md) - Integração Spotify Web API
- [YouTube Music API](integrations/YOUTUBE_MUSIC_API.md) - Integração YouTube Music
- [Voice Control (Vosk)](integrations/VOICE_CONTROL.md) - Reconhecimento de voz
- [WebSocket](integrations/WEBSOCKET.md) - Comunicação real-time
- [Supabase](integrations/SUPABASE.md) - Backend Supabase
- [Local Backend](integrations/LOCAL_BACKEND.md) - API local

### 📄 Páginas
- [Dashboard](pages/DASHBOARD.md) - Página inicial
- [Player](pages/PLAYER.md) - Página do player
- [Settings](pages/SETTINGS.md) - Página de configurações
- [Karaoke](pages/KARAOKE.md) - Página de karaokê
- [Library](pages/LIBRARY.md) - Biblioteca de músicas
- [Auth](pages/AUTH.md) - Autenticação (Login/Signup)

### 🧪 Testes
- [Guia de Testes](TESTING.md) - Guia geral de testes
- [Testes Unitários](testing/UNIT_TESTS.md) - Padrões de testes unitários
- [Testes de Integração](testing/INTEGRATION_TESTS.md) - Testes de integração
- [Testes E2E](testing/E2E_TESTS.md) - Testes end-to-end
- [Relatório de Cobertura](TEST-COVERAGE-REPORT.md) - Análise de cobertura
- [Testes Python](PYTHON_TESTING.md) - Testes do backend Python

### 📚 Guias de Desenvolvimento
- [Guia do Desenvolvedor](DEVELOPER-GUIDE.md) - Guia completo
- [Getting Started (Dev)](guides/GETTING_STARTED_DEV.md) - Onboarding de desenvolvedores
- [Padrões de Código](CODING-STANDARDS.md) - Code style guide
- [Git Workflow](guides/GIT_WORKFLOW.md) - Fluxo de trabalho Git
- [Como Contribuir](CONTRIBUTING.md) - Guia de contribuição
- [Template de PR](guides/PR_TEMPLATE.md) - Template de Pull Request
- [Template de Issue](guides/ISSUE_TEMPLATE.md) - Template de Issue

---

## 🚀 Deploy & Produção

### 🐳 Docker
- [Deploy com Docker](deployment/DOCKER_DEPLOY.md) - Deployment Docker
- [Kiosk Deploy](deployment/KIOSK_DEPLOY.md) - Deploy em modo kiosk
- [Docker Compose](PRODUCTION-DEPLOY.md) - Produção com Docker Compose

### ☁️ Cloud
- [Deploy em Cloud](deployment/CLOUD_DEPLOY.md) - Vercel, Netlify, etc.
- [SSL/TLS Setup](deployment/SSL_SETUP.md) - Configuração SSL
- [Nginx Config](deployment/NGINX_CONFIG.md) - Configuração Nginx

### 📊 Monitoramento
- [Monitoramento](MONITORING.md) - Sistema de monitoramento
- [Grafana Setup](GRAFANA-SETUP.md) - Configuração do Grafana
- [Logs](LOGGER.md) - Sistema de logs

---

## ⚡ Performance & Otimização

### 🎯 Performance
- [Otimização](performance/OPTIMIZATION.md) - Guia de otimização
- [Bundle Size](performance/BUNDLE_SIZE.md) - Análise de bundle
- [Card System Optimizations](CARD_SYSTEM_OPTIMIZATIONS.md) - Otimizações de cards
- [Lazy Loading](performance/LAZY_LOADING.md) - Code splitting
- [Caching](performance/CACHING.md) - Estratégias de cache

### ♿ Acessibilidade
- [Acessibilidade](ACCESSIBILITY.md) - Guia geral
- [WCAG Compliance](accessibility/WCAG_COMPLIANCE.md) - Conformidade WCAG 2.1 AA
- [ARIA Guide](accessibility/ARIA_GUIDE.md) - Guia de ARIA
- [Navegação por Teclado](accessibility/KEYBOARD_NAVIGATION.md) - Atalhos de teclado
- [Screen Reader](accessibility/SCREEN_READER.md) - Suporte a leitores de tela

---

## 📖 Referências

### 📋 APIs
- [API Reference](API-REFERENCE.md) - Referência completa da API
- [Backend Endpoints](BACKEND-ENDPOINTS.md) - Endpoints do backend
- [Dev API Reference](wiki/Dev-API-Reference.md) - API para desenvolvedores

### 📦 Dependências
- [Dependencies Reference](wiki/Dependencies-Reference.md) - Referência de dependências
- [Dependencies Audit](DEPENDENCIES-AUDIT.md) - Auditoria de dependências
- [AUR Publishing](AUR-PUBLISHING.md) - Publicação no AUR

### 🔐 Segurança
- [Segurança](SECURITY.md) - Guia de segurança
- [CI/CD](CI-CD.md) - Pipeline de CI/CD
- [GitHub Integration](GITHUB-INTEGRATION.md) - Integração com GitHub

---

## 📝 Outros

### 📜 Documentação do Projeto
- [README](README.md) - README principal
- [Changelog](CHANGELOG.md) - Histórico de mudanças
- [Glossário](GLOSSARY.md) - Termos e definições
- [Créditos](CREDITS.md) - Créditos e agradecimentos

### 🔧 Utilitários
- [Auto Sync](AUTO-SYNC.md) - Sincronização automática
- [Plugins](PLUGINS.md) - Sistema de plugins
- [Troubleshooting](TROUBLESHOOTING.md) - Resolução de problemas

### 📊 Análises
- [Análise de Gaps](ANALYSIS-GAPS.md) - Gaps identificados
- [Plano de Implementação 100%](IMPLEMENTATION-PLAN-100.md) - Plano completo
- [Validação do Frontend](FRONTEND-VALIDATION-FINAL.md) - Validação final

### 🏗️ ADRs (Architecture Decision Records)
- [ADR Index](adr/README.md) - Índice de ADRs
- [ADR-0001: Estrutura do Repositório](adr/ADR-0001-repository-structure.md)
- [ADR-0002: Prioridades de Refatoração](adr/ADR-0002-refactoring-priorities.md)

---

## 🎯 Plano de Implementação

### Sprint 1 (Concluído ✅)
- Logger Service
- Testes de Player
- Auth.tsx aprimorado
- Modal System
- Toast System

### Sprint 2 (Em Andamento 🔄)
- Form Components
- Data Table
- YouTube Music API
- Migração de console.log

### Sprint 3 (Planejado 📅)
- Voice Control completo
- WebSocket real-time
- Performance optimization

### Sprint 4 (Planejado 📅)
- Acessibilidade 100%
- i18n completo
- Documentação final

---

## 📊 Métricas Atuais

| Métrica | Valor | Meta | Status |
|---------|-------|------|--------|
| Arquivos | 607 | - | - |
| Linhas de Código | 137,895 | - | - |
| Cobertura de Testes | 25% | 80% | 🔄 |
| Componentes UI | 90% | 100% | 🔄 |
| Documentação | 85% | 100% | 🔄 |
| Acessibilidade | 60% | 100% | 📅 |
| i18n | 60% | 100% | 📅 |
| Performance | 70% | 95% | 📅 |

---

## 🤝 Contribuindo

Quer contribuir com o TSiJUKEBOX? Veja nosso [Guia de Contribuição](CONTRIBUTING.md) e [Guia do Desenvolvedor](DEVELOPER-GUIDE.md).

---

## 📞 Suporte

- **Issues:** [GitHub Issues](https://github.com/B0yZ4kr14/tsijukebox/issues)
- **Discussões:** [GitHub Discussions](https://github.com/B0yZ4kr14/tsijukebox/discussions)
- **Email:** suporte@tsijukebox.com

---

## 📄 Licença

Este projeto está licenciado sob a [MIT License](../LICENSE).

---

**Última atualização:** 24/12/2024  
**Versão da Wiki:** 1.0.0  
**Mantido por:** TSiJUKEBOX Team
