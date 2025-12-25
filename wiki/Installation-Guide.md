# 🚀 Guia de Instalação

## Pré-requisitos

### Desenvolvimento
- Node.js 18+ ou 20+
- pnpm 8+
- Git

### Produção
- Ubuntu 22.04 LTS
- 2GB RAM mínimo
- 10GB de espaço em disco

## Instalação para Desenvolvimento

```bash
# Clone o repositório
git clone https://github.com/B0yZ4kr14/TSiJUKEBOX.git
cd TSiJUKEBOX

# Instale as dependências
pnpm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais

# Inicie o servidor de desenvolvimento
pnpm dev
```

## Instalação em Produção

### Método 1: Instalador Unificado (Recomendado)

```bash
# Instalação completa
curl -fsSL https://raw.githubusercontent.com/B0yZ4kr14/TSiJUKEBOX/main/scripts/unified-installer.py | sudo python3 -- --mode full

# Instalação em modo kiosk
curl -fsSL https://raw.githubusercontent.com/B0yZ4kr14/TSiJUKEBOX/main/scripts/unified-installer.py | sudo python3 -- --mode kiosk

# Simulação (dry-run)
curl -fsSL https://raw.githubusercontent.com/B0yZ4kr14/TSiJUKEBOX/main/scripts/unified-installer.py | sudo python3 -- --dry-run
```

### Método 2: Instalação Manual

```bash
# 1. Instale Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Instale pnpm
npm install -g pnpm

# 3. Clone e instale
git clone https://github.com/B0yZ4kr14/TSiJUKEBOX.git /opt/tsijukebox
cd /opt/tsijukebox
pnpm install
pnpm build

# 4. Configure Nginx
sudo cp docs/nginx/tsijukebox.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/tsijukebox.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## Modos de Instalação

| Modo | Descrição | Fases |
|------|-----------|-------|
| `full` | Instalação completa | 26/26 |
| `server` | Apenas servidor | 20/26 |
| `kiosk` | Modo kiosk | 24/26 |
| `minimal` | Instalação mínima | 15/26 |

## Próximos Passos

Após a instalação, consulte:
- [⚙️ Configuração](Configuration) para configurar o sistema
- [🔧 Troubleshooting](Troubleshooting) se encontrar problemas
