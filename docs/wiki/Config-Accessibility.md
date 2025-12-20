# ♿ Configuração de Acessibilidade

O TSiJUKEBOX é desenvolvido seguindo as diretrizes WCAG 2.1 nível AA para garantir acesso a todos os usuários.

---

## 🎯 Conformidade WCAG

### Nível AA
O TSiJUKEBOX atende aos critérios:
- ✅ Contraste de cores mínimo 4.5:1
- ✅ Navegação por teclado completa
- ✅ Textos alternativos em imagens
- ✅ Foco visível em elementos interativos
- ✅ Redimensionamento de texto até 200%
- ✅ Indicadores não apenas por cor

---

## ⚙️ Opções de Acessibilidade

Acesse em **Configurações > Acessibilidade**

### Visual

| Opção | Descrição |
|-------|-----------|
| **Alto Contraste** | Aumenta contraste de texto e elementos |
| **Tamanho de Fonte** | Ajuste de 75% a 200% |
| **Espaçamento de Linha** | Normal, Médio, Grande |
| **Modo Daltonismo** | Protanopia, Deuteranopia, Tritanopia |
| **Reduzir Transparência** | Remove efeitos de transparência |

### Movimento

| Opção | Descrição |
|-------|-----------|
| **Reduzir Movimento** | Desativa animações |
| **Pausar Animações** | Para GIFs e vídeos automáticos |
| **Transições Suaves** | Ativar/desativar transições |

### Áudio

| Opção | Descrição |
|-------|-----------|
| **Legendas** | Mostra letras/legendas quando disponível |
| **Descrição de Áudio** | Narração de elementos visuais |
| **Sons de Interface** | Feedback sonoro em ações |

---

## ⌨️ Navegação por Teclado

### Atalhos Globais

| Tecla | Ação |
|-------|------|
| `Tab` | Próximo elemento |
| `Shift+Tab` | Elemento anterior |
| `Enter/Space` | Ativar elemento |
| `Escape` | Fechar modal/menu |
| `Arrow Keys` | Navegar em listas |

### Atalhos de Reprodução

| Tecla | Ação |
|-------|------|
| `Space` | Play/Pause |
| `←/→` | Anterior/Próxima |
| `↑/↓` | Volume +/- |
| `M` | Mudo |
| `K` | Modo Karaoke |
| `F` | Tela Cheia |

### Atalhos de Navegação

| Tecla | Ação |
|-------|------|
| `/` | Busca |
| `H` | Ajuda |
| `S` | Configurações |
| `1-9` | Atalhos rápidos |

### Skip Links
No início da página, pressione Tab para acessar:
- Pular para conteúdo principal
- Pular para controles
- Pular para navegação

---

## 👁️ Alto Contraste

### Ativar
1. **Configurações > Acessibilidade > Alto Contraste**
2. Ou use atalho `Ctrl+Shift+H`

### Efeitos
- Bordas mais visíveis
- Texto com maior contraste
- Ícones com contorno
- Remoção de gradientes sutis

### Modo Personalizado
Defina suas próprias cores de alto contraste:
1. Ative Alto Contraste
2. Clique em **Personalizar**
3. Ajuste cores de fundo e texto

---

## 🔤 Tamanho de Texto

### Ajustar
1. **Configurações > Acessibilidade > Tamanho de Fonte**
2. Use slider: 75% a 200%
3. Ou use `Ctrl++` / `Ctrl+-`

### Preservação de Layout
O layout se adapta ao tamanho do texto:
- Elementos reposicionam automaticamente
- Nenhum conteúdo é cortado
- Scroll aparece quando necessário

---

## 🎨 Daltonismo

### Modos Disponíveis

| Tipo | Descrição | % População |
|------|-----------|-------------|
| Protanopia | Dificuldade com vermelho | ~1% homens |
| Deuteranopia | Dificuldade com verde | ~6% homens |
| Tritanopia | Dificuldade com azul | <1% |

### Ativar
1. **Configurações > Acessibilidade > Daltonismo**
2. Selecione seu tipo
3. Cores são ajustadas automaticamente

### Alternativas a Cores
O TSiJUKEBOX não usa apenas cor para transmitir informação:
- Ícones acompanham status
- Padrões diferentes para estados
- Texto descritivo disponível

---

## 🔊 Leitores de Tela

### Compatibilidade Testada
- ✅ NVDA (Windows)
- ✅ JAWS (Windows)
- ✅ VoiceOver (macOS/iOS)
- ✅ TalkBack (Android)
- ✅ Orca (Linux)

### Recursos
- ARIA labels em todos os elementos interativos
- Regiões live para atualizações dinâmicas
- Headings hierárquicos corretos
- Navegação por landmarks

### Configuração Recomendada
Para melhor experiência com leitor de tela:
1. **Acessibilidade > Leitor de Tela**
2. Ative: "Anúncios de música"
3. Ative: "Descrição de capas"

---

## 🖱️ Alternativas de Input

### Controle por Voz
1. **Acessibilidade > Controle por Voz**
2. Permita acesso ao microfone
3. Diga "Hey Jukebox" para ativar

### Switch Control
Suporte para dispositivos de switch:
- Escaneamento automático
- Tempo configurável
- Confirmação de seleção

### Touch Alternativo
Para usuários com mobilidade reduzida:
- Áreas de toque maiores
- Tempo de toque estendido
- Gestos simplificados

---

## 📄 Conteúdo Alternativo

### Textos Alternativos
Todas as imagens possuem descrições:
- Capas de álbum: "Capa do álbum [Nome] por [Artista]"
- Ícones: Descrição da função
- Botões: Ação que executam

### Legendas
Para conteúdo de áudio:
- Letras de música sincronizadas
- Transcrição quando disponível

---

## ✅ Checklist de Conformidade

### WCAG 2.1 AA Atendidos

| Critério | Status | Descrição |
|----------|--------|-----------|
| 1.1.1 | ✅ | Texto alternativo |
| 1.3.1 | ✅ | Info e relacionamentos |
| 1.4.3 | ✅ | Contraste mínimo |
| 1.4.4 | ✅ | Redimensionar texto |
| 2.1.1 | ✅ | Teclado |
| 2.1.2 | ✅ | Sem armadilha de teclado |
| 2.4.1 | ✅ | Pular blocos |
| 2.4.3 | ✅ | Ordem de foco |
| 2.4.7 | ✅ | Foco visível |
| 3.1.1 | ✅ | Idioma da página |
| 4.1.2 | ✅ | Nome, função, valor |

---

## 📚 Recursos

### Documentação
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Acessibilidade no TSiJUKEBOX](../ACCESSIBILITY.md)
- [Dashboard de Acessibilidade](/a11y-dashboard)

### Reportar Problemas
Encontrou uma barreira de acessibilidade?
1. Abra issue no GitHub
2. Use label "accessibility"
3. Descreva o problema e tecnologia assistiva usada

---

[← Temas](Config-Themes.md) | [Próximo: Arquitetura →](Dev-Architecture.md)
