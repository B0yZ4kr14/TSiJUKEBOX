# Endpoints Necessários no Backend FastAPI

Este documento descreve os endpoints que precisam ser implementados no backend FastAPI para suportar as funcionalidades de shuffle, repeat e queue.

## Endpoints de Controle de Reprodução

### 1. Shuffle

**POST `/api/player/shuffle`**

Ativa ou desativa o modo shuffle usando playerctl.

```bash
# Comando playerctl equivalente:
playerctl --player=spotify shuffle Toggle
# ou
playerctl --player=spotify shuffle On/Off
```

**Request Body:**
```json
{
  "enabled": true
}
```

**Response:**
```json
{
  "success": true
}
```

**Implementação sugerida:**
```python
@app.post("/api/player/shuffle")
async def set_shuffle(data: ShuffleRequest):
    mode = "On" if data.enabled else "Off"
    result = subprocess.run(
        ["playerctl", "--player=spotify", "shuffle", mode],
        capture_output=True, text=True
    )
    return {"success": result.returncode == 0}
```

---

### 2. Repeat

**POST `/api/player/repeat`**

Define o modo de repetição usando playerctl.

```bash
# Comando playerctl equivalente:
playerctl --player=spotify loop None/Track/Playlist
```

**Request Body:**
```json
{
  "mode": "off" | "track" | "context"
}
```

Mapeamento:
- `"off"` → `"None"`
- `"track"` → `"Track"`
- `"context"` → `"Playlist"`

**Response:**
```json
{
  "success": true
}
```

**Implementação sugerida:**
```python
@app.post("/api/player/repeat")
async def set_repeat(data: RepeatRequest):
    mode_map = {"off": "None", "track": "Track", "context": "Playlist"}
    playerctl_mode = mode_map.get(data.mode, "None")
    result = subprocess.run(
        ["playerctl", "--player=spotify", "loop", playerctl_mode],
        capture_output=True, text=True
    )
    return {"success": result.returncode == 0}
```

---

### 3. Obter Fila de Reprodução

**GET `/api/player/queue`**

Retorna a fila de reprodução atual. 

**Nota:** O playerctl não tem suporte nativo para queue. Esta funcionalidade pode ser implementada usando a Spotify Web API (se autenticado) ou mantendo um estado local no backend.

**Response:**
```json
{
  "current": {
    "id": "spotify:track:xxx",
    "title": "Song Name",
    "artist": "Artist Name",
    "album": "Album Name",
    "cover": "https://...",
    "duration": 210000,
    "uri": "spotify:track:xxx"
  },
  "next": [
    {
      "id": "spotify:track:yyy",
      "title": "Next Song",
      "artist": "Next Artist",
      "album": "Next Album",
      "cover": "https://...",
      "duration": 180000,
      "uri": "spotify:track:yyy"
    }
  ],
  "history": [
    {
      "id": "spotify:track:zzz",
      "title": "Previous Song",
      "artist": "Previous Artist",
      "album": "Previous Album",
      "cover": "https://...",
      "duration": 190000,
      "uri": "spotify:track:zzz"
    }
  ]
}
```

---

### 4. Adicionar à Fila

**POST `/api/player/queue`**

Adiciona uma faixa à fila de reprodução.

**Nota:** Requer Spotify Premium e uso da Spotify Web API.

**Request Body:**
```json
{
  "uri": "spotify:track:xxx"
}
```

**Response:**
```json
{
  "success": true
}
```

**Implementação usando Spotify Web API:**
```python
@app.post("/api/player/queue")
async def add_to_queue(data: AddToQueueRequest):
    # Requer token OAuth do Spotify
    response = requests.post(
        f"https://api.spotify.com/v1/me/player/queue?uri={data.uri}",
        headers={"Authorization": f"Bearer {spotify_token}"}
    )
    return {"success": response.status_code == 204}
```

---

### 5. Remover da Fila

**DELETE `/api/player/queue/{id}`**

Remove uma faixa específica da fila.

**Nota:** A API do Spotify não suporta remoção direta da fila. Esta funcionalidade pode ser implementada mantendo um estado local no backend.

**Response:**
```json
{
  "success": true
}
```

---

### 6. Limpar Fila

**DELETE `/api/player/queue`**

Limpa toda a fila de reprodução.

**Response:**
```json
{
  "success": true
}
```

---

## Atualização do Status do Sistema

O endpoint `/api/status` deve incluir os novos campos:

```json
{
  "cpu": 45,
  "memory": 62,
  "temp": 55,
  "playing": true,
  "volume": 75,
  "muted": false,
  "shuffle": true,
  "repeat": "off",
  "track": {
    "title": "Song Name",
    "artist": "Artist",
    "album": "Album",
    "cover": "https://...",
    "duration": 210,
    "position": 45
  }
}
```

Para obter o estado de shuffle e repeat:
```bash
playerctl --player=spotify shuffle
# Retorna: On ou Off

playerctl --player=spotify loop
# Retorna: None, Track ou Playlist
```

---

## Resumo de Comandos playerctl

| Funcionalidade | Comando |
|---------------|---------|
| Shuffle On | `playerctl --player=spotify shuffle On` |
| Shuffle Off | `playerctl --player=spotify shuffle Off` |
| Shuffle Toggle | `playerctl --player=spotify shuffle Toggle` |
| Loop Off | `playerctl --player=spotify loop None` |
| Loop Track | `playerctl --player=spotify loop Track` |
| Loop Playlist | `playerctl --player=spotify loop Playlist` |
| Get Shuffle Status | `playerctl --player=spotify shuffle` |
| Get Loop Status | `playerctl --player=spotify loop` |

---

## Schemas Pydantic Sugeridos

```python
from pydantic import BaseModel
from typing import Optional, Literal

class ShuffleRequest(BaseModel):
    enabled: bool

class RepeatRequest(BaseModel):
    mode: Literal["off", "track", "context"]

class AddToQueueRequest(BaseModel):
    uri: str

class QueueItem(BaseModel):
    id: str
    title: str
    artist: str
    album: str
    cover: Optional[str]
    duration: int
    uri: Optional[str]

class PlaybackQueue(BaseModel):
    current: Optional[QueueItem]
    next: list[QueueItem]
    history: list[QueueItem]
```
