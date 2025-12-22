#!/usr/bin/env python3
"""
TSiJUKEBOX Enterprise - Standalone Installer
=============================================
Versão COMPLETAMENTE autônoma do instalador, sem dependências de módulos externos.
Pode ser executado via: curl -fsSL .../install_standalone.py | sudo python3

Autor: B0.y_Z4kr14
Licença: Domínio Público
"""

import os
import sys
import pwd
import grp
import json
import shutil
import argparse
import subprocess
import socket
import time
import sqlite3
from pathlib import Path
from typing import Optional, List, Dict, Tuple, Any
from dataclasses import dataclass, field

# =============================================================================
# CONSTANTES
# =============================================================================

VERSION = "4.2.0"
INSTALL_DIR = Path("/opt/tsijukebox")
CONFIG_DIR = Path("/etc/tsijukebox")
LOG_DIR = Path("/var/log/tsijukebox")
DATA_DIR = Path("/var/lib/tsijukebox")
REPO_URL = "https://github.com/B0yZ4kr14/TSiJUKEBOX.git"

DRY_RUN = False
QUIET_MODE = False

# Cores ANSI
class Colors:
    RED = '\033[91m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    MAGENTA = '\033[95m'
    CYAN = '\033[96m'
    WHITE = '\033[97m'
    RESET = '\033[0m'
    BOLD = '\033[1m'

# Pacotes
BASE_PACKAGES = [
    'base-devel', 'git', 'nodejs', 'npm', 'python', 'python-pip',
    'chromium', 'openbox', 'xorg-server', 'xorg-xinit', 'xorg-xset',
    'xorg-xrandr', 'unclutter', 'wmctrl', 'xdotool', 'sqlite'
]

MONITORING_PACKAGES = ['grafana', 'prometheus', 'prometheus-node-exporter']
WEB_PACKAGES = ['nginx', 'avahi', 'nss-mdns']

# =============================================================================
# LOGGING
# =============================================================================

def log_step(msg: str):
    if not QUIET_MODE:
        print(f"{Colors.BLUE}🔧 {msg}{Colors.RESET}")

def log_success(msg: str):
    if not QUIET_MODE:
        print(f"{Colors.GREEN}✅ {msg}{Colors.RESET}")

def log_warning(msg: str):
    print(f"{Colors.YELLOW}⚠️  {msg}{Colors.RESET}")

def log_error(msg: str):
    print(f"{Colors.RED}❌ {msg}{Colors.RESET}")

def log_info(msg: str):
    if not QUIET_MODE:
        print(f"{Colors.CYAN}ℹ️  {msg}{Colors.RESET}")

# =============================================================================
# UTILITÁRIOS
# =============================================================================

def run_command(
    cmd: List[str],
    capture: bool = False,
    check: bool = True,
    cwd: Optional[str] = None,
    env: Optional[Dict] = None
) -> Tuple[int, str, str]:
    """Executa comando com tratamento de erros."""
    if DRY_RUN:
        log_info(f"[DRY-RUN] {' '.join(cmd)}")
        return 0, "", ""
    
    try:
        result = subprocess.run(
            cmd,
            capture_output=capture,
            text=True,
            cwd=cwd,
            env=env,
            timeout=600
        )
        return result.returncode, result.stdout or "", result.stderr or ""
    except subprocess.TimeoutExpired:
        log_error(f"Timeout: {' '.join(cmd)}")
        return 1, "", "Command timed out"
    except Exception as e:
        log_error(f"Erro: {e}")
        return 1, "", str(e)

def get_installed_packages() -> List[str]:
    """Lista pacotes instalados via pacman."""
    try:
        result = subprocess.run(
            ['pacman', '-Qq'],
            capture_output=True,
            text=True
        )
        return result.stdout.strip().split('\n') if result.returncode == 0 else []
    except:
        return []

def detect_aur_helper() -> Optional[str]:
    """Detecta helper AUR instalado (paru preferido)."""
    for helper in ['paru', 'yay', 'pikaur', 'trizen']:
        if shutil.which(helper):
            return helper
    return None

# =============================================================================
# DETECÇÃO DO SISTEMA
# =============================================================================

@dataclass
class SystemInfo:
    distro: str
    distro_id: str
    user: str
    home: Path
    login_manager: str
    installed_packages: List[str]
    has_paru: bool
    has_spotify: bool
    aur_helper: Optional[str]

def detect_system() -> SystemInfo:
    """Detecta informações do sistema."""
    # Detectar distribuição
    distro = "Unknown"
    distro_id = "unknown"
    
    os_release = Path('/etc/os-release')
    if os_release.exists():
        content = os_release.read_text()
        for line in content.splitlines():
            if line.startswith('NAME='):
                distro = line.split('=')[1].strip('"')
            elif line.startswith('ID='):
                distro_id = line.split('=')[1].strip('"')
    
    # Detectar usuário real
    user = os.environ.get('SUDO_USER') or os.environ.get('USER') or 'root'
    try:
        home = Path(pwd.getpwnam(user).pw_dir)
    except KeyError:
        home = Path.home()
    
    # Detectar login manager
    login_manager = "getty"
    for dm in ['sddm', 'gdm', 'lightdm', 'ly', 'greetd']:
        if shutil.which(dm):
            login_manager = dm
            break
    
    # Pacotes instalados
    installed = get_installed_packages()
    
    # AUR helper
    aur_helper = detect_aur_helper()
    
    return SystemInfo(
        distro=distro,
        distro_id=distro_id,
        user=user,
        home=home,
        login_manager=login_manager,
        installed_packages=installed,
        has_paru=aur_helper == 'paru',
        has_spotify='spotify' in installed or 'spotify-launcher' in installed,
        aur_helper=aur_helper
    )

# =============================================================================
# INSTALAÇÃO DE PACOTES
# =============================================================================

def install_paru() -> bool:
    """Instala paru AUR helper."""
    if shutil.which('paru'):
        return True
    
    log_step("Instalando paru AUR helper...")
    
    tmp_dir = Path('/tmp/paru-install')
    tmp_dir.mkdir(exist_ok=True)
    
    # Clonar e compilar
    run_command(['git', 'clone', 'https://aur.archlinux.org/paru.git', str(tmp_dir)])
    
    user = os.environ.get('SUDO_USER', 'nobody')
    run_command(['chown', '-R', f'{user}:{user}', str(tmp_dir)])
    
    code, _, _ = run_command(
        ['sudo', '-u', user, 'makepkg', '-si', '--noconfirm'],
        cwd=str(tmp_dir)
    )
    
    shutil.rmtree(tmp_dir, ignore_errors=True)
    
    if code == 0:
        log_success("paru instalado")
        return True
    
    log_warning("Falha ao instalar paru")
    return False

def install_packages(packages: List[str], system_info: Optional[SystemInfo] = None) -> bool:
    """Instala pacotes via pacman/paru."""
    if not packages:
        return True
    
    installed = system_info.installed_packages if system_info else get_installed_packages()
    to_install = [p for p in packages if p not in installed]
    
    if not to_install:
        log_info("Todos os pacotes já estão instalados")
        return True
    
    # Tentar pacman primeiro
    code, _, _ = run_command(
        ['pacman', '-Sy', '--noconfirm', '--needed'] + to_install,
        capture=True, check=False
    )
    
    if code != 0:
        # Fallback para AUR helper
        aur_helper = detect_aur_helper()
        if aur_helper:
            user = os.environ.get('SUDO_USER', 'nobody')
            run_command(
                ['sudo', '-u', user, aur_helper, '-Sy', '--noconfirm', '--needed'] + to_install,
                capture=True, check=False
            )
    
    return True

# =============================================================================
# CLONE DO REPOSITÓRIO
# =============================================================================

def clone_repository() -> bool:
    """Clona repositório TSiJUKEBOX para /opt."""
    log_step("Clonando repositório TSiJUKEBOX...")
    
    if INSTALL_DIR.exists():
        log_info("Diretório já existe, atualizando...")
        code, _, _ = run_command(['git', 'pull'], cwd=str(INSTALL_DIR))
        return code == 0
    
    INSTALL_DIR.parent.mkdir(parents=True, exist_ok=True)
    
    code, _, err = run_command([
        'git', 'clone', '--depth', '1', REPO_URL, str(INSTALL_DIR)
    ])
    
    if code == 0:
        log_success(f"Repositório clonado em {INSTALL_DIR}")
        return True
    
    log_error(f"Falha ao clonar repositório: {err}")
    return False

def install_npm_dependencies() -> bool:
    """Instala dependências npm do projeto."""
    log_step("Instalando dependências npm...")
    
    if not INSTALL_DIR.exists():
        log_error("Repositório não encontrado")
        return False
    
    package_json = INSTALL_DIR / 'package.json'
    if not package_json.exists():
        log_warning("package.json não encontrado")
        return False
    
    user = os.environ.get('SUDO_USER', 'root')
    
    # Instalar dependências
    code, _, err = run_command(
        ['sudo', '-u', user, 'npm', 'install'],
        cwd=str(INSTALL_DIR)
    )
    
    if code == 0:
        log_success("Dependências npm instaladas")
        return True
    
    log_warning(f"Falha ao instalar npm: {err}")
    return False

# =============================================================================
# CONFIGURAÇÃO DO BANCO DE DADOS
# =============================================================================

def create_sqlite_database() -> bool:
    """Cria banco de dados SQLite com schema inicial."""
    log_step("Criando banco de dados SQLite...")
    
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    db_path = DATA_DIR / 'tsijukebox.db'
    
    try:
        conn = sqlite3.connect(str(db_path))
        cursor = conn.cursor()
        
        # Configurações de performance
        cursor.execute("PRAGMA journal_mode=WAL")
        cursor.execute("PRAGMA synchronous=NORMAL")
        cursor.execute("PRAGMA cache_size=-64000")
        cursor.execute("PRAGMA foreign_keys=ON")
        
        # Tabela de configurações
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Tabela de estatísticas de reprodução
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS playback_stats (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                track_id TEXT NOT NULL,
                track_name TEXT NOT NULL,
                artist_name TEXT NOT NULL,
                album_name TEXT,
                played_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                duration_ms INTEGER,
                completed BOOLEAN DEFAULT 0
            )
        ''')
        
        # Tabela de playlists locais
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS playlists (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Inserir configurações padrão
        defaults = [
            ('version', VERSION),
            ('theme', 'dark'),
            ('language', 'pt-BR'),
            ('autoplay', 'true'),
        ]
        
        for key, value in defaults:
            cursor.execute(
                'INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)',
                (key, value)
            )
        
        conn.commit()
        conn.close()
        
        # Permissões
        user = os.environ.get('SUDO_USER', 'root')
        run_command(['chown', '-R', f'{user}:{user}', str(DATA_DIR)])
        
        log_success(f"Banco SQLite criado: {db_path}")
        return True
        
    except Exception as e:
        log_error(f"Falha ao criar banco: {e}")
        return False

# =============================================================================
# CONFIGURAÇÃO YAML
# =============================================================================

def create_config_yaml() -> bool:
    """Cria arquivo config.yaml com configurações padrão."""
    log_step("Criando config.yaml...")
    
    CONFIG_DIR.mkdir(parents=True, exist_ok=True)
    config_path = CONFIG_DIR / 'config.yaml'
    
    config_content = f"""# TSiJUKEBOX Configuration
# Generated by installer v{VERSION}

version: "{VERSION}"

server:
  port: 5173
  host: "0.0.0.0"
  cors:
    enabled: true
    origins:
      - "http://localhost:*"
      - "http://127.0.0.1:*"

database:
  type: sqlite
  path: /var/lib/tsijukebox/tsijukebox.db
  options:
    journal_mode: WAL
    synchronous: NORMAL
    cache_size: 64000

spotify:
  enabled: true
  spicetify:
    enabled: true
    theme: Dribbblish
    color_scheme: base

audio:
  backend: pipewire
  fallback: pulseaudio
  sample_rate: 44100
  channels: 2

monitoring:
  enabled: true
  grafana:
    port: 3000
    enabled: true
  prometheus:
    port: 9090
    enabled: true
    scrape_interval: 15s

kiosk:
  enabled: false
  homepage: "http://localhost:5173"
  browser: chromium
  fullscreen: true

logging:
  level: info
  file: /var/log/tsijukebox/tsijukebox.log
  max_size: 10M
  max_files: 5

features:
  voice_control: true
  lyrics: true
  visualizer: true
  jam_sessions: true
"""
    
    config_path.write_text(config_content)
    log_success(f"config.yaml criado: {config_path}")
    return True

# =============================================================================
# SPICETIFY SETUP (Embutido)
# =============================================================================

def detect_spotify_path(user: str) -> Optional[Path]:
    """Detecta caminho de instalação do Spotify."""
    home = Path(pwd.getpwnam(user).pw_dir)
    
    paths = {
        "spotify-launcher": home / ".local/share/spotify-launcher/install/usr/share/spotify",
        "aur-spotify": Path("/opt/spotify"),
        "system": Path("/usr/share/spotify"),
        "flatpak": home / ".var/app/com.spotify.Client/config/spotify",
        "snap": Path("/snap/spotify/current/usr/share/spotify"),
    }
    
    for name, path in paths.items():
        if path.exists() and (path / "Apps").exists():
            log_info(f"Spotify encontrado: {name} em {path}")
            return path
    
    return None

def detect_prefs_path(user: str) -> Optional[Path]:
    """Detecta arquivo prefs do Spotify."""
    home = Path(pwd.getpwnam(user).pw_dir)
    
    paths = [
        home / ".config/spotify/prefs",
        home / ".var/app/com.spotify.Client/config/spotify/prefs",
        home / "snap/spotify/current/.config/spotify/prefs",
        home / ".spotify/prefs",
    ]
    
    for path in paths:
        if path.exists():
            log_info(f"Prefs encontrado: {path}")
            return path
    
    return None

def create_prefs_file(user: str) -> Optional[Path]:
    """Cria arquivo prefs se não existir."""
    home = Path(pwd.getpwnam(user).pw_dir)
    prefs_dir = home / ".config/spotify"
    prefs_path = prefs_dir / "prefs"
    
    prefs_dir.mkdir(parents=True, exist_ok=True)
    
    if not prefs_path.exists():
        prefs_path.touch()
        run_command(['chown', '-R', f'{user}:{user}', str(prefs_dir)])
    
    return prefs_path

def start_spotify_briefly(user: str) -> bool:
    """Inicia Spotify brevemente para criar arquivos."""
    log_info("Iniciando Spotify para criar configurações...")
    
    try:
        proc = subprocess.Popen(
            ['sudo', '-u', user, 'spotify', '--no-zygote'],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            start_new_session=True
        )
        
        # Aguardar mais tempo (10 segundos)
        time.sleep(10)
        
        subprocess.run(['pkill', '-f', 'spotify'], capture_output=True)
        time.sleep(2)
        
        return True
    except Exception as e:
        log_warning(f"Não foi possível iniciar Spotify: {e}")
        return False

def install_spicetify(user: str) -> bool:
    """Instala e configura Spicetify."""
    log_step("Instalando Spicetify...")
    
    home = Path(pwd.getpwnam(user).pw_dir)
    
    # Verificar se já está instalado
    spicetify_path = home / ".spicetify/spicetify"
    if spicetify_path.exists() or shutil.which("spicetify"):
        log_info("Spicetify já está instalado")
    else:
        # Instalar via curl
        install_cmd = "curl -fsSL https://raw.githubusercontent.com/spicetify/cli/main/install.sh | sh"
        
        result = subprocess.run(
            ['sudo', '-u', user, 'bash', '-c', install_cmd],
            capture_output=True,
            text=True,
            cwd=str(home),
            timeout=300
        )
        
        if result.returncode != 0:
            # Fallback: AUR
            log_info("Tentando via AUR...")
            aur_helper = detect_aur_helper()
            if aur_helper:
                run_command(
                    ['sudo', '-u', user, aur_helper, '-Sy', '--noconfirm', 'spicetify-cli'],
                    capture=True, check=False
                )
    
    # Verificar instalação
    if not shutil.which("spicetify") and not spicetify_path.exists():
        log_warning("Spicetify não foi instalado")
        return False
    
    # Detectar spotify_path
    spotify_path = detect_spotify_path(user)
    if not spotify_path:
        log_error("Não foi possível detectar instalação do Spotify")
        return False
    
    # Detectar prefs_path com retry
    prefs_path = detect_prefs_path(user)
    
    if not prefs_path:
        log_info("Prefs não encontrado, iniciando Spotify...")
        start_spotify_briefly(user)
        prefs_path = detect_prefs_path(user)
    
    if not prefs_path:
        log_info("Criando arquivo prefs manualmente...")
        prefs_path = create_prefs_file(user)
    
    if not prefs_path:
        log_error("Não foi possível criar/encontrar arquivo prefs")
        return False
    
    # Configurar Spicetify
    spicetify_cmd = str(spicetify_path) if spicetify_path.exists() else "spicetify"
    
    # Configurar spotify_path
    run_command(
        ['sudo', '-u', user, spicetify_cmd, 'config', 'spotify_path', str(spotify_path)],
        capture=True, check=False
    )
    
    # Configurar prefs_path
    run_command(
        ['sudo', '-u', user, spicetify_cmd, 'config', 'prefs_path', str(prefs_path)],
        capture=True, check=False
    )
    
    # Corrigir permissões do Spotify
    run_command(['chmod', '-R', 'a+wr', str(spotify_path)], capture=True, check=False)
    
    # Backup e apply
    run_command(
        ['sudo', '-u', user, spicetify_cmd, 'backup', 'apply'],
        capture=True, check=False
    )
    
    log_success("Spicetify configurado")
    return True

# =============================================================================
# CONFIGURAÇÃO DE AUTOLOGIN
# =============================================================================

def configure_autologin(user: str, login_manager: str) -> bool:
    """Configura autologin no login manager."""
    log_step(f"Configurando autologin via {login_manager}")
    
    if login_manager == 'sddm':
        config = f"""[Autologin]
User={user}
Session=openbox
"""
        Path('/etc/sddm.conf.d').mkdir(parents=True, exist_ok=True)
        Path('/etc/sddm.conf.d/autologin.conf').write_text(config)
        log_success("SDDM autologin configurado")
        
    elif login_manager == 'lightdm':
        config_file = Path('/etc/lightdm/lightdm.conf')
        if config_file.exists():
            content = config_file.read_text()
            if 'autologin-user=' not in content:
                content = content.replace(
                    '[Seat:*]',
                    f'[Seat:*]\nautologin-user={user}'
                )
                config_file.write_text(content)
        log_success("LightDM autologin configurado")
        
    elif login_manager == 'gdm':
        config = f"""[daemon]
AutomaticLoginEnable=True
AutomaticLogin={user}
"""
        Path('/etc/gdm/custom.conf').write_text(config)
        log_success("GDM autologin configurado")
    
    return True

# =============================================================================
# SERVIÇOS SYSTEMD
# =============================================================================

def create_systemd_service(user: str) -> bool:
    """Cria e inicia serviço systemd."""
    log_step("Criando serviço systemd...")
    
    service_content = f"""[Unit]
Description=TSiJUKEBOX Enterprise Music System
After=network.target
Wants=network.target

[Service]
Type=simple
User={user}
WorkingDirectory={INSTALL_DIR}
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=5173

# Hardening
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=read-only
PrivateTmp=true
ReadWritePaths={DATA_DIR} {LOG_DIR}

[Install]
WantedBy=multi-user.target
"""
    
    service_path = Path('/etc/systemd/system/tsijukebox.service')
    service_path.write_text(service_content)
    
    # Reload e habilitar
    run_command(['systemctl', 'daemon-reload'])
    run_command(['systemctl', 'enable', 'tsijukebox.service'], check=False)
    
    # Iniciar serviço (apenas se repositório e npm estão prontos)
    if (INSTALL_DIR / 'node_modules').exists():
        run_command(['systemctl', 'start', 'tsijukebox.service'], check=False)
        log_success("Serviço systemd criado e iniciado")
    else:
        log_success("Serviço systemd criado (inicie após npm install)")
    
    return True

# =============================================================================
# INSTALAÇÃO PRINCIPAL
# =============================================================================

def print_banner():
    print(f"""
{Colors.CYAN}╔══════════════════════════════════════════════════════════════════╗
║   {Colors.MAGENTA}████████╗{Colors.CYAN}███████╗{Colors.GREEN}██╗{Colors.CYAN}      ██╗██╗   ██╗██╗  ██╗███████╗██████╗   ║
║   {Colors.MAGENTA}╚══██╔══╝{Colors.CYAN}██╔════╝{Colors.GREEN}██║{Colors.CYAN}      ██║██║   ██║██║ ██╔╝██╔════╝██╔══██╗  ║
║   {Colors.MAGENTA}   ██║   {Colors.CYAN}███████╗{Colors.GREEN}██║{Colors.CYAN}█████ ██║██║   ██║█████╔╝ █████╗  ██████╔╝  ║
║   {Colors.MAGENTA}   ██║   {Colors.CYAN}╚════██║{Colors.GREEN}██║{Colors.CYAN}╚════ ██║██║   ██║██╔═██╗ ██╔══╝  ██╔══██╗  ║
║   {Colors.MAGENTA}   ██║   {Colors.CYAN}███████║{Colors.GREEN}██║{Colors.CYAN}      ██║╚██████╔╝██║  ██╗███████╗██████╔╝  ║
║   {Colors.MAGENTA}   ╚═╝   {Colors.CYAN}╚══════╝{Colors.GREEN}╚═╝{Colors.CYAN}      ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═════╝   ║
║                                                                      ║
║   {Colors.WHITE}S T A N D A L O N E   I N S T A L L E R   v{VERSION}{Colors.CYAN}          ║
╚══════════════════════════════════════════════════════════════════════╝{Colors.RESET}
""")

def run_installation(args: argparse.Namespace) -> bool:
    """Executa instalação completa."""
    global DRY_RUN
    DRY_RUN = getattr(args, 'dry_run', False)
    
    print_banner()
    
    # 1. Detectar sistema
    log_step("Detectando sistema...")
    system_info = detect_system()
    
    print(f"""
{Colors.GREEN}✓ Sistema detectado:{Colors.RESET}
  • Distribuição: {system_info.distro}
  • Usuário: {system_info.user}
  • Home: {system_info.home}
  • Login Manager: {system_info.login_manager}
  • AUR Helper: {system_info.aur_helper or 'Nenhum'}
  • Spotify: {'Sim' if system_info.has_spotify else 'Não'}
""")
    
    user = getattr(args, 'user', None) or system_info.user
    
    # 2. Instalar paru se necessário
    if not system_info.aur_helper:
        install_paru()
    
    # 3. Instalar pacotes base
    if not getattr(args, 'skip_packages', False):
        log_step("Instalando pacotes base...")
        install_packages(BASE_PACKAGES, system_info)
    
    # 4. Clonar repositório
    if not clone_repository():
        log_error("Falha ao clonar repositório")
        return False
    
    # 5. Instalar dependências npm
    install_npm_dependencies()
    
    # 6. Criar diretórios
    for dir_path in [CONFIG_DIR, LOG_DIR, DATA_DIR]:
        dir_path.mkdir(parents=True, exist_ok=True)
    
    # 7. Criar banco SQLite
    create_sqlite_database()
    
    # 8. Criar config.yaml
    create_config_yaml()
    
    # 9. Configurar autologin
    configure_autologin(user, system_info.login_manager)
    
    # 10. Instalar Spotify + Spicetify
    if not getattr(args, 'no_spotify', False):
        if not system_info.has_spotify:
            install_packages(['spotify-launcher'], system_info)
        install_spicetify(user)
    
    # 11. Instalar monitoramento
    if not getattr(args, 'no_monitoring', False):
        install_packages(MONITORING_PACKAGES, system_info)
        for svc in ['grafana', 'prometheus', 'prometheus-node-exporter']:
            run_command(['systemctl', 'enable', '--now', svc], check=False)
    
    # 12. Instalar nginx
    install_packages(WEB_PACKAGES, system_info)
    
    # 13. Criar serviço systemd
    create_systemd_service(user)
    
    # 14. Corrigir ownership
    for dir_path in [INSTALL_DIR, CONFIG_DIR, LOG_DIR, DATA_DIR]:
        run_command(['chown', '-R', f'{user}:{user}', str(dir_path)], check=False)
    
    # Relatório final
    print(f"""
{Colors.GREEN}╔══════════════════════════════════════════════════════════════════╗
║                    ✅ INSTALAÇÃO COMPLETA!                        ║
╚══════════════════════════════════════════════════════════════════════╝{Colors.RESET}

{Colors.CYAN}Configurações:{Colors.RESET}
  • Usuário: {user}
  • Repositório: {INSTALL_DIR}
  • Config: {CONFIG_DIR / 'config.yaml'}
  • Banco: {DATA_DIR / 'tsijukebox.db'}
  • Login Manager: {system_info.login_manager}

{Colors.YELLOW}Próximos passos:{Colors.RESET}
  1. Reinicie: sudo reboot
  2. Acesse: http://localhost:5173
  
{Colors.MAGENTA}Comandos:{Colors.RESET}
  • systemctl status tsijukebox
  • journalctl -u tsijukebox -f
  • spicetify apply

{Colors.GREEN}Obrigado por usar TSiJUKEBOX Enterprise! 🎵{Colors.RESET}
""")
    
    return True

def main():
    parser = argparse.ArgumentParser(
        description='TSiJUKEBOX Standalone Installer',
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    
    parser.add_argument('--user', help='Usuário do sistema')
    parser.add_argument('--no-spotify', action='store_true', help='Não instalar Spotify')
    parser.add_argument('--no-monitoring', action='store_true', help='Não instalar monitoramento')
    parser.add_argument('--skip-packages', action='store_true', help='Pular instalação de pacotes')
    parser.add_argument('--dry-run', action='store_true', help='Simular instalação')
    
    args = parser.parse_args()
    
    # Verificar root
    if os.geteuid() != 0:
        log_error("Este script deve ser executado como root (sudo)")
        sys.exit(1)
    
    try:
        success = run_installation(args)
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print(f"\n{Colors.YELLOW}Instalação cancelada pelo usuário{Colors.RESET}")
        sys.exit(130)
    except Exception as e:
        log_error(f"Erro fatal: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == '__main__':
    main()
