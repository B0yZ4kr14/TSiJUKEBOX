# 🐍 Guia de Testes Python do Instalador TSiJUKEBOX

Este guia cobre as práticas de teste, ferramentas e convenções para os testes Python do instalador TSiJUKEBOX.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Estrutura de Testes](#estrutura-de-testes)
- [Executando Testes](#executando-testes)
- [Escrevendo Novos Testes](#escrevendo-novos-testes)
- [Cobertura de Código](#cobertura-de-código)
- [Testes de Segurança](#testes-de-segurança)
- [Testes de Performance](#testes-de-performance)
- [CI/CD](#cicd)
- [Debugging](#debugging)
- [Contribuindo](#contribuindo)
- [Recursos](#recursos)

---

## Visão Geral

O instalador TSiJUKEBOX usa uma estratégia de testes em múltiplas camadas para garantir qualidade e confiabilidade:

| Camada | Ferramenta | Localização | Propósito |
|--------|------------|-------------|-----------|
| Unitário | pytest | `scripts/tests/test_*.py` | Lógica de componentes isolados |
| Integração | pytest | `scripts/tests/test_*_integration.py` | Fluxos entre componentes |
| Edge Cases | pytest | `scripts/tests/test_*_edge_cases.py` | Cenários extremos |
| Segurança | pytest | `scripts/tests/test_*_security.py` | Validação de segurança |
| Benchmark | pytest-benchmark | `scripts/tests/test_*_benchmark.py` | Performance |
| E2E | pytest + Docker | `scripts/tests/e2e/` | Instalação completa em containers |

### Métricas Atuais

- **30+** arquivos de teste
- **500+** testes individuais
- **60%** cobertura mínima exigida
- **7** jobs no CI/CD

---

## Configuração do Ambiente

### Requisitos

- Python 3.10+
- pip ou pipenv
- Docker (para testes E2E)

### Instalação

```bash
# Navegar para o diretório de scripts
cd scripts

# Criar ambiente virtual (recomendado)
python -m venv venv
source venv/bin/activate  # Linux/macOS
# ou
.\venv\Scripts\activate   # Windows

# Instalar dependências de teste
pip install -r requirements-test.txt
```

### Dependências de Teste

O arquivo `requirements-test.txt` inclui:

```txt
pytest>=8.0.0
pytest-cov>=4.1.0
pytest-mock>=3.12.0
pytest-asyncio>=0.23.0
pytest-timeout>=2.2.0
pytest-benchmark>=4.0.0
coverage[toml]>=7.4.0
python-on-whales>=0.70.0
```

---

## Estrutura de Testes

```
scripts/
├── tests/
│   ├── conftest.py                        # Fixtures compartilhadas
│   ├── pytest.ini                         # Configuração pytest
│   │
│   ├── # Testes Unitários
│   ├── test_unified_installer.py          # Instalador principal
│   ├── test_cli_parsing.py                # Parser de argumentos CLI
│   ├── test_audio_setup.py                # Configuração de áudio
│   ├── test_database_setup.py             # Setup de banco de dados
│   ├── test_fonts_setup.py                # Instalação de fontes
│   ├── test_ntp_setup.py                  # Sincronização de tempo
│   ├── test_ufw_setup.py                  # Configuração de firewall
│   ├── test_spicetify_setup.py            # Setup Spicetify
│   │
│   ├── # Testes de Edge Cases
│   ├── test_unified_installer_edge_cases.py
│   │
│   ├── # Testes de Integração
│   ├── test_unified_installer_integration.py
│   │
│   ├── # Testes de Segurança
│   ├── test_rls_security.py               # Políticas RLS do Supabase
│   ├── test_installer_security.py         # Segurança do instalador
│   │
│   ├── # Testes de Performance
│   ├── test_installer_benchmark.py
│   │
│   └── e2e/                               # Testes E2E em Docker
│       ├── Dockerfile.test
│       ├── docker-compose.test.yml
│       └── test_installer_docker_e2e.py
│
├── run-coverage.sh                        # Script helper para cobertura
└── requirements-test.txt                  # Dependências de teste
```

---

## Executando Testes

### Comandos Básicos

```bash
cd scripts

# Executar todos os testes (exceto docker/e2e)
pytest tests/ -v

# Testes com cobertura completa (recomendado)
./run-coverage.sh

# Apenas testes unitários
./run-coverage.sh unit

# Testes rápidos (<2s cada)
./run-coverage.sh quick

# Testes de integração
./run-coverage.sh integration

# Testes de edge cases
./run-coverage.sh edge
```

### Executando Testes Específicos

```bash
# Arquivo específico
pytest tests/test_audio_setup.py -v

# Classe específica
pytest tests/test_audio_setup.py::TestAudioSetup -v

# Teste específico
pytest tests/test_audio_setup.py::TestAudioSetup::test_install_pipewire -v

# Por marker
pytest -m "not slow" -v      # Excluir testes lentos
pytest -m "security" -v      # Apenas testes de segurança
pytest -m "unit" -v          # Apenas unitários
```

### Markers Disponíveis

| Marker | Descrição |
|--------|-----------|
| `unit` | Testes unitários |
| `integration` | Testes de integração |
| `e2e` | Testes end-to-end |
| `docker` | Requer Docker |
| `benchmark` | Testes de performance |
| `security` | Testes de segurança |
| `slow` | Testes lentos (>5s) |
| `network` | Requer acesso à rede |

---

## Escrevendo Novos Testes

### Convenções de Nomenclatura

| Elemento | Padrão | Exemplo |
|----------|--------|---------|
| Arquivo | `test_<modulo>.py` | `test_audio_setup.py` |
| Classe | `Test<Feature>` | `TestAudioSetup` |
| Método | `test_<comportamento>` | `test_install_pipewire` |
| Fixture | `<recurso>` | `mock_subprocess` |

### Estrutura de Teste Padrão

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Testes para o módulo XYZ.

Run with: pytest tests/test_xyz.py -v
"""

import pytest
from unittest.mock import MagicMock, patch


class TestXYZFeature:
    """Testa funcionalidade XYZ."""

    @pytest.fixture
    def setup_xyz(self, mocker):
        """Fixture para configurar XYZ."""
        mocker.patch('subprocess.run')
        return XYZ()

    def test_behavior_when_condition(self, setup_xyz):
        """Descreve o comportamento esperado quando condição."""
        # Arrange
        expected = "resultado esperado"
        
        # Act
        result = setup_xyz.do_something()
        
        # Assert
        assert result == expected

    def test_raises_error_when_invalid_input(self, setup_xyz):
        """Deve levantar erro com entrada inválida."""
        with pytest.raises(ValueError, match="mensagem esperada"):
            setup_xyz.process(invalid_input)
```

### Exemplo Completo

```python
import pytest
from unittest.mock import MagicMock, patch, call

class TestAudioSetup:
    """Testa configuração de áudio do instalador."""

    @pytest.fixture
    def audio_setup(self, mocker):
        """Cria instância de AudioSetup com mocks."""
        mocker.patch('subprocess.run')
        mocker.patch('shutil.which', return_value='/usr/bin/pipewire')
        
        from installer.audio_setup import AudioSetup
        return AudioSetup(backend='pipewire')

    @pytest.fixture
    def mock_run(self, mocker):
        """Mock para subprocess.run."""
        return mocker.patch(
            'subprocess.run',
            return_value=MagicMock(returncode=0, stdout='', stderr='')
        )

    def test_install_pipewire_success(self, audio_setup, mock_run):
        """PipeWire deve ser instalado com sucesso."""
        # Act
        result = audio_setup.install()

        # Assert
        assert result is True
        mock_run.assert_called()
        
        # Verificar pacotes instalados
        calls = [str(c) for c in mock_run.call_args_list]
        assert any('pipewire' in c for c in calls)

    def test_install_fails_gracefully(self, audio_setup, mock_run):
        """Falha na instalação deve ser tratada corretamente."""
        mock_run.return_value = MagicMock(returncode=1, stderr='Error')

        result = audio_setup.install()

        assert result is False

    @pytest.mark.parametrize("backend", ["pipewire", "pulseaudio", "alsa"])
    def test_supports_multiple_backends(self, backend, mocker):
        """Deve suportar múltiplos backends de áudio."""
        mocker.patch('subprocess.run')
        
        from installer.audio_setup import AudioSetup
        setup = AudioSetup(backend=backend)
        
        assert setup.backend == backend
```

### Usando Fixtures do conftest.py

```python
# conftest.py fornece fixtures compartilhadas

def test_with_temp_directory(temp_install_dir):
    """Usa diretório temporário para instalação."""
    config_file = temp_install_dir / "config.ini"
    config_file.write_text("[main]\nenabled=true")
    
    assert config_file.exists()

def test_with_mock_distro(mock_distro_info):
    """Usa informações de distro mockadas."""
    assert mock_distro_info['name'] == 'Ubuntu'
    assert mock_distro_info['version'] == '22.04'
```

---

## Cobertura de Código

### Configuração

A cobertura é configurada em `pytest.ini`:

```ini
[coverage:run]
source = .
omit = 
    tests/*
    */__pycache__/*
branch = True

[coverage:report]
show_missing = True
precision = 2
fail_under = 60
```

### Gerando Relatórios

```bash
# Relatório no terminal
pytest --cov=. --cov-report=term-missing tests/

# Relatório HTML
pytest --cov=. --cov-report=html tests/
open htmlcov/index.html

# Relatório XML (para CI)
pytest --cov=. --cov-report=xml tests/
```

### Metas de Cobertura

| Módulo | Meta | Descrição |
|--------|------|-----------|
| `installer/` | 70% | Código principal do instalador |
| `utils/` | 80% | Utilitários |
| `cli/` | 60% | Interface de linha de comando |
| **Total** | **60%** | **Mínimo exigido** |

---

## Testes de Segurança

### Categorias de Testes

1. **Políticas RLS** (`test_rls_security.py`)
   - Validação de Row-Level Security
   - Proteção de tabelas admin
   - Isolamento de dados por usuário
   - Prevenção de escalação de privilégios

2. **Segurança do Instalador** (`test_installer_security.py`)
   - Prevenção de injeção de comandos
   - Manuseio seguro de credenciais
   - Permissões de arquivos
   - Configuração de rede

### Executando Testes de Segurança

```bash
# Todos os testes de segurança
pytest tests/test_*security*.py -v

# Apenas RLS
pytest tests/test_rls_security.py -v

# Apenas segurança do instalador
pytest tests/test_installer_security.py -v

# Com relatório de cobertura
pytest tests/test_*security*.py --cov=. --cov-report=html -v
```

### Exemplo de Teste de Segurança

```python
class TestCommandInjectionPrevention:
    """Testa prevenção de injeção de comandos."""

    @pytest.mark.parametrize("payload", [
        "; rm -rf /",
        "| cat /etc/passwd",
        "$(whoami)",
        "`id`",
    ])
    def test_username_sanitization(self, payload):
        """Username deve rejeitar payloads de injeção."""
        valid_pattern = re.compile(r'^[a-zA-Z0-9_-]+$')
        
        assert not valid_pattern.match(payload), \
            f"Payload de injeção não deveria passar: {payload}"
```

---

## Testes de Performance

### Executando Benchmarks

```bash
# Todos os benchmarks
pytest tests/test_installer_benchmark.py --benchmark-only -v

# Com comparação
pytest tests/test_installer_benchmark.py \
    --benchmark-compare \
    --benchmark-autosave

# Salvar resultados em JSON
pytest tests/test_installer_benchmark.py \
    --benchmark-json=benchmark-results.json
```

### Exemplo de Benchmark

```python
class TestInstallerBenchmark:
    """Benchmarks de performance do instalador."""

    def test_benchmark_config_parsing(self, benchmark):
        """Benchmark de parsing de configuração."""
        config_content = "[main]\nenabled=true\n" * 100
        
        result = benchmark(parse_config, config_content)
        
        assert result is not None

    def test_benchmark_phase_dependency_check(self, benchmark):
        """Benchmark de verificação de dependências."""
        def check_deps():
            # Simula verificação
            return check_all_dependencies()
        
        result = benchmark(check_deps)
        assert result['missing'] == []
```

---

## CI/CD

### Workflow GitHub Actions

Os testes Python são executados automaticamente via `.github/workflows/python-installer-tests.yml`:

```yaml
# Jobs executados:
# 1. lint - Verificação de código com ruff
# 2. unit-tests - Testes unitários + cobertura
# 3. edge-case-tests - Testes de edge cases
# 4. integration-tests - Testes de integração
# 5. benchmark-tests - Benchmarks (apenas main/develop)
# 6. e2e-docker-tests - E2E em Docker (apenas main)
# 7. test-status - Status final
```

### Triggers

- **Push** para `main` ou `develop` (arquivos em `scripts/`)
- **Pull Request** para `main` ou `develop` (arquivos em `scripts/`)
- **Manual** via workflow dispatch

### Artefatos Gerados

| Artefato | Retenção | Descrição |
|----------|----------|-----------|
| `python-coverage-html` | 30 dias | Relatório HTML de cobertura |
| `python-coverage-xml` | 7 dias | Relatório XML para análise |
| `installer-benchmark-results` | 30 dias | Resultados de benchmark em JSON |

---

## Debugging

### Modo Debug

```bash
# Entrar no debugger em falha
pytest --pdb tests/test_audio_setup.py

# Breakpoint específico
pytest --pdb-trace tests/test_audio_setup.py::TestAudioSetup::test_install

# Verbose máximo
pytest -vvs tests/test_audio_setup.py
```

### Logging em Testes

```python
import logging

def test_with_logging(caplog):
    """Teste com captura de logs."""
    with caplog.at_level(logging.DEBUG):
        result = do_something()
    
    assert "Expected message" in caplog.text
```

### Debugging de Fixtures

```bash
# Mostrar fixtures disponíveis
pytest --fixtures tests/

# Setup/teardown verbose
pytest --setup-show tests/test_audio_setup.py
```

---

## Contribuindo

### Checklist para Novos Testes

- [ ] Seguir convenções de nomenclatura
- [ ] Usar fixtures do `conftest.py` quando disponíveis
- [ ] Adicionar markers apropriados (`@pytest.mark.unit`, etc.)
- [ ] Documentar com docstrings claras
- [ ] Usar padrão Arrange-Act-Assert
- [ ] Incluir testes de casos de erro
- [ ] Manter testes isolados e independentes

### Processo de Contribuição

1. **Fork** o repositório
2. **Crie branch**: `git checkout -b feat/meu-teste`
3. **Escreva testes** seguindo as convenções
4. **Execute localmente**: `./run-coverage.sh`
5. **Verifique cobertura**: mínimo 60%
6. **Commit**: `git commit -m "test: adiciona testes para XYZ"`
7. **Push**: `git push origin feat/meu-teste`
8. **Abra PR** com descrição clara

### Boas Práticas

1. **Teste comportamento, não implementação**
2. **Um assert por teste** (quando prático)
3. **Nomes descritivos**: "should [action] when [condition]"
4. **Mock dependências externas**
5. **Evite testes frágeis** que dependem de ordem ou estado global

---

## Recursos

### Documentação

- [pytest Documentation](https://docs.pytest.org/)
- [pytest-cov](https://pytest-cov.readthedocs.io/)
- [pytest-mock](https://pytest-mock.readthedocs.io/)
- [pytest-benchmark](https://pytest-benchmark.readthedocs.io/)

### Guias

- [Testing Best Practices](https://docs.pytest.org/en/stable/explanation/goodpractices.html)
- [Mocking in Python](https://realpython.com/python-mock-library/)

### Referências Internas

- [docs/TESTING.md](TESTING.md) - Testes JavaScript/TypeScript
- [scripts/pytest.ini](../scripts/pytest.ini) - Configuração pytest
- [scripts/run-coverage.sh](../scripts/run-coverage.sh) - Script helper

---

<p align="center">
  <em>Testes são documentação que nunca mente.</em>
</p>
