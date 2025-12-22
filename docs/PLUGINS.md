# 🔌 TSiJUKEBOX - Sistema de Plugins

<p align="center">
  <img src="../public/logo/tsijukebox-logo.svg" alt="TSiJUKEBOX Logo" width="120">
</p>

<p align="center">
  <strong>Extensões Modulares para TSiJUKEBOX</strong>
  <br>
  Versão 4.1.0 | Dezembro 2024
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Plugins-4+-green?style=flat-square" alt="Plugins">
  <img src="https://img.shields.io/badge/Python-3.11+-3776ab?style=flat-square" alt="Python">
  <img src="https://img.shields.io/badge/Hot_Reload-✓-blue?style=flat-square" alt="Hot Reload">
</p>

---

## 📑 Índice

- [Visão Geral](#-visão-geral)
- [Plugins Disponíveis](#-plugins-disponíveis)
- [Instalação de Plugins](#-instalação-de-plugins)
- [Criando Plugins Customizados](#-criando-plugins-customizados)
- [API de Plugins](#-api-de-plugins)
- [Configuração](#-configuração)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Visão Geral

O sistema de plugins do TSiJUKEBOX permite extensões modulares que adicionam funcionalidades sem modificar o núcleo do sistema.

### Características

| Feature | Descrição |
|---------|------------|
| **Modular** | Plugins são independentes e isolados |
| **Hot Reload** | Atualização sem reiniciar o serviço |
| **Versionado** | Compatibilidade por versão semântica |
| **Seguro** | Sandbox para execução de plugins |
| **Documentado** | API bem definida e tipada |

### Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                    TSiJUKEBOX Core                      │
├─────────────────────────────────────────────────────────┤
│                    Plugin Manager                        │
├──────────┬──────────┬──────────┬──────────┬─────────────┤
│ youtube  │ spotify  │ discord  │ lyrics   │  custom...  │
│ -dl      │ -dl      │ -rpc     │ -fetch   │             │
└──────────┴──────────┴──────────┴──────────┴─────────────┘
```

---

## 📦 Plugins Disponíveis

### 1. youtube-music-dl

Download de músicas do YouTube Music via yt-dlp.

| Propriedade | Valor |
|-------------|-------|
| **ID** | `youtube-music-dl` |
| **Versão** | 1.0.0 |
| **Dependências** | yt-dlp, ffmpeg |
| **Tamanho** | ~50MB |

**Instalação:**
```bash
sudo python3 install.py --plugin youtube-music-dl
```

**Funcionalidades:**
- Download de faixas individuais
- Download de playlists completas
- Conversão automática para MP3/FLAC/OPUS
- Metadados e artwork embutidos
- Integração com biblioteca local

---

### 2. spotify-downloader

Download de músicas do Spotify via spotdl.

| Propriedade | Valor |
|-------------|-------|
| **ID** | `spotify-downloader` |
| **Versão** | 1.0.0 |
| **Dependências** | spotdl, ffmpeg |
| **Tamanho** | ~30MB |

**Instalação:**
```bash
sudo python3 install.py --plugin spotify-downloader
```

---

### 3. discord-integration

Integração com Discord: Rich Presence e Webhooks.

| Propriedade | Valor |
|-------------|-------|
| **ID** | `discord-integration` |
| **Versão** | 1.0.0 |
| **Dependências** | pypresence |
| **Tamanho** | ~5MB |

---

### 4. lyrics-fetcher

Busca de letras de múltiplas fontes.

| Propriedade | Valor |
|-------------|-------|
| **ID** | `lyrics-fetcher` |
| **Versão** | 1.0.0 |
| **Fontes** | Genius, Musixmatch, AZLyrics |

---

## 🔧 Instalação de Plugins

```bash
# Listar plugins disponíveis
python3 install.py --list-plugins

# Instalar plugin específico
sudo python3 install.py --plugin PLUGIN_NAME

# Instalar todos os plugins
sudo python3 install.py --all-plugins
```

---

## 🛠️ Criando Plugins Customizados

### Estrutura de Diretórios

```
plugins/
└── my-plugin/
    ├── __init__.py       # Entry point
    ├── plugin.json       # Manifest
    ├── requirements.txt  # Dependências Python
    └── src/
        └── main.py       # Lógica principal
```

### Manifest (plugin.json)

```json
{
  "id": "my-plugin",
  "name": "My Custom Plugin",
  "version": "1.0.0",
  "description": "Descrição do plugin",
  "author": "Seu Nome",
  "tsijukebox": {
    "minVersion": "4.0.0"
  },
  "hooks": ["on_track_change", "on_playback_start"]
}
```

### Implementação (__init__.py)

```python
from tsijukebox.plugins import PluginBase, hook

class MyPlugin(PluginBase):
    def on_load(self):
        self.logger.info("MyPlugin carregado!")
    
    @hook("on_track_change")
    def handle_track_change(self, track: dict):
        self.logger.info(f"Nova faixa: {track['title']}")

__plugin__ = MyPlugin
```

---

## 📖 API de Plugins

### Hooks Disponíveis

| Hook | Parâmetros | Descrição |
|------|------------|------------|
| `on_track_change` | `track: dict` | Faixa mudou |
| `on_playback_start` | `track: dict` | Reprodução iniciou |
| `on_playback_pause` | `track: dict` | Reprodução pausada |
| `on_volume_change` | `volume: int` | Volume alterado |
| `on_queue_update` | `queue: list` | Fila atualizada |

---

## ⚙️ Configuração

Plugins são configurados em `~/.config/tsijukebox/plugins.json`:

```json
{
  "enabled": ["youtube-music-dl", "discord-integration"],
  "settings": {
    "youtube-music-dl": {
      "output_format": "mp3",
      "quality": "320k"
    }
  }
}
```

---

<p align="center">
  <strong>TSiJUKEBOX Plugins</strong> — <em>Estenda suas possibilidades</em> 🔌
</p>