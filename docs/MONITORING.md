# 📊 TSiJUKEBOX - Sistema de Monitoramento

<p align="center">
  <img src="../public/logo/tsijukebox-logo.svg" alt="TSiJUKEBOX Logo" width="120">
</p>

<p align="center">
  <strong>Monitoramento em Tempo Real do Sistema</strong>
  <br>
  Versão 4.1.0 | Dezembro 2024
</p>

<p align="center">
  <img src="https://img.shields.io/badge/WebSocket-Real--Time-green?style=flat-square" alt="WebSocket">
  <img src="https://img.shields.io/badge/Alertas-Telegram%20|%20Email%20|%20Discord-blue?style=flat-square" alt="Alertas">
  <img src="https://img.shields.io/badge/Nagios-Compatible-red?style=flat-square" alt="Nagios">
</p>

---

## 📑 Índice

- [Visão Geral](#-visão-geral)
- [HealthCheck CLI](#-healthcheck-cli)
- [Timer Systemd](#-timer-systemd)
- [Health Dashboard](#-health-dashboard)
- [Sistema de Alertas](#-sistema-de-alertas)

---

## 🎯 Visão Geral

O TSiJUKEBOX oferece um sistema completo de monitoramento com múltiplas camadas:

| Camada | Ferramenta | Descrição |
|--------|------------|------------|
| **CLI** | HealthCheck | Verificação rápida para scripts |
| **Timer** | Systemd | Monitoramento automático |
| **Web** | Dashboard | Interface visual em tempo real |
| **API** | WebSocket | Streaming de métricas |
| **Alertas** | Multi-channel | Telegram, Email, Discord |

---

## 🔍 HealthCheck CLI

### Verificação Rápida

```bash
# Verificação básica
python3 install.py --health-check

# Com alertas em caso de falha
python3 install.py --health-check --alert-on-failure

# Especificar canais de alerta
python3 install.py --health-check --alert-on-failure --alert-channels telegram,email
```

### Códigos de Saída

| Código | Status | Descrição |
|--------|--------|------------|
| `0` | ✅ OK | Todos os serviços operacionais |
| `1` | ⚠️ WARNING | Alguns serviços degradados |
| `2` | 🔴 CRITICAL | Serviços críticos falhando |
| `3` | ❓ UNKNOWN | Não foi possível verificar |

---

## ⏱️ Timer Systemd

### Instalação do Timer

```bash
# Instalar timer com configurações padrão (5 minutos)
sudo python3 install.py --install-timer

# Instalar com canais de alerta
sudo python3 install.py --install-timer --alert-channels telegram,email
```

### Gerenciamento

```bash
# Status do timer
systemctl status tsijukebox-health.timer

# Ver logs
journalctl -u tsijukebox-health.service -f

# Desabilitar timer
sudo systemctl disable --now tsijukebox-health.timer
```

---

## 🖥️ Health Dashboard

### Acessando o Dashboard

O Health Dashboard está disponível em `/health` na interface web.

### Funcionalidades

| Feature | Descrição |
|---------|-----------|
| **Service Cards** | Status visual de cada serviço |
| **Metric Gauges** | Gauges circulares para CPU/RAM/Disco |
| **History Chart** | Gráfico de área com histórico |
| **Alerts Timeline** | Timeline de alertas recentes |
| **Connection Status** | Indicador de conexão WebSocket |

### Hook React

```typescript
import { useHealthMonitorWebSocket } from '@/hooks/system/useHealthMonitorWebSocket';

function HealthWidget() {
  const { data, isConnected, error, reconnect } = useHealthMonitorWebSocket();
  
  if (!isConnected) {
    return <ReconnectButton onClick={reconnect} />;
  }
  
  return (
    <div>
      <MetricGauge label="CPU" value={data?.metrics.cpuPercent} />
      <MetricGauge label="RAM" value={data?.metrics.memoryPercent} />
    </div>
  );
}
```

---

## 🔔 Sistema de Alertas

### Canais Suportados

| Canal | Configuração | Descrição |
|-------|--------------|-----------|
| **Telegram** | Bot Token + Chat ID | Mensagens instantâneas |
| **Email** | SMTP Config | Emails de alerta |
| **Discord** | Webhook URL | Mensagens em canal |
| **Database** | Automático | Registro em `notifications` |

### Configuração

```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "bot_token": "123456:ABC-DEF...",
      "chat_id": "-1001234567890"
    },
    "email": {
      "enabled": true,
      "smtp_host": "smtp.gmail.com",
      "recipients": ["admin@example.com"]
    },
    "discord": {
      "enabled": true,
      "webhook_url": "https://discord.com/api/webhooks/..."
    }
  },
  "thresholds": {
    "cpu_warning": 70,
    "cpu_critical": 90,
    "memory_warning": 80,
    "memory_critical": 95
  }
}
```

---

## ⚡ Edge Function: health-monitor-ws

**URL:** `wss://<project-id>.supabase.co/functions/v1/health-monitor-ws`

**Payload (a cada 30s):**

```json
{
  "timestamp": "2024-12-22T14:30:00.000Z",
  "services": {
    "tsijukebox": "active",
    "grafana": "active",
    "prometheus": "active"
  },
  "metrics": {
    "cpuPercent": 23,
    "memoryPercent": 58,
    "diskFreeGb": 45.2,
    "diskTotalGb": 100
  },
  "alerts": []
}
```

---

<p align="center">
  <strong>TSiJUKEBOX Monitoring</strong> — <em>Sempre em observação</em> 📊
</p>