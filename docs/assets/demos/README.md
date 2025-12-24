# GlobalSidebar - Demonstração Visual

Demonstração animada das funcionalidades do componente GlobalSidebar do TSiJUKEBOX.

## Arquivos

### global-sidebar-demo.gif
**Tamanho:** 850KB  
**Duração:** ~30 segundos  
**FPS:** 15  
**Resolução:** 400x900px

Demonstração completa mostrando:

1. **Glow Effect** (0-5s)
   - Alternância entre itens de navegação
   - Efeito de brilho (glow) nos ícones ativos
   - Cores neon específicas por seção
   - Animação de pulse contínua

2. **Collapse Animation** (5-8s)
   - Transição suave de 280px → 80px
   - Fade out de labels e badges
   - Reposicionamento do botão de toggle
   - Duração: 300ms com cubic-bezier easing

3. **Expand Animation** (8-11s)
   - Transição de 80px → 280px
   - Fade in de labels e badges
   - Restauração do layout completo

4. **Ciclo Completo** (11-30s)
   - Demonstração de múltiplas transições
   - Alternância de itens ativos
   - Showcase de todas as cores das seções

### sidebar-demo-final.png
**Tamanho:** 86KB  
**Resolução:** 400x900px

Screenshot final do sidebar em estado expandido com Dashboard ativo.

## Uso no README

```markdown
![GlobalSidebar Demo](./docs/assets/demos/global-sidebar-demo.gif)
```

## Características Demonstradas

### Animações
- ✅ Collapse/Expand com transição suave
- ✅ Glow effect nos ícones ativos
- ✅ Pulse animation contínua
- ✅ Fade in/out de labels
- ✅ Hover states

### Cores por Seção
| Seção | Cor | Hex |
|-------|-----|-----|
| Dashboard | Cyan | #00d4ff |
| Instalação | Verde Neon | #00ff88 |
| Configuração | Cyan | #00d4ff |
| Tutoriais | Magenta | #ff00d4 |
| Desenvolvimento | Amarelo Ouro | #ffd400 |
| API | Roxo | #d400ff |
| Segurança | Laranja | #ff4400 |
| Monitoramento | Verde Lima | #00ff44 |

### Estados
- **Expandido**: 280px de largura
- **Collapsed**: 80px de largura
- **Active**: Borda cyan + glow effect
- **Hover**: Background #2a2a2a

## Tecnologias Utilizadas

- **Puppeteer**: Captura automatizada de frames
- **FFmpeg**: Conversão de frames para GIF
- **HTML/CSS**: Página de demonstração standalone
- **JavaScript**: Controle de animações

## Processo de Criação

1. Criação de página HTML standalone (`sidebar-demo.html`)
2. Captura de 905 frames com Puppeteer (30 FPS)
3. Conversão para GIF com FFmpeg (15 FPS, otimizado)
4. Paleta de cores otimizada (255 cores)

## Controles da Demo

A página `sidebar-demo.html` inclui 3 botões de controle:

- **Toggle Sidebar**: Alterna entre expandido/collapsed
- **Cycle Active**: Alterna item ativo
- **Auto Demo**: Executa demonstração automática

## Performance

- **Tamanho do GIF**: 850KB (otimizado)
- **Frames**: 453 frames (de 905 originais)
- **Compressão**: ~50% via palette optimization
- **Qualidade**: Alta fidelidade visual

## Créditos

**Desenvolvido por:** B0.y_Z4kr14  
**Projeto:** TSiJUKEBOX v4.2.1  
**Data:** 2024-12-23
