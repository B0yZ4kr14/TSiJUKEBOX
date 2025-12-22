"""
TSiJUKEBOX Example Plugin
=========================
Este é um plugin de exemplo que demonstra como criar plugins customizados.

Para criar seu próprio plugin:
1. Crie uma pasta em scripts/plugins/ com o nome do seu plugin
2. Crie um arquivo plugin.py com uma classe Plugin
3. A classe Plugin deve herdar de PluginBase (ou implementar os mesmos métodos)
"""

import subprocess
import shutil
from typing import List, Dict, Any, Optional

# Note: Em plugins externos, você pode importar diretamente:
# from installer.install import PluginBase, log_step, log_success, log_error, run_command


class Plugin:
    """Plugin de exemplo que instala neofetch."""
    
    # Metadados obrigatórios
    name = "example"
    version = "1.0.0"
    description = "Plugin de exemplo - instala neofetch para exibir info do sistema"
    author = "TSiJUKEBOX Team"
    
    # Dependências
    required_packages: List[str] = ['neofetch']
    required_commands: List[str] = ['neofetch']
    
    def __init__(self, args=None):
        self.args = args
        self.enabled = True
    
    def install(self) -> bool:
        """Executa a instalação do plugin."""
        print("🔧 Instalando neofetch...")
        
        try:
            # Tentar via pacman
            result = subprocess.run(
                ['pacman', '-S', '--noconfirm', 'neofetch'],
                capture_output=True,
                text=True
            )
            
            if result.returncode == 0:
                print("✅ neofetch instalado com sucesso!")
                
                # Executar neofetch para demonstrar
                print("\n📊 Informações do sistema:")
                subprocess.run(['neofetch', '--off'], check=False)
                
                return True
            else:
                print(f"❌ Erro: {result.stderr}")
                return False
                
        except FileNotFoundError:
            print("❌ pacman não encontrado. Este plugin requer Arch Linux.")
            return False
        except Exception as e:
            print(f"❌ Erro: {e}")
            return False
    
    def uninstall(self) -> bool:
        """Remove o plugin."""
        try:
            subprocess.run(
                ['pacman', '-Rs', '--noconfirm', 'neofetch'],
                capture_output=True,
                check=False
            )
            return True
        except Exception:
            return False
    
    def validate(self) -> bool:
        """Valida se o plugin está funcionando."""
        return shutil.which('neofetch') is not None
    
    def get_info(self) -> Dict[str, Any]:
        """Retorna informações do plugin."""
        return {
            'name': self.name,
            'version': self.version,
            'description': self.description,
            'author': self.author,
            'required_packages': self.required_packages,
            'required_commands': self.required_commands,
            'installed': self.validate(),
        }
