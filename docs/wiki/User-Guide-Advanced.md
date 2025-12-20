# 🚀 Guia de Recursos Avançados

Funcionalidades avançadas do TSiJUKEBOX para usuários experientes.

---

## 🔊 Normalização de Volume

Equaliza o volume entre diferentes músicas para evitar variações bruscas.

### Configurar
1. **Configurações > Áudio > Normalização**
2. Opções:
   - **Desligado**: Volume original
   - **Suave**: Ajuste leve (-6dB)
   - **Normal**: Ajuste padrão (-14dB LUFS)
   - **Forte**: Ajuste agressivo (-11dB)

### Como Funciona
- Analisa loudness de cada faixa
- Aplica ganho para equalizar
- Preserva dinâmica da música

---

## 🎨 Visualizador de Áudio

Efeitos visuais que reagem à música em tempo real.

### Ativar
1. Clique no ícone de ondas nos controles
2. Ou **Configurações > Visual > Visualizador**

### Modos
- **Barras**: Espectro de frequência clássico
- **Ondas**: Forma de onda suave
- **Círculos**: Anéis pulsantes
- **Partículas**: Efeito de partículas

### Personalização
- Cores: Personalize o esquema de cores
- Sensibilidade: Reatividade ao áudio
- Velocidade: Velocidade da animação

---

## 🗣️ Controle por Voz

Controle o TSiJUKEBOX usando comandos de voz.

### Ativar
1. **Configurações > Acessibilidade > Controle por Voz**
2. Permita acesso ao microfone
3. Diga "Hey Jukebox" ou clique no ícone 🎤

### Comandos Disponíveis
| Comando | Ação |
|---------|------|
| "Tocar [música/artista]" | Busca e reproduz |
| "Pausar" | Pausa reprodução |
| "Continuar" | Retoma reprodução |
| "Próxima" | Próxima música |
| "Anterior" | Música anterior |
| "Volume [0-100]" | Ajusta volume |
| "Modo karaoke" | Ativa karaoke |

### Treinamento
Melhore o reconhecimento:
1. **Configurações > Voz > Treinamento**
2. Repita frases solicitadas
3. Sistema aprende seu sotaque

---

## ☁️ Backup na Nuvem

Sincronize configurações e dados com Storj.

### Configurar Storj
1. Crie conta em [storj.io](https://storj.io)
2. Obtenha Access Grant
3. **Configurações > Backup > Storj**
4. Cole o Access Grant

### O que é Salvo
- Configurações do aplicativo
- Playlists locais
- Histórico de reprodução
- Estatísticas

### Restaurar
1. **Configurações > Backup > Restaurar**
2. Selecione backup por data
3. Confirme restauração

---

## 📊 Estatísticas Detalhadas

### Dashboard de Estatísticas
Acesse **Dashboard > Estatísticas** para ver:

- **Top 10 Músicas**: Mais reproduzidas
- **Top Artistas**: Artistas favoritos
- **Gêneros**: Distribuição por gênero
- **Horários**: Picos de uso
- **Provedores**: Spotify vs YouTube vs Local

### Exportar Dados
1. Clique em **Exportar**
2. Escolha formato (CSV, JSON, PDF)
3. Selecione período
4. Baixe arquivo

---

## 🔌 Integrações Avançadas

### Spicetify
Customize o cliente Spotify desktop:
1. Instale Spicetify separadamente
2. **Configurações > Integrações > Spicetify**
3. Ative overlay do TSiJUKEBOX

### Scrobbling (Last.fm)
Registre o que você ouve:
1. Crie conta no Last.fm
2. **Configurações > Integrações > Last.fm**
3. Conecte sua conta

### Webhooks
Receba notificações de eventos:
1. **Configurações > Avançado > Webhooks**
2. Adicione URL de destino
3. Selecione eventos:
   - Música iniciada
   - Música concluída
   - Fila alterada

---

## 🛡️ Controle de Acesso (RBAC)

### Papéis de Usuário

| Papel | Permissões |
|-------|------------|
| Admin | Acesso total, configurações, usuários |
| User | Reproduzir, criar playlists, histórico |
| Newbie | Apenas reproduzir, sem configurações |

### Criar Usuários
1. **Configurações > Usuários > Adicionar**
2. Defina email e senha
3. Atribua papel

### Permissões Personalizadas
Ajuste permissões específicas por usuário:
- Acesso a configurações
- Controle de volume
- Gerenciar fila
- Ver estatísticas

---

## ⌨️ Comandos Personalizados

Crie atalhos para ações frequentes.

### Adicionar Comando
1. **Configurações > Atalhos > Personalizar**
2. Clique em **Novo Comando**
3. Defina:
   - Nome: "Minha Playlist"
   - Ação: Reproduzir playlist X
   - Atalho: Ctrl+1

### Exemplos
- `Ctrl+1`: Playlist "Favoritas"
- `Ctrl+2`: Playlist "Festa"
- `Ctrl+R`: Música aleatória
- `Ctrl+L`: Limpar fila e reproduzir

---

## 🔧 API Local

O TSiJUKEBOX expõe uma API REST local para automação.

### Endpoints
```
GET  /api/now-playing     # Música atual
GET  /api/queue           # Fila de reprodução
POST /api/queue           # Adicionar à fila
POST /api/play            # Play
POST /api/pause           # Pause
POST /api/next            # Próxima
POST /api/volume          # Ajustar volume
```

### Exemplo
```bash
# Obter música atual
curl http://localhost:5173/api/now-playing

# Adicionar música à fila
curl -X POST http://localhost:5173/api/queue \
  -H "Content-Type: application/json" \
  -d '{"trackId": "spotify:track:xxx"}'
```

---

## 🧪 Modo Desenvolvedor

### Ativar
1. **Configurações > Avançado > Modo Desenvolvedor**
2. Digite a senha de desenvolvedor

### Recursos
- Console de debug visível
- Logs detalhados
- Métricas de performance
- Hot reload de temas
- API de testes

---

[← Uso Básico](User-Guide-Basic.md) | [Próximo: Arquivos Locais →](User-Guide-Local-Files.md)
