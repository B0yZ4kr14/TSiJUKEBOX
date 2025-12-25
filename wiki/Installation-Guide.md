<h1 align="center">
  <img src="https://img.shields.io/badge/📥-Guia_de_Instalação-00D4FF?style=for-the-badge&labelColor=09090B" alt="Instalação">
</h1>

<p align="center">
  <strong>Instale o TSiJUKEBOX em 5 minutos</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/⏱️_Tempo-5_min-FFD400?style=flat-square" alt="Tempo">
  <img src="https://img.shields.io/badge/📊_Dificuldade-Fácil-00FF88?style=flat-square" alt="Dificuldade">
</p>

---

## 📋 Pré-requisitos

<table>
<tr>
<td width="50%">

### 💻 Desenvolvimento

| Componente | Versão |
|------------|:------:|
| **Node.js** | 18+ ou 20+ |
| **pnpm** | 8+ |
| **Git** | 2.30+ |

</td>
<td width="50%">

### 🖥️ Produção

| Componente | Requisito |
|------------|:---------:|
| **SO** | Ubuntu 22.04 LTS |
| **RAM** | 2GB mínimo |
| **Disco** | 10GB |

</td>
</tr>
</table>

---

## 🚀 Instalação para Desenvolvimento

<table>
<tr>
<td width="80">

### 1️⃣

</td>
<td>

**Clone o repositório**

```bash
git clone https://github.com/B0yZ4kr14/tsijukebox.git
cd tsijukebox
```

</td>
</tr>
<tr>
<td>

### 2️⃣

</td>
<td>

**Instale as dependências**

```bash
pnpm install
```

</td>
</tr>
<tr>
<td>

### 3️⃣

</td>
<td>

**Configure o ambiente**

```bash
cp .env.example .env
# Edite .env com suas credenciais
```

</td>
</tr>
<tr>
<td>

### 4️⃣

</td>
<td>

**Inicie o servidor**

```bash
pnpm dev
```

</td>
</tr>
</table>

---

## 🔧 Instalação em Produção

### Método 1: Instalador Unificado (Recomendado)

```bash
# Instalação completa
curl -fsSL https://raw.githubusercontent.com/B0yZ4kr14/tsijukebox/main/scripts/unified-installer.py | sudo python3 -- --mode full

# Instalação em modo kiosk
curl -fsSL https://raw.githubusercontent.com/B0yZ4kr14/tsijukebox/main/scripts/unified-installer.py | sudo python3 -- --mode kiosk

# Simulação (dry-run)
curl -fsSL https://raw.githubusercontent.com/B0yZ4kr14/tsijukebox/main/scripts/unified-installer.py | sudo python3 -- --dry-run
```

### Método 2: Instalação Manual

```bash
# 1. Instale Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Instale pnpm
npm install -g pnpm

# 3. Clone e instale
git clone https://github.com/B0yZ4kr14/tsijukebox.git /opt/tsijukebox
cd /opt/tsijukebox
pnpm install
pnpm build

# 4. Configure Nginx
sudo cp docs/nginx/tsijukebox.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/tsijukebox.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

---

## ⚙️ Modos de Instalação

<table>
<tr>
<td align="center" width="25%">

### 🖥️ Full

```bash
--mode full
```

**26/26 fases**
Instalação completa

</td>
<td align="center" width="25%">

### 🌐 Server

```bash
--mode server
```

**20/26 fases**
Apenas servidor

</td>
<td align="center" width="25%">

### 📺 Kiosk

```bash
--mode kiosk
```

**24/26 fases**
Modo kiosk

</td>
<td align="center" width="25%">

### ⚡ Minimal

```bash
--mode minimal
```

**15/26 fases**
Instalação mínima

</td>
</tr>
</table>

---

## 🔗 Próximos Passos

<table>
<tr>
<td align="center">

[![Configuração](https://img.shields.io/badge/⚙️-Configuração-00D4FF?style=for-the-badge)](Configuration)

</td>
<td align="center">

[![Troubleshooting](https://img.shields.io/badge/🔧-Problemas-FF4444?style=for-the-badge)](Troubleshooting)

</td>
</tr>
</table>

---

<p align="center">
  <a href="Home">← Voltar para Home</a> | <a href="Configuration">Configuração →</a>
</p>
