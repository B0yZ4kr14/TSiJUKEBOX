# 📁 Guia: Arquivos de Música Locais

Configure e gerencie sua biblioteca de músicas locais no TSiJUKEBOX.

---

## 📋 Formatos Suportados

| Formato | Extensão | Qualidade | Metadados |
|---------|----------|-----------|-----------|
| MP3 | .mp3 | Lossy | ID3v2 |
| FLAC | .flac | Lossless | Vorbis |
| AAC | .m4a, .aac | Lossy | iTunes |
| OGG Vorbis | .ogg | Lossy | Vorbis |
| WAV | .wav | Lossless | BWF |
| ALAC | .m4a | Lossless | iTunes |

---

## 📂 Configurando Pastas de Música

### Adicionar Pasta

1. **Configurações > Biblioteca > Música Local**
2. Clique em **Adicionar Pasta**
3. Navegue até a pasta desejada
4. Confirme

### Pastas Padrão
- `/home/usuario/Music`
- `/media/musicas`
- Dispositivos USB montados

### Monitoramento
O TSiJUKEBOX monitora pastas automaticamente:
- Novas músicas são indexadas
- Músicas removidas são atualizadas
- Alterações de metadados detectadas

---

## 🔍 Indexação

### Processo
1. Escaneia arquivos nas pastas configuradas
2. Extrai metadados (título, artista, álbum, etc.)
3. Extrai capa do álbum (se embarcada)
4. Cria índice para busca rápida

### Status
Veja o progresso em **Configurações > Biblioteca**:
- Total de músicas
- Última atualização
- Erros de indexação

### Forçar Re-indexação
1. **Configurações > Biblioteca > Avançado**
2. Clique em **Reconstruir Índice**
3. Aguarde conclusão

---

## 🏷️ Metadados

### Campos Reconhecidos
- **Título**: Nome da música
- **Artista**: Artista principal
- **Álbum**: Nome do álbum
- **Ano**: Ano de lançamento
- **Gênero**: Categoria musical
- **Número da Faixa**: Posição no álbum
- **Compositor**: Autor
- **Duração**: Calculada automaticamente

### Editar Metadados
1. Clique direito na música
2. Selecione **Editar Informações**
3. Modifique campos
4. Salvar (altera arquivo original)

### Capas de Álbum
Ordem de prioridade:
1. Imagem embarcada no arquivo
2. `cover.jpg` na pasta do álbum
3. `folder.jpg` na pasta do álbum
4. Busca automática online (se habilitado)

---

## 📋 Organizando Biblioteca

### Estrutura Recomendada
```
Music/
├── Artista 1/
│   ├── Álbum 2020/
│   │   ├── 01 - Música 1.mp3
│   │   ├── 02 - Música 2.mp3
│   │   └── cover.jpg
│   └── Álbum 2022/
│       └── ...
└── Artista 2/
    └── ...
```

### Nomeclatura de Arquivos
Formato recomendado:
```
NN - Título da Música.ext
```
Exemplo: `01 - Bohemian Rhapsody.flac`

---

## 📋 Playlists Locais

### Formatos Suportados
- **M3U/M3U8**: Padrão universal
- **PLS**: Formato Winamp
- **XSPF**: XML Shareable Playlist

### Criar Playlist
1. Vá em **Biblioteca > Playlists > Nova**
2. Dê um nome
3. Arraste músicas para a playlist
4. Salvar

### Importar Playlist
1. **Biblioteca > Playlists > Importar**
2. Selecione arquivo .m3u ou similar
3. Músicas correspondentes são encontradas

### Exportar Playlist
1. Clique direito na playlist
2. **Exportar como > M3U**
3. Escolha local de salvamento

---

## 🎵 Reprodução Local

### Qualidade
Arquivos locais são reproduzidos na qualidade original:
- FLAC: Qualidade CD ou superior
- MP3 320kbps: Alta qualidade lossy
- Sem transcodificação

### Gapless Playback
Reprodução sem pausas entre faixas:
1. **Configurações > Áudio > Gapless**
2. Ative para álbuns ao vivo/conceituais

### ReplayGain
Normalização usando tags ReplayGain:
1. **Configurações > Áudio > ReplayGain**
2. Opções: Track, Album, Desligado

---

## ☁️ Sincronização

### Com Storj
Faça backup de músicas locais:
1. Configure Storj em **Backup > Storj**
2. **Biblioteca > Sincronizar > Enviar**
3. Músicas são enviadas criptografadas

### Entre Dispositivos
1. Configure mesmo bucket Storj
2. Músicas sincronizam automaticamente
3. Apenas metadados baixam (streaming)

---

## 🔧 Troubleshooting

### Música não aparece
- Verifique formato suportado
- Verifique permissões de leitura
- Force re-indexação

### Metadados incorretos
- Use editor de metadados externo (Kid3, MusicBrainz Picard)
- Re-indexe após correção

### Áudio distorcido
- Verifique arquivo original
- Tente outro player para comparar
- Verifique se arquivo não está corrompido

### Capa não aparece
- Embutir capa no arquivo
- Colocar `cover.jpg` na pasta
- Verifique permissão do arquivo de imagem

---

## 💾 Gerenciamento de Armazenamento

### Ver Uso
**Configurações > Biblioteca > Armazenamento**:
- Espaço total usado
- Por formato
- Maiores arquivos

### Limpar Cache
1. **Configurações > Avançado > Cache**
2. Limpar: Thumbnails, Índices, Temporários

### Compressão
Converter para formato menor:
1. Instale ffmpeg
2. **Biblioteca > Ferramentas > Converter**
3. Escolha formato destino

---

[← Recursos Avançados](User-Guide-Advanced.md) | [Próximo: Administração →](User-Guide-Admin.md)
