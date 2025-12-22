#!/bin/bash
#
# TSiJUKEBOX - Coverage Report Generator
# Gera e abre o dashboard de cobertura localmente
#
# Usage: ./scripts/coverage-report.sh [--no-open]
#

set -e

# Cores
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
MAGENTA='\033[0;35m'
NC='\033[0m'

# Banner
echo -e "${CYAN}"
echo "╔══════════════════════════════════════════════════════════╗"
echo "║        TSiJUKEBOX - Coverage Report Generator            ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Função para mostrar progresso
progress() {
    echo -e "${CYAN}[$(date +%H:%M:%S)]${NC} $1"
}

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erro: Execute este script na raiz do projeto!${NC}"
    exit 1
fi

# Executar testes com cobertura
progress "📊 Gerando relatório de cobertura..."
echo ""

npx vitest run --coverage || true

echo ""

# Verificar se o relatório foi gerado
if [ ! -d "coverage/vitest" ]; then
    echo -e "${RED}❌ Erro: Diretório de cobertura não foi gerado!${NC}"
    exit 1
fi

# Mostrar resumo
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}                   📊 COVERAGE SUMMARY                     ${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo ""

THRESHOLD=70

if [ -f "coverage/vitest/coverage-summary.json" ]; then
    # Usar node para parsing seguro do JSON
    SUMMARY=$(node -e "
        const fs = require('fs');
        const data = JSON.parse(fs.readFileSync('coverage/vitest/coverage-summary.json', 'utf8'));
        const total = data.total;
        console.log(JSON.stringify({
            statements: total.statements.pct,
            branches: total.branches.pct,
            functions: total.functions.pct,
            lines: total.lines.pct
        }));
    " 2>/dev/null || echo '{"statements":0,"branches":0,"functions":0,"lines":0}')
    
    STATEMENTS=$(echo "$SUMMARY" | node -e "process.stdout.write(String(JSON.parse(require('fs').readFileSync(0, 'utf8')).statements))")
    BRANCHES=$(echo "$SUMMARY" | node -e "process.stdout.write(String(JSON.parse(require('fs').readFileSync(0, 'utf8')).branches))")
    FUNCTIONS=$(echo "$SUMMARY" | node -e "process.stdout.write(String(JSON.parse(require('fs').readFileSync(0, 'utf8')).functions))")
    LINES=$(echo "$SUMMARY" | node -e "process.stdout.write(String(JSON.parse(require('fs').readFileSync(0, 'utf8')).lines))")
    
    # Função para colorir baseado no threshold
    colorize() {
        local value=$1
        local threshold=$2
        if (( $(echo "$value >= $threshold" | bc -l 2>/dev/null || echo 0) )); then
            echo -e "${GREEN}${value}%${NC}"
        elif (( $(echo "$value >= $threshold * 0.8" | bc -l 2>/dev/null || echo 0) )); then
            echo -e "${YELLOW}${value}%${NC}"
        else
            echo -e "${RED}${value}%${NC}"
        fi
    }
    
    echo -e "  ${MAGENTA}Statements:${NC} $(colorize "$STATEMENTS" $THRESHOLD)"
    echo -e "  ${MAGENTA}Branches:${NC}   $(colorize "$BRANCHES" $THRESHOLD)"
    echo -e "  ${MAGENTA}Functions:${NC}  $(colorize "$FUNCTIONS" $THRESHOLD)"
    echo -e "  ${MAGENTA}Lines:${NC}      $(colorize "$LINES" $THRESHOLD)"
    echo ""
    
    # Verificar thresholds
    FAILED=false
    
    check_threshold() {
        local name=$1
        local value=$2
        local threshold=$3
        
        if (( $(echo "$value < $threshold" | bc -l 2>/dev/null || echo 1) )); then
            echo -e "${RED}❌ $name abaixo de ${threshold}% (atual: ${value}%)${NC}"
            FAILED=true
        fi
    }
    
    check_threshold "Statements" "$STATEMENTS" $THRESHOLD
    check_threshold "Branches" "$BRANCHES" $THRESHOLD
    check_threshold "Functions" "$FUNCTIONS" $THRESHOLD
    check_threshold "Lines" "$LINES" $THRESHOLD
    
    if [ "$FAILED" = false ]; then
        echo -e "${GREEN}✅ Todos os thresholds atingidos (>= ${THRESHOLD}%)${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Arquivo coverage-summary.json não encontrado${NC}"
fi

echo ""
echo -e "${GREEN}✅ Relatório gerado em: coverage/vitest/index.html${NC}"
echo ""

# Verificar flag --no-open
if [[ "$1" == "--no-open" ]]; then
    echo -e "${CYAN}Modo --no-open: não abrindo navegador${NC}"
    exit 0
fi

# Perguntar se deseja abrir (ou abrir automaticamente em CI)
open_browser() {
    local file="coverage/vitest/index.html"
    
    if command -v xdg-open &> /dev/null; then
        xdg-open "$file" 2>/dev/null &
    elif command -v open &> /dev/null; then
        open "$file"
    elif command -v start &> /dev/null; then
        start "$file"
    else
        echo -e "${YELLOW}Abra manualmente: file://$(pwd)/$file${NC}"
    fi
}

# Se estiver em terminal interativo, perguntar
if [ -t 0 ]; then
    read -p "Abrir relatório no navegador? (Y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Nn]$ ]]; then
        open_browser
    fi
fi

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}                   📋 COMANDOS ÚTEIS                       ${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "  ${MAGENTA}npx vitest --ui${NC}          # Abrir Vitest UI"
echo -e "  ${MAGENTA}npm run test:watch${NC}       # Modo watch"
echo -e "  ${MAGENTA}npm run test:integration${NC} # Testes de integração"
echo -e "  ${MAGENTA}npm run test:e2e${NC}         # Testes E2E"
echo ""
