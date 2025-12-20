# 🚀 Tutorial: Primeira Configuração

Este tutorial guia você pela configuração inicial do TSiJUKEBOX, desde a instalação até a primeira reprodução de música.

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter:

- [ ] Sistema operacional Linux (recomendado: CachyOS/Arch) ou Windows/macOS
- [ ] Node.js 18+ ou Bun instalado
- [ ] Git instalado
- [ ] Navegador moderno (Chrome 90+ recomendado)
- [ ] Conta Spotify Premium (opcional, para integração Spotify)
- [ ] Conta YouTube Music (opcional)

---

## 🔧 Instalação

### Método 1: Instalador Automático (Recomendado)

```bash
# Clone o repositório
git clone https://github.com/B0yZ4kr14/TSiJUKEBOX.git
cd TSiJUKEBOX

# Execute o instalador
cd scripts/installer
python main.py
```

O instalador irá:
1. Verificar dependências do sistema
2. Configurar o banco de dados
3. Instalar pacotes necessários
4. Configurar serviços

### Método 2: Instalação Manual

```bash
# Clone o repositório
git clone https://github.com/B0yZ4kr14/TSiJUKEBOX.git
cd TSiJUKEBOX

# Instale dependências
npm install
# ou
bun install

# Configure variáveis de ambiente
cp .env.example .env

# Inicie o servidor de desenvolvimento
npm run dev
```

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

### Passo 3: Configurar Banco de Dados

O TSiJUKEBOX usa Supabase como backend. A configuração é automática via Lovable Cloud, mas você pode customizar:

1. Acesse **Configurações > Avançado > Banco de Dados**
2. Verifique a conexão
3. Configure opções de backup

---

## 🎵 Primeira Reprodução

Após a configuração:

1. Retorne à tela principal (`/`)
2. Navegue pela biblioteca ou use a busca
3. Clique em uma música para adicionar à fila
4. Use os controles de reprodução no painel inferior

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

### Música não reproduz
- Verifique as permissões de áudio do navegador
- Confirme que o dispositivo de saída está configurado
- Teste com outro provedor de música

### Tela em branco
- Limpe o cache (Ctrl+Shift+R)
- Verifique o console (F12) para erros
- Consulte o [Troubleshooting](../TROUBLESHOOTING.md)

---

[← Voltar ao Home](Home.md) | [Próximo: Integração Spotify →](Tutorial-Spotify-Integration.md)
