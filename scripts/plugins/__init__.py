# TSiJUKEBOX Plugin System
# ========================
# Plugins são descobertos automaticamente neste diretório.
# Cada plugin deve estar em sua própria pasta com um arquivo plugin.py
# contendo uma classe Plugin que herda de PluginBase.
#
# Estrutura:
#   scripts/plugins/
#   ├── __init__.py
#   └── meu-plugin/
#       ├── __init__.py
#       └── plugin.py  (deve conter classe Plugin)

from pathlib import Path

PLUGINS_DIR = Path(__file__).parent
