# 🎨 Configuração de Temas

Personalize a aparência do TSiJUKEBOX com temas e customizações.

---

## 🌓 Temas Base

### Tema Escuro (Padrão)
Otimizado para ambientes de baixa luminosidade:
- Fundo escuro gradiente
- Texto claro com alto contraste
- Acentos em ciano e dourado neon

### Tema Claro
Para ambientes bem iluminados:
- Fundo branco/cinza claro
- Texto escuro
- Acentos coloridos

### Tema Sistema
Segue a preferência do sistema operacional:
- Detecta automaticamente
- Muda com o horário (se configurado no SO)

---

## ⚙️ Configurar Tema

1. **Configurações > Aparência > Tema**
2. Selecione: Escuro, Claro ou Sistema
3. Mudança aplicada instantaneamente

---

## 🎨 Customização Avançada

### Cores Personalizadas

**Configurações > Aparência > Personalizar**:

| Variável | Descrição | Padrão Escuro |
|----------|-----------|---------------|
| `--primary` | Cor principal | Rosa neon |
| `--background` | Fundo geral | Cinza escuro |
| `--foreground` | Texto principal | Branco |
| `--accent` | Destaques | Ciano |
| `--muted` | Elementos sutis | Cinza médio |

### Color Picker
1. Clique na cor que deseja mudar
2. Use o seletor de cores
3. Visualize em tempo real
4. Salvar quando satisfeito

### Presets de Cores

Escolha entre presets prontos:
- **Neon Night**: Azul e rosa neon
- **Golden Classic**: Dourado e preto
- **Ocean Blue**: Azul marinho e turquesa
- **Forest Green**: Verde e marrom
- **Purple Haze**: Roxo e magenta
- **Retro Orange**: Laranja e creme

---

## 🖼️ Elementos Visuais

### Logo Personalizado
1. **Configurações > Aparência > Logo**
2. Faça upload de imagem (PNG/SVG)
3. Dimensões recomendadas: 200x60px
4. Aplicar

### Fundo Customizado
1. **Configurações > Aparência > Fundo**
2. Opções:
   - Cor sólida
   - Gradiente
   - Imagem (upload)
   - Vídeo (URL)
3. Opacidade ajustável

### Animações
| Opção | Descrição |
|-------|-----------|
| Transições | Suaves/Rápidas/Desligado |
| Efeito hover | Escala/Brilho/Desligado |
| Visualizador | Estilo de ondas de áudio |
| Partículas | Efeito de fundo (performance) |

---

## 🔤 Tipografia

### Fonte Principal
Escolha entre:
- **System UI**: Fonte do sistema (rápido)
- **Inter**: Moderna e limpa
- **Roboto**: Material Design
- **Space Grotesk**: Futurista

### Tamanhos
| Elemento | Padrão | Opções |
|----------|--------|--------|
| Títulos | 24px | 18-36px |
| Texto | 16px | 14-20px |
| Labels | 14px | 12-16px |
| Controles | 14px | 12-18px |

### Peso
- Light (300)
- Regular (400)
- Medium (500)
- Semibold (600)
- Bold (700)

---

## 📱 Responsividade

### Breakpoints
O tema adapta automaticamente:
- **Desktop**: 1024px+
- **Tablet**: 768px-1023px
- **Mobile**: <768px

### Customização por Dispositivo
Algumas opções específicas:
- Tamanho de botões em touch
- Espaçamento em mobile
- Layout de painéis

---

## 🎭 Temas por Modo

### Modo Kiosk
Tema otimizado para terminais:
- Botões maiores
- Contraste aumentado
- Sem elementos de distração

### Modo Karaoke
Tema para letras:
- Fundo escuro
- Texto grande
- Destaque em cores vibrantes

---

## 💾 Salvar e Compartilhar

### Exportar Tema
1. **Configurações > Aparência > Exportar**
2. Baixe arquivo `.theme.json`
3. Compartilhe com outros usuários

### Importar Tema
1. **Configurações > Aparência > Importar**
2. Selecione arquivo `.theme.json`
3. Visualize preview
4. Aplicar

### Formato do Tema
```json
{
  "name": "Meu Tema",
  "version": "1.0",
  "colors": {
    "primary": "346 84% 61%",
    "background": "240 10% 4%",
    "foreground": "0 0% 95%"
  },
  "fonts": {
    "primary": "Inter",
    "display": "Space Grotesk"
  },
  "effects": {
    "neon": true,
    "particles": false
  }
}
```

---

## ♿ Acessibilidade Visual

### Alto Contraste
1. **Configurações > Acessibilidade > Alto Contraste**
2. Aumenta contraste de texto
3. Remove efeitos que podem dificultar leitura

### Reduzir Movimento
1. **Configurações > Acessibilidade > Reduzir Movimento**
2. Desativa animações
3. Transições instantâneas

### Daltonismo
Modos para diferentes tipos:
- Protanopia (vermelho-verde)
- Deuteranopia (verde-vermelho)
- Tritanopia (azul-amarelo)

---

## 🔧 CSS Customizado

Para usuários avançados:

1. **Configurações > Aparência > CSS Customizado**
2. Adicione CSS:

```css
/* Exemplo: Mudar cor do botão play */
.button-play-chrome-neon {
  border-color: hsl(120 100% 50%);
}

/* Exemplo: Fonte customizada */
@import url('https://fonts.googleapis.com/css2?family=Orbitron');
.clock {
  font-family: 'Orbitron', sans-serif;
}
```

3. Salvar e visualizar

---

## 🔄 Resetar

### Resetar para Padrão
1. **Configurações > Aparência > Resetar**
2. Confirme
3. Todas as customizações são removidas

### Resetar Cor Específica
1. Clique na cor
2. Clique em "Restaurar padrão"
3. Apenas essa cor volta ao original

---

[← Backup na Nuvem](Config-Cloud-Backup.md) | [Próximo: Acessibilidade →](Config-Accessibility.md)
