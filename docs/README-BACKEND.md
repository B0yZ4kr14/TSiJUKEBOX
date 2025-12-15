# TSi JUKEBOX ENTERPRISE v4.0
## Sistema Kiosk Musical para CachyOS + Openbox

---

### ⚠️ AVISO CRÍTICO
Este sistema usa **OPENBOX** como window manager, **NÃO** Fluxbox.

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Requisitos](#requisitos)
4. [Instalação](#instalação)
5. [Configuração](#configuração)
6. [Endpoints da API](#endpoints-da-api)
7. [Monitoramento](#monitoramento)
8. [Segurança](#segurança)
9. [Manutenção](#manutenção)
10. [Troubleshooting](#troubleshooting)

---

## 🎵 Visão Geral

Sistema kiosk completo para reprodução musical via Spotify, com:

- **Backend:** FastAPI (Python 3.11+)
- **Frontend:** React + Vite (pré-compilado)
- **Window Manager:** Openbox
- **Player:** Spotify (via spotify-launcher)
- **Monitoramento:** Prometheus + Grafana
- **Proxy Reverso:** Nginx com SSL

---

## 🏗️ Arquitetura

```
tsi_jukebox_production/
├── core/                          # Núcleo do sistema
│   ├── config.py                  # Configuração centralizada (SRP)
│   ├── logging_service.py         # Logging estruturado
│   └── executor.py                # Wrapper para subprocess
├── modules/                       # Módulos funcionais
│   ├── kiosk/
│   │   └── kiosk_manager.py       # Openbox + Spotify + Watchdog
│   ├── security/
│   │   └── security_manager.py    # Firewall, SSL, hardening
│   └── monitoring/
│       └── monitoring_manager.py  # Prometheus + Grafana
├── server/                        # Backend FastAPI
│   ├── main.py                    # API principal
│   └── app/
│       ├── models/                # SQLAlchemy + Pydantic
│       ├── services/              # Player, Logger
│       └── database/              # SQLite
├── config/                        # Arquivos de configuração
│   ├── nginx/
│   ├── prometheus/
│   ├── grafana/
│   └── openbox/
├── assets/                        # Imagens e recursos
└── install.py                     # Instalador unificado
```

### Grafo de Dependências (DAG)

```
                    ┌─────────────────┐
                    │    install.py   │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   core/config   │ │  core/logging   │ │  core/executor  │
└────────┬────────┘ └────────┬────────┘ └────────┬────────┘
         │                   │                   │
         └───────────────────┼───────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  modules/kiosk  │ │modules/security │ │modules/monitor  │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

---

## 📦 Requisitos

### Hardware Mínimo
- CPU: Dual-core 2.0 GHz
- RAM: 4 GB
- Storage: 32 GB SSD
- Display: 1920x1080
- Rede: Ethernet ou WiFi estável

### Software
- CachyOS (ou Arch Linux)
- Python 3.11+
- Conta Spotify Premium

### Pacotes Necessários (instalados automaticamente)

```bash
# Base
base-devel git wget curl unzip

# Desktop (Openbox)
xorg-server xorg-xinit openbox obconf
xfce4-terminal chromium feh

# Áudio
pulseaudio pulseaudio-alsa playerctl
spotify-launcher

# Backend
python python-pip python-virtualenv

# Monitoramento
nginx prometheus grafana

# Segurança
ufw openssl

# Fontes
ttf-dejavu noto-fonts
```

---

## 🚀 Instalação

### 1. Preparação

```bash
# Clone ou extraia o pacote
unzip TSi_JUKEBOX_PRODUCTION.zip
cd tsi_jukebox_production

# Dê permissão de execução
chmod +x install.py
```

### 2. Executar Instalador

```bash
sudo python3 install.py
```

### 3. Menu de Opções

```
╔════════════════════════════════════════════════════════════════════╗
║              TSi JUKEBOX ENTERPRISE v4.0 - INSTALLER               ║
╚════════════════════════════════════════════════════════════════════╝

[1] Instalação Completa
[2] Apenas Pacotes
[3] Configurar Kiosk (Openbox)
[4] Configurar Segurança
[5] Configurar Monitoramento
[6] Auditoria do Sistema
[7] Health Check
[8] Sair

Escolha uma opção (1-8):
```

### 4. Instalação Completa (Recomendado)

Selecione a opção `[1]` para:
1. Instalar pacotes necessários
2. Criar usuário `tsi`
3. Configurar Openbox
4. Instalar Spotify Watchdog
5. Configurar autologin
6. Configurar Nginx + SSL
7. Configurar Prometheus + Grafana
8. Configurar firewall

### 5. Reiniciar Sistema

```bash
sudo systemctl reboot
```

---

## ⚙️ Configuração

### Variáveis de Ambiente

```bash
# /etc/environment
TSI_USER_PASSWORD=connect     # Senha do usuário kiosk (altere em produção!)
TSI_API_SECRET=your-secret    # Segredo para tokens JWT (se usado)
```

### Arquivos Principais

| Arquivo | Localização | Descrição |
|---------|-------------|-----------|
| rc.xml | ~/.config/openbox/ | Configuração do Openbox |
| autostart | ~/.config/openbox/ | Script de inicialização |
| jukebox.conf | /etc/nginx/conf.d/ | Configuração do Nginx |
| prometheus.yml | /etc/prometheus/ | Scraping de métricas |

### Atalhos de Teclado (Openbox)

| Tecla | Ação |
|-------|------|
| F1 | Reiniciar Spotify |
| F2 | Abrir Terminal |
| F3 | Abrir Chromium (Frontend) |
| F4 | Reboot do Sistema |
| Ctrl+Alt+Del | Desligar |

---

## 🔌 Endpoints da API

Base URL: `https://midiaserver.local/api`

### Status do Sistema

```
GET /api/status

Response:
{
    "cpu": 25.5,
    "memory": 42.3,
    "temp": 55.0,
    "playing": true,
    "volume": 75,
    "muted": false,
    "track": {
        "title": "Song Name",
        "artist": "Artist Name",
        "album": "Album Name",
        "cover": "https://..."
    }
}
```

### Controle de Playback

```
POST /api/play
Body: {"action": "play|pause|next|prev"}

Response:
{
    "status": "ok",
    "action": "play",
    "playing": true
}
```

### Controle de Volume

```
POST /api/volume
Body: {"level": 75, "mute": false}

Response:
{
    "volume": 75,
    "muted": false
}
```

### Health Check

```
GET /api/health

Response:
{
    "status": "healthy",
    "service": "tsi-jukebox-api",
    "version": "4.0.0",
    "timestamp": "2024-01-15T10:30:00Z"
}
```

### Métricas Prometheus

```
GET /api/metrics

Response (text/plain):
# HELP tsi_api_cpu_percent CPU usage percentage
# TYPE tsi_api_cpu_percent gauge
tsi_api_cpu_percent 25.5
...
```

---

## 📊 Monitoramento

### Acessos

| Serviço | URL | Descrição |
|---------|-----|-----------|
| Frontend | https://midiaserver.local/jukebox | Interface do Jukebox |
| Grafana | https://midiaserver.local/grafana | Dashboards |
| Prometheus | https://midiaserver.local/prometheus | Métricas brutas |

### Grafana - Login Inicial

- **Usuário:** admin
- **Senha:** admin (altere após primeiro login)

### Dashboards Disponíveis

1. **System Overview** - CPU, Memória, Disco
2. **API Metrics** - Requisições, Latência, Erros
3. **Player Status** - Reprodução, Volume, Histórico

---

## 🔒 Segurança

### Firewall (UFW)

```bash
# Status
sudo ufw status verbose

# Regras aplicadas
- SSH (22): Permitido
- HTTP (80): Permitido (redireciona para HTTPS)
- HTTPS (443): Permitido
- Prometheus (9090): Apenas local
- Grafana (3000): Apenas local
```

### SSL/TLS

Certificados autoassinados em `/etc/nginx/ssl/`:
- `midiaserver.crt` - Certificado
- `midiaserver.key` - Chave privada

**Para produção:** Substitua por certificados Let's Encrypt ou CA válida.

### Hardening Aplicado

- CORS restritivo (origens específicas)
- Rate limiting no Nginx
- Headers de segurança (X-Frame-Options, CSP)
- Sudoers restritivo (apenas comandos necessários)
- sysctl: IP forwarding desabilitado, SYN cookies habilitados

---

## 🔧 Manutenção

### Logs

```bash
# Instalação
/var/log/tsi-kiosk/installation_*.log

# Backend
/var/log/tsi-kiosk/backend.log

# Watchdog
/var/log/tsi-kiosk/spotify-watchdog.log

# Nginx
/var/log/nginx/jukebox_*.log

# Ver em tempo real
tail -f /var/log/tsi-kiosk/*.log
```

### Serviços

```bash
# Status
systemctl status tsi-spotify-watchdog nginx prometheus grafana-server

# Reiniciar Spotify
/usr/local/bin/tsi-restart-spotify

# Reiniciar Backend
systemctl restart tsi-jukebox-backend
```

### Backup

```bash
# Localizações importantes para backup
/var/lib/tsi-kiosk/jukebox.db      # Banco de dados
/home/tsi/.config/openbox/         # Configuração Openbox
/etc/nginx/conf.d/                 # Configuração Nginx
/etc/prometheus/                   # Configuração Prometheus
```

---

## ❓ Troubleshooting

### Spotify não abre

```bash
# Verificar watchdog
systemctl status tsi-spotify-watchdog

# Logs do watchdog
journalctl -u tsi-spotify-watchdog -f

# Reiniciar manualmente
/usr/local/bin/tsi-restart-spotify
```

### API não responde

```bash
# Verificar se está rodando
curl http://localhost:8000/api/health

# Verificar logs
tail -f /var/log/tsi-kiosk/backend.log

# Reiniciar
cd /home/tsi/jukebox-control-panel/server
./venv/bin/python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

### Frontend não carrega

```bash
# Verificar Nginx
systemctl status nginx
nginx -t  # Testar configuração

# Verificar certificados SSL
ls -la /etc/nginx/ssl/

# Regenerar certificados se necessário
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/midiaserver.key \
    -out /etc/nginx/ssl/midiaserver.crt \
    -subj "/CN=midiaserver.local"
```

### Sem áudio

```bash
# Verificar PulseAudio
pulseaudio --check && echo "OK" || echo "FAILED"

# Reiniciar PulseAudio
pulseaudio -k
pulseaudio --start

# Verificar dispositivos
pactl list sinks short
```

---

## 📝 Changelog

### v4.0.0 (Produção)
- Migração completa para Openbox (de Fluxbox)
- CORS restritivo (substituiu `allow_origins=["*"]`)
- Schema `TrackInfo` separado de `Track`
- Instalador unificado modular
- Segurança: firewall + SSL + hardening
- Monitoramento: Prometheus + Grafana integrados

---

## 📄 Licença

Proprietário - TSi Jukebox Enterprise

---

**Desenvolvido para CachyOS + Openbox + Spotify**
