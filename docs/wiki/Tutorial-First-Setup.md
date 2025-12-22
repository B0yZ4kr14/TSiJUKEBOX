# 🚀 Tutorial: Primeira Configuração

Este tutorial guia você pela configuração inicial do TSiJUKEBOX, desde a instalação até a primeira reprodução de música.

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter:

- [ ] Sistema operacional Linux (recomendado: CachyOS/Arch) ou Windows/macOS
- [ ] Docker e Docker Compose instalados (ou serão instalados automaticamente)
- [ ] Git instalado
- [ ] Navegador moderno (Chrome 90+ recomendado)
- [ ] Conta Spotify Premium (opcional, para integração Spotify)
- [ ] Conta YouTube Music (opcional)

---

## 🔧 Instalação

### Método 1: Docker Installer (Recomendado)

O método mais rápido e confiável para instalar o TSiJUKEBOX:

```bash
# Instalação rápida com um comando
curl -fsSL https://raw.githubusercontent.com/B0yZ4kr14/TSiJUKEBOX/main/scripts/docker-install.py | sudo python3
```

#### Instalação com Opções

```bash
# Clone o repositório primeiro
git clone https://github.com/B0yZ4kr14/TSiJUKEBOX.git
cd TSiJUKEBOX

# Instalação básica
sudo python3 scripts/docker-install.py

# Com SSL Let's Encrypt (produção)
sudo python3 scripts/docker-install.py \
  --ssl-letsencrypt \
  --domain meusite.com \
  --ssl-email admin@meusite.com

# Com SSL via Cloudflare DNS (servidor atrás de firewall)
sudo python3 scripts/docker-install.py \
  --ssl-cloudflare \
  --domain meusite.com \
  --ssl-email admin@meusite.com \
  --cloudflare-token "seu-api-token"

# Com monitoring (Grafana + Prometheus)
sudo python3 scripts/docker-install.py --monitoring

# Instalação completa (SSL + Monitoring + Cache)
sudo python3 scripts/docker-install.py \
  --ssl-letsencrypt \
  --domain meusite.com \
  --ssl-email admin@meusite.com \
  --monitoring \
  --cache
```

### Opções de Linha de Comando

| Flag | Descrição | Exemplo |
|------|-----------|---------|
| `--port`, `-p` | Porta HTTP (padrão: 80) | `--port 8080` |
| `--monitoring`, `-m` | Ativar Prometheus + Grafana | `--monitoring` |
| `--cache` | Ativar Redis cache | `--cache` |
| **SSL/HTTPS** | | |
| `--ssl` | SSL auto-assinado (desenvolvimento) | `--ssl` |
| `--ssl-letsencrypt` | SSL com Let's Encrypt (produção) | `--ssl-letsencrypt` |
| `--ssl-cloudflare` | SSL via Cloudflare DNS challenge | `--ssl-cloudflare` |
| `--domain` | Domínio para certificado SSL | `--domain meusite.com` |
| `--ssl-email` | Email para Let's Encrypt | `--ssl-email admin@site.com` |
| `--ssl-staging` | Usar Let's Encrypt staging (testes) | `--ssl-staging` |
| `--ssl-wildcard` | Certificado wildcard (*.domain.com) | `--ssl-wildcard` |
| `--cloudflare-token` | API Token do Cloudflare | `--cloudflare-token ABC123` |
| **Operações** | | |
| `--update` | Atualizar para versão mais recente | `--update` |
| `--uninstall` | Desinstalar TSiJUKEBOX | `--uninstall` |
| `--status` | Ver status da instalação | `--status` |
| `--dry-run` | Simular sem executar | `--dry-run` |
| `--verbose`, `-v` | Output detalhado | `--verbose` |

---

## 🔐 Instalação com SSL/HTTPS

O TSiJUKEBOX suporta três métodos de SSL:

### 1. Let's Encrypt (HTTP-01 Challenge)

Ideal para servidores com porta 80 pública:

```bash
sudo python3 scripts/docker-install.py \
  --ssl-letsencrypt \
  --domain meusite.com \
  --ssl-email admin@meusite.com
```

**Requisitos:**
- Porta 80 acessível da internet
- Domínio apontando para o servidor
- Email válido para notificações

### 2. Cloudflare DNS Challenge

Ideal para servidores atrás de firewall/NAT ou para certificados wildcard:

```bash
# Certificado único
sudo python3 scripts/docker-install.py \
  --ssl-cloudflare \
  --domain meusite.com \
  --ssl-email admin@meusite.com \
  --cloudflare-token "seu-api-token"

# Certificado wildcard (*.meusite.com)
sudo python3 scripts/docker-install.py \
  --ssl-cloudflare \
  --ssl-wildcard \
  --domain meusite.com \
  --ssl-email admin@meusite.com \
  --cloudflare-token "seu-api-token"
```

**Como obter o Cloudflare API Token:**
1. Acesse [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. Clique em "Create Token"
3. Use o template "Edit zone DNS"
4. Selecione sua zona/domínio
5. Copie o token gerado

**Requisitos:**
- Domínio gerenciado pelo Cloudflare
- API Token com permissão `Zone:DNS:Edit`
- **Não requer** porta 80 pública

### 3. Certificado Auto-assinado (Desenvolvimento)

Para desenvolvimento local:

```bash
sudo python3 scripts/docker-install.py \
  --ssl \
  --domain localhost
```

⚠️ Navegadores mostrarão aviso de certificado não confiável.

---

## 🐳 Docker Compose Profiles

O instalador usa Docker Compose profiles para ativar serviços opcionais:

### Profiles Disponíveis

| Profile | Serviços | Ativação |
|---------|----------|----------|
| `ssl` | Nginx (HTTPS auto-assinado) | `--ssl` |
| `ssl-letsencrypt` | Nginx + Certbot | `--ssl-letsencrypt` |
| `ssl-cloudflare` | Nginx + Certbot DNS | `--ssl-cloudflare` |
| `monitoring` | Prometheus + Grafana | `--monitoring` |
| `cache` | Redis | `--cache` |

### Comandos Manuais

```bash
cd /opt/tsijukebox/docker

# Iniciar apenas app
docker compose up -d

# Iniciar com SSL
docker compose --profile ssl up -d

# Iniciar com SSL Let's Encrypt
docker compose --profile ssl-letsencrypt up -d

# Iniciar com monitoring
docker compose --profile monitoring up -d

# Iniciar com múltiplos profiles
docker compose --profile ssl-letsencrypt --profile monitoring --profile cache up -d
```

---

## 🔄 Renovação Automática de Certificados

Para certificados Let's Encrypt, a renovação é automática via systemd timer:

```bash
# Verificar status do timer
systemctl status tsijukebox-certbot.timer

# Forçar renovação manual
systemctl start tsijukebox-certbot.service

# Ver próxima renovação agendada
systemctl list-timers | grep certbot
```

---

## 📊 Acessando Serviços

Após instalação:

| Serviço | URL | Credenciais |
|---------|-----|-------------|
| TSiJUKEBOX | http://localhost ou https://seudominio.com | - |
| Grafana | http://localhost:3001 | admin / tsijukebox |
| Prometheus | http://localhost:9090 | - |

---

## ⚙️ Configuração Inicial

### Passo 1: Assistente de Setup

Ao acessar o TSiJUKEBOX pela primeira vez, você será direcionado ao **Setup Wizard**:

1. **Idioma**: Selecione português (BR), inglês ou espanhol
2. **Tema**: Escolha entre tema claro ou escuro
3. **Modo de Operação**: Selecione Kiosk, Desktop ou Admin
4. **Autenticação**: Configure usuários e permissões

### Passo 2: Conectar Provedores de Música

#### Spotify
1. Acesse **Configurações > Integrações > Spotify**
2. Clique em **Conectar ao Spotify**
3. Autorize o acesso na janela do Spotify
4. Aguarde a confirmação

#### YouTube Music
1. Acesse **Configurações > Integrações > YouTube Music**
2. Siga o processo de autenticação
3. Configure preferências de qualidade

#### Arquivos Locais
1. Acesse **Configurações > Biblioteca > Música Local**
2. Adicione pastas com seus arquivos de música
3. Aguarde a indexação

---

## 🎵 Primeira Reprodução

Após a configuração:

1. Retorne à tela principal (`/`)
2. Navegue pela biblioteca ou use a busca
3. Clique em uma música para adicionar à fila
4. Use os controles de reprodução no painel inferior

---

## 🔧 Gerenciamento

### Verificar Status

```bash
sudo python3 scripts/docker-install.py --status
```

### Atualizar

```bash
sudo python3 scripts/docker-install.py --update
```

### Ver Logs

```bash
# Logs do app
docker logs tsijukebox-app -f

# Logs do Nginx (se usando SSL)
docker logs tsijukebox-nginx -f

# Logs do Certbot
docker logs tsijukebox-certbot -f
```

### Reiniciar Serviços

```bash
cd /opt/tsijukebox/docker
docker compose restart
```

### Desinstalar

```bash
sudo python3 scripts/docker-install.py --uninstall
```

---

## 🔍 Próximos Passos

- [Integração Spotify Detalhada](Tutorial-Spotify-Integration.md)
- [Configurar Modo Kiosk](Tutorial-Kiosk-Mode.md)
- [Personalizar Temas](Config-Themes.md)
- [Guia de Uso Básico](User-Guide-Basic.md)

---

## ❓ Problemas Comuns

### Erro de conexão com Spotify
- Verifique se sua conta é Premium
- Limpe o cache do navegador
- Reconecte a integração

### Certificado SSL não funciona
- Verifique se o domínio aponta para o servidor
- Confirme que a porta 80 está aberta (para HTTP-01)
- Para Cloudflare DNS, verifique o API Token
- Teste com `--ssl-staging` primeiro

### Música não reproduz
- Verifique as permissões de áudio do navegador
- Confirme que o dispositivo de saída está configurado
- Teste com outro provedor de música

### Tela em branco
- Limpe o cache (Ctrl+Shift+R)
- Verifique o console (F12) para erros
- Consulte o [Troubleshooting](../TROUBLESHOOTING.md)

### Container não inicia
```bash
# Ver logs detalhados
docker logs tsijukebox-app

# Verificar recursos
docker stats

# Reiniciar Docker
sudo systemctl restart docker
```

---

[← Voltar ao Home](Home.md) | [Próximo: Integração Spotify →](Tutorial-Spotify-Integration.md)
