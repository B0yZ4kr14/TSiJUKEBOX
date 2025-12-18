#!/usr/bin/env node
/**
 * Script de verificação de contraste WCAG
 * Analisa arquivos CSS e TSX para detectar potenciais problemas de contraste
 * 
 * Uso: node scripts/check-contrast.js
 */

const fs = require('fs');
const path = require('path');

// Padrões problemáticos conhecidos
const PROBLEMATIC_PATTERNS = [
  { pattern: /bg-background(?![/\-])/g, issue: 'bg-background pode resultar em fundo branco - usar bg-kiosk-surface ou bg-kiosk-bg', severity: 'error' },
  { pattern: /bg-white(?![/\-])/g, issue: 'bg-white é branco puro - usar bg-kiosk-surface', severity: 'error' },
  { pattern: /bg-card(?![/\-])/g, issue: 'bg-card pode ter contraste baixo - verificar tema', severity: 'warning' },
  { pattern: /text-foreground(?![/\-])/g, issue: 'text-foreground pode ser escuro em dark mode - usar text-kiosk-text', severity: 'warning' },
  { pattern: /variant=["']outline["'](?!.*kiosk)/g, issue: 'Button outline pode ter fundo claro - usar variant="kiosk-outline"', severity: 'error' },
  { pattern: /bg-background\/50/g, issue: 'bg-background/50 pode ser claro - usar bg-kiosk-surface/50', severity: 'error' },
];

// Padrões aceitáveis (exceções)
const ACCEPTABLE_PATTERNS = [
  /Badge.*variant=["']outline["']/,  // Badges podem usar outline
  /ring-offset-background/,           // Ring offset é aceitável
];

// Diretórios a verificar
const DIRS_TO_CHECK = ['src/components', 'src/pages'];
const EXTENSIONS = ['.tsx', '.ts', '.css'];

// Cores para output
const colors = {
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

function isAcceptable(line) {
  return ACCEPTABLE_PATTERNS.some(pattern => pattern.test(line));
}

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  const lines = content.split('\n');
  
  PROBLEMATIC_PATTERNS.forEach(({ pattern, issue, severity }) => {
    lines.forEach((line, index) => {
      // Reset regex lastIndex
      pattern.lastIndex = 0;
      
      if (pattern.test(line) && !isAcceptable(line)) {
        issues.push({
          file: filePath,
          line: index + 1,
          issue,
          severity,
          match: line.trim().substring(0, 100),
        });
      }
    });
  });
  
  return issues;
}

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else if (EXTENSIONS.some(ext => f.endsWith(ext))) {
      callback(dirPath);
    }
  });
}

function main() {
  console.log(`${colors.cyan}${colors.bold}🔍 Verificando problemas de contraste WCAG...${colors.reset}\n`);
  
  const allIssues = [];
  let filesChecked = 0;
  
  DIRS_TO_CHECK.forEach(dir => {
    const fullPath = path.join(process.cwd(), dir);
    if (fs.existsSync(fullPath)) {
      walkDir(fullPath, (filePath) => {
        filesChecked++;
        const issues = checkFile(filePath);
        allIssues.push(...issues);
      });
    }
  });
  
  console.log(`${colors.cyan}Arquivos verificados: ${filesChecked}${colors.reset}\n`);
  
  if (allIssues.length === 0) {
    console.log(`${colors.green}${colors.bold}✅ Nenhum problema de contraste encontrado!${colors.reset}`);
    process.exit(0);
  }
  
  // Agrupar por arquivo
  const byFile = {};
  allIssues.forEach(issue => {
    if (!byFile[issue.file]) byFile[issue.file] = [];
    byFile[issue.file].push(issue);
  });
  
  // Exibir resultados
  let errors = 0;
  let warnings = 0;
  
  Object.entries(byFile).forEach(([file, issues]) => {
    const relativePath = file.replace(process.cwd(), '.');
    console.log(`\n${colors.bold}📄 ${relativePath}${colors.reset}`);
    
    issues.forEach(({ line, issue, severity, match }) => {
      const icon = severity === 'error' ? `${colors.red}❌` : `${colors.yellow}⚠️`;
      const color = severity === 'error' ? colors.red : colors.yellow;
      
      console.log(`   ${icon} ${color}Linha ${line}:${colors.reset} ${issue}`);
      console.log(`      ${colors.cyan}${match}${match.length >= 100 ? '...' : ''}${colors.reset}`);
      
      if (severity === 'error') errors++;
      else warnings++;
    });
  });
  
  console.log(`\n${colors.bold}📊 Resumo:${colors.reset}`);
  console.log(`   ${colors.red}${errors} erros${colors.reset}`);
  console.log(`   ${colors.yellow}${warnings} avisos${colors.reset}`);
  
  console.log(`\n${colors.cyan}💡 Dicas de correção:${colors.reset}`);
  console.log(`   • Use ${colors.green}variant="kiosk-outline"${colors.reset} em vez de ${colors.red}variant="outline"${colors.reset} para botões`);
  console.log(`   • Use ${colors.green}bg-kiosk-surface${colors.reset} ou ${colors.green}bg-kiosk-bg${colors.reset} em vez de ${colors.red}bg-background${colors.reset}`);
  console.log(`   • Use ${colors.green}text-kiosk-text${colors.reset} em vez de ${colors.red}text-foreground${colors.reset}\n`);
  
  process.exit(errors > 0 ? 1 : 0);
}

main();
