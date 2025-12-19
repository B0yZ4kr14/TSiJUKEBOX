# 📦 TSiJUKEBOX - Arch Linux Package

<p align="center">
  <img src="../../public/logo/tsijukebox-logo.svg" alt="TSiJUKEBOX Logo" width="120">
</p>

<p align="center">
  <strong>PKGBUILD para Arch Linux e derivados</strong>
</p>

---

## 📋 Conteúdo do Pacote

| Arquivo | Descrição |
|---------|-----------|
| `PKGBUILD` | Script de build para makepkg |
| `tsijukebox.service` | Serviço systemd |
| `tsijukebox.install` | Hooks de instalação |
| `tsijukebox.desktop` | Entrada para menu de aplicativos |
| `tsijukebox` | Script de inicialização |
| `config.json` | Configuração padrão |

---

## 🚀 Instalação

### Método 1: Build Local

```bash
# Clone o repositório
git clone https://github.com/B0yZ4kr14/TSiJUKEBOX.git
cd TSiJUKEBOX/packaging/arch

# Build e instalação
makepkg -si
```

### Método 2: AUR (quando disponível)

```bash
# Usando yay
yay -S tsijukebox

# Usando paru
paru -S tsijukebox
```

---

## ⚙️ Configuração

### Arquivo de Configuração

O arquivo de configuração principal está em:

```
/etc/tsijukebox/config.json
```

### Opções Principais

```json
{
  "kiosk_mode": true,      // Modo kiosk (fullscreen sem decorações)
  "language": "pt-BR",      // Idioma da interface
  "theme": "dark",          // Tema (dark/light)
  "autoplay": true,         // Reprodução automática
  "touch_enabled": true     // Suporte a touch
}
```

---

## 🖥️ Uso

### Linha de Comando

```bash
# Iniciar normalmente
tsijukebox

# Modo kiosk
tsijukebox --kiosk

# Modo janela
tsijukebox --windowed

# Modo debug
tsijukebox --debug

# Ver ajuda
tsijukebox --help
```

### Serviço Systemd

```bash
# Habilitar e iniciar (sistema)
sudo systemctl enable --now tsijukebox

# Habilitar e iniciar (usuário)
systemctl --user enable --now tsijukebox

# Ver status
sudo systemctl status tsijukebox

# Ver logs
sudo journalctl -u tsijukebox -f
```

---

## 🔧 Configuração de Kiosk

### 1. Criar Usuário Kiosk

```bash
# Criar usuário
sudo useradd -m -G audio,video,input kiosk

# Definir senha
sudo passwd kiosk
```

### 2. Configurar Autologin

```bash
# Criar diretório para override
sudo mkdir -p /etc/systemd/system/getty@tty1.service.d/

# Criar configuração de autologin
sudo tee /etc/systemd/system/getty@tty1.service.d/autologin.conf << 'EOF'
[Service]
ExecStart=
ExecStart=-/usr/bin/agetty --autologin kiosk --noclear %I $TERM
EOF
```

### 3. Configurar Autostart do X

Adicione ao `~/.bash_profile` do usuário kiosk:

```bash
if [[ -z $DISPLAY ]] && [[ $(tty) = /dev/tty1 ]]; then
    startx
fi
```

### 4. Configurar Xinitrc

Crie `~/.xinitrc` do usuário kiosk:

```bash
#!/bin/sh
exec /usr/bin/tsijukebox --kiosk
```

---

## 🔄 Atualização

```bash
cd TSiJUKEBOX/packaging/arch
git pull
makepkg -si
```

---

## 🗑️ Desinstalação

```bash
# Remover pacote
sudo pacman -R tsijukebox

# Remover com dependências órfãs
sudo pacman -Rns tsijukebox

# Limpar configurações (opcional)
sudo rm -rf /etc/tsijukebox
sudo rm -rf /var/log/tsijukebox
```

---

## 📁 Estrutura de Arquivos

Após instalação:

```
/
├── etc/
│   └── tsijukebox/
│       └── config.json           # Configuração
├── opt/
│   └── tsijukebox/               # Aplicação
│       ├── index.html
│       ├── assets/
│       └── ...
├── usr/
│   ├── bin/
│   │   └── tsijukebox            # Launcher
│   ├── lib/
│   │   └── systemd/
│   │       ├── system/
│   │       │   └── tsijukebox.service
│   │       └── user/
│   │           └── tsijukebox.service
│   └── share/
│       ├── applications/
│       │   └── tsijukebox.desktop
│       ├── doc/tsijukebox/
│       ├── licenses/tsijukebox/
│       └── pixmaps/
│           └── tsijukebox.png
└── var/
    └── log/
        └── tsijukebox/           # Logs
```

---

## 🐛 Troubleshooting

### Chromium não inicia

```bash
# Verificar se Chromium está instalado
which chromium

# Verificar permissões de áudio
groups $USER | grep audio

# Testar manualmente
chromium --app=file:///opt/tsijukebox/index.html
```

### Sem som

```bash
# Verificar PulseAudio
pulseaudio --check && echo "Running" || echo "Not running"

# Reiniciar PulseAudio
pulseaudio -k && pulseaudio --start

# Verificar dispositivos
pactl list short sinks
```

### Problemas com X11

```bash
# Verificar DISPLAY
echo $DISPLAY

# Verificar Xauthority
echo $XAUTHORITY

# Testar xhost
xhost +local:
```

---

## 📝 Dependências

### Obrigatórias

- `nodejs>=18` - Runtime Node.js
- `chromium` - Navegador para PWA
- `pulseaudio` - Servidor de áudio

### Opcionais

- `spotify` - Cliente Spotify nativo
- `spicetify-cli` - Customização do Spotify
- `nginx` - Proxy reverso
- `pipewire` - Servidor de áudio moderno

---

## 🤝 Contribuindo

1. Fork o repositório
2. Crie uma branch: `git checkout -b feature/minha-feature`
3. Commit: `git commit -m 'feat: minha feature'`
4. Push: `git push origin feature/minha-feature`
5. Abra um Pull Request

---

## 📄 Licença

Public Domain - Veja [LICENSE](../../LICENSE)

---

<p align="center">
  <strong>TSiJUKEBOX Enterprise</strong> — A música, amplificada.
  <br>
  Mantido por B0.y_Z4kr14
</p>
