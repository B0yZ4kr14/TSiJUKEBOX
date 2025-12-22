#!/bin/bash
# =============================================================================
# TSiJUKEBOX - Script de Atualização do Repositório
# =============================================================================
# Automatiza commit, push, changelog e release para o repositório GitHub.
#
# USO:
#   ./scripts/update-repository.sh [mensagem de commit]
#   ./scripts/update-repository.sh "feat: Add new feature"
#   ./scripts/update-repository.sh --bump patch "fix: Bug fix"
#   ./scripts/update-repository.sh --release --changelog
#
# OPÇÕES:
#   -h, --help       Mostra esta ajuda
#   -d, --dry-run    Mostra o que seria feito sem executar
#   -f, --force      Força push (use com cuidado!)
#   -t, --tag        Cria tag com a versão atual
#   -c, --changelog  Gera changelog automático
#   -r, --release    Cria release no GitHub (requer gh CLI)
#   -b, --bump TYPE  Bump de versão (major|minor|patch)
#
# EXEMPLOS:
#   ./scripts/update-repository.sh "feat: Add health check"
#   ./scripts/update-repository.sh --bump minor --changelog "feat: Add plugin system"
#   ./scripts/update-repository.sh --release --tag --changelog
#
# =============================================================================

set -e

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Variáveis
DRY_RUN=false
FORCE_PUSH=false
CREATE_TAG=false
CREATE_RELEASE=false
GENERATE_CHANGELOG=false
BUMP_TYPE=""
COMMIT_MSG=""
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
INSTALL_PY="$PROJECT_ROOT/scripts/install.py"
CHANGELOG_FILE="$PROJECT_ROOT/CHANGELOG.md"

# Funções de log
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }
log_step() { echo -e "${CYAN}🔧 $1${NC}"; }

# Mostrar ajuda
show_help() {
    head -28 "$0" | tail -25
    exit 0
}

# Obter versão atual do install.py
get_current_version() {
    if [ -f "$INSTALL_PY" ]; then
        grep -o 'VERSION = "[^"]*"' "$INSTALL_PY" | cut -d'"' -f2 || echo "0.0.0"
    else
        echo "0.0.0"
    fi
}

# Bump de versão
bump_version() {
    local bump_type="$1"
    local current_version=$(get_current_version)
    
    # Remover 'v' se existir
    current_version="${current_version#v}"
    
    IFS='.' read -ra parts <<< "$current_version"
    local major="${parts[0]:-0}"
    local minor="${parts[1]:-0}"
    local patch="${parts[2]:-0}"
    
    case "$bump_type" in
        major)
            major=$((major + 1))
            minor=0
            patch=0
            ;;
        minor)
            minor=$((minor + 1))
            patch=0
            ;;
        patch)
            patch=$((patch + 1))
            ;;
        *)
            log_error "Tipo de bump inválido: $bump_type (use: major|minor|patch)"
            exit 1
            ;;
    esac
    
    local new_version="${major}.${minor}.${patch}"
    
    if [ "$DRY_RUN" = true ]; then
        log_warning "[DRY RUN] Seria atualizado: ${current_version} → ${new_version}"
    else
        # Atualizar install.py
        if [ -f "$INSTALL_PY" ]; then
            sed -i "s/VERSION = \"[^\"]*\"/VERSION = \"${new_version}\"/" "$INSTALL_PY"
            log_success "Versão atualizada: ${current_version} → ${new_version}"
        fi
    fi
    
    echo "$new_version"
}

# Gerar changelog automático
generate_changelog() {
    local since_tag="$1"
    local output_file="${2:-CHANGELOG_FRAGMENT.md}"
    local temp_file=$(mktemp)
    
    log_step "Gerando changelog..."
    
    # Obter último tag se não especificado
    if [ -z "$since_tag" ]; then
        since_tag=$(git describe --tags --abbrev=0 2>/dev/null || echo "")
    fi
    
    local version=$(get_current_version)
    local date=$(date +%Y-%m-%d)
    
    echo "## [${version}] - ${date}" > "$temp_file"
    echo "" >> "$temp_file"
    
    # Features
    local features=""
    if [ -n "$since_tag" ]; then
        features=$(git log ${since_tag}..HEAD --oneline --grep="^feat" 2>/dev/null || true)
    else
        features=$(git log --oneline --grep="^feat" -20 2>/dev/null || true)
    fi
    
    if [ -n "$features" ]; then
        echo "### 🚀 Features" >> "$temp_file"
        echo "$features" | while read -r line; do
            # Extrair apenas a mensagem (sem hash)
            msg=$(echo "$line" | sed 's/^[a-f0-9]* //')
            echo "- $msg" >> "$temp_file"
        done
        echo "" >> "$temp_file"
    fi
    
    # Bug fixes
    local fixes=""
    if [ -n "$since_tag" ]; then
        fixes=$(git log ${since_tag}..HEAD --oneline --grep="^fix" 2>/dev/null || true)
    else
        fixes=$(git log --oneline --grep="^fix" -20 2>/dev/null || true)
    fi
    
    if [ -n "$fixes" ]; then
        echo "### 🐛 Bug Fixes" >> "$temp_file"
        echo "$fixes" | while read -r line; do
            msg=$(echo "$line" | sed 's/^[a-f0-9]* //')
            echo "- $msg" >> "$temp_file"
        done
        echo "" >> "$temp_file"
    fi
    
    # Refactoring
    local refactors=""
    if [ -n "$since_tag" ]; then
        refactors=$(git log ${since_tag}..HEAD --oneline --grep="^refactor" 2>/dev/null || true)
    else
        refactors=$(git log --oneline --grep="^refactor" -20 2>/dev/null || true)
    fi
    
    if [ -n "$refactors" ]; then
        echo "### 🧹 Refactoring" >> "$temp_file"
        echo "$refactors" | while read -r line; do
            msg=$(echo "$line" | sed 's/^[a-f0-9]* //')
            echo "- $msg" >> "$temp_file"
        done
        echo "" >> "$temp_file"
    fi
    
    # Docs
    local docs=""
    if [ -n "$since_tag" ]; then
        docs=$(git log ${since_tag}..HEAD --oneline --grep="^docs" 2>/dev/null || true)
    else
        docs=$(git log --oneline --grep="^docs" -10 2>/dev/null || true)
    fi
    
    if [ -n "$docs" ]; then
        echo "### 📚 Documentation" >> "$temp_file"
        echo "$docs" | while read -r line; do
            msg=$(echo "$line" | sed 's/^[a-f0-9]* //')
            echo "- $msg" >> "$temp_file"
        done
        echo "" >> "$temp_file"
    fi
    
    if [ "$DRY_RUN" = true ]; then
        log_warning "[DRY RUN] Changelog seria gerado:"
        cat "$temp_file"
    else
        # Prepend ao CHANGELOG.md existente
        if [ -f "$CHANGELOG_FILE" ]; then
            cat "$temp_file" "$CHANGELOG_FILE" > "${CHANGELOG_FILE}.new"
            mv "${CHANGELOG_FILE}.new" "$CHANGELOG_FILE"
        else
            # Criar novo CHANGELOG
            echo "# Changelog" > "$CHANGELOG_FILE"
            echo "" >> "$CHANGELOG_FILE"
            echo "Todas as mudanças notáveis neste projeto serão documentadas neste arquivo." >> "$CHANGELOG_FILE"
            echo "" >> "$CHANGELOG_FILE"
            cat "$temp_file" >> "$CHANGELOG_FILE"
        fi
        
        log_success "Changelog atualizado: $CHANGELOG_FILE"
    fi
    
    rm -f "$temp_file"
}

# Criar release no GitHub
create_github_release() {
    local version="$1"
    
    # Verificar se gh está instalado
    if ! command -v gh &> /dev/null; then
        log_error "GitHub CLI (gh) não encontrado."
        log_info "Instale com: pacman -S github-cli"
        log_info "Ou: curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg"
        return 1
    fi
    
    # Verificar autenticação
    if ! gh auth status &> /dev/null; then
        log_error "GitHub CLI não autenticado."
        log_info "Execute: gh auth login"
        return 1
    fi
    
    log_step "Criando release v$version no GitHub..."
    
    if [ "$DRY_RUN" = true ]; then
        log_warning "[DRY RUN] Seria criada release: v$version"
        return 0
    fi
    
    # Gerar notas de release
    local notes_file=$(mktemp)
    echo "## 🎵 TSiJUKEBOX v$version" > "$notes_file"
    echo "" >> "$notes_file"
    echo "### Instalação" >> "$notes_file"
    echo '```bash' >> "$notes_file"
    echo 'curl -fsSL https://raw.githubusercontent.com/B0yZ4kr14/TSiJUKEBOX/main/scripts/install.py | sudo python3' >> "$notes_file"
    echo '```' >> "$notes_file"
    echo "" >> "$notes_file"
    
    # Adicionar changelog se existir
    if [ -f "$CHANGELOG_FILE" ]; then
        # Extrair última seção do changelog
        head -50 "$CHANGELOG_FILE" | tail -45 >> "$notes_file"
    fi
    
    # Criar release
    if gh release create "v$version" \
        --title "🎵 TSiJUKEBOX v$version" \
        --notes-file "$notes_file" \
        --latest; then
        log_success "Release v$version criada com sucesso!"
        log_info "URL: https://github.com/B0yZ4kr14/TSiJUKEBOX/releases/tag/v$version"
    else
        log_error "Falha ao criar release"
        rm -f "$notes_file"
        return 1
    fi
    
    rm -f "$notes_file"
    return 0
}

# Parse argumentos
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            ;;
        -d|--dry-run)
            DRY_RUN=true
            shift
            ;;
        -f|--force)
            FORCE_PUSH=true
            shift
            ;;
        -t|--tag)
            CREATE_TAG=true
            shift
            ;;
        -c|--changelog)
            GENERATE_CHANGELOG=true
            shift
            ;;
        -r|--release)
            CREATE_RELEASE=true
            shift
            ;;
        -b|--bump)
            BUMP_TYPE="$2"
            shift 2
            ;;
        *)
            # Se não é uma opção, é a mensagem de commit
            if [[ ! "$1" =~ ^- ]]; then
                COMMIT_MSG="$1"
            fi
            shift
            ;;
    esac
done

# Mudar para raiz do projeto
cd "$PROJECT_ROOT"

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║      ${MAGENTA}📦 TSiJUKEBOX - Atualização de Repositório${CYAN}             ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Verificar se está em um repositório git
if [ ! -d ".git" ]; then
    log_error "Não é um repositório Git. Execute a partir da raiz do projeto."
    exit 1
fi

# Obter branch atual
CURRENT_BRANCH=$(git branch --show-current)
log_info "Branch atual: ${CURRENT_BRANCH}"
log_info "Versão atual: $(get_current_version)"

# Bump de versão se solicitado
if [ -n "$BUMP_TYPE" ]; then
    NEW_VERSION=$(bump_version "$BUMP_TYPE")
fi

# Gerar changelog se solicitado
if [ "$GENERATE_CHANGELOG" = true ]; then
    generate_changelog
fi

# Verificar status
log_step "Verificando status do repositório..."
echo ""
git status --short

# Contar alterações
CHANGES=$(git status --porcelain | wc -l)
if [ "$CHANGES" -eq 0 ]; then
    log_info "Nenhuma alteração para commit."
    
    # Ainda pode criar release
    if [ "$CREATE_RELEASE" = true ]; then
        create_github_release "$(get_current_version)"
    fi
    
    exit 0
fi

log_info "Encontradas $CHANGES alterações."
echo ""

# Mensagem de commit padrão
if [ -z "$COMMIT_MSG" ]; then
    # Gerar mensagem baseada nas alterações
    ADDED=$(git status --porcelain | grep -c "^A\|^?" || true)
    MODIFIED=$(git status --porcelain | grep -c "^M\| M" || true)
    DELETED=$(git status --porcelain | grep -c "^D" || true)
    
    if [ -n "$BUMP_TYPE" ]; then
        COMMIT_MSG="chore: Bump version to $(get_current_version)"
    elif [ "$ADDED" -gt 0 ] && [ "$MODIFIED" -eq 0 ]; then
        COMMIT_MSG="feat: Add $ADDED new file(s)"
    elif [ "$MODIFIED" -gt 0 ]; then
        COMMIT_MSG="refactor: Update $MODIFIED file(s)"
    else
        COMMIT_MSG="chore: Update project files"
    fi
    
    log_info "Mensagem de commit gerada: $COMMIT_MSG"
fi

# Dry run - apenas mostra o que seria feito
if [ "$DRY_RUN" = true ]; then
    log_warning "[DRY RUN] Os seguintes comandos seriam executados:"
    echo ""
    echo "  git add -A"
    echo "  git commit -m \"$COMMIT_MSG\""
    if [ "$FORCE_PUSH" = true ]; then
        echo "  git push origin $CURRENT_BRANCH --force"
    else
        echo "  git push origin $CURRENT_BRANCH"
    fi
    if [ "$CREATE_TAG" = true ]; then
        VERSION=$(get_current_version)
        echo "  git tag -a v$VERSION -m \"Release v$VERSION\""
        echo "  git push origin v$VERSION"
    fi
    if [ "$CREATE_RELEASE" = true ]; then
        echo "  gh release create v$(get_current_version) ..."
    fi
    echo ""
    exit 0
fi

# Adicionar todas as alterações
log_step "Adicionando alterações..."
git add -A

# Commit
log_step "Criando commit..."
git commit -m "$COMMIT_MSG"

# Push
log_step "Enviando para origin/$CURRENT_BRANCH..."
if [ "$FORCE_PUSH" = true ]; then
    log_warning "Executando force push!"
    git push origin "$CURRENT_BRANCH" --force
else
    git push origin "$CURRENT_BRANCH"
fi

# Criar tag se solicitado
if [ "$CREATE_TAG" = true ]; then
    VERSION=$(get_current_version)
    
    log_step "Criando tag v$VERSION..."
    git tag -a "v$VERSION" -m "Release v$VERSION"
    git push origin "v$VERSION"
    log_success "Tag v$VERSION criada e enviada."
fi

# Criar release se solicitado
if [ "$CREATE_RELEASE" = true ]; then
    create_github_release "$(get_current_version)"
fi

echo ""
log_success "Repositório atualizado com sucesso!"
echo ""

# Mostrar último commit
log_info "Último commit:"
git log -1 --oneline

echo ""

# Resumo final
echo -e "${CYAN}━━━ RESUMO ━━━${NC}"
echo -e "  Versão: ${GREEN}$(get_current_version)${NC}"
echo -e "  Branch: ${GREEN}$CURRENT_BRANCH${NC}"
echo -e "  Commit: ${GREEN}$(git rev-parse --short HEAD)${NC}"
if [ "$CREATE_TAG" = true ]; then
    echo -e "  Tag: ${GREEN}v$(get_current_version)${NC}"
fi
if [ "$CREATE_RELEASE" = true ]; then
    echo -e "  Release: ${GREEN}https://github.com/B0yZ4kr14/TSiJUKEBOX/releases${NC}"
fi
echo ""
