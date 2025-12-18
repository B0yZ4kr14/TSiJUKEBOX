#!/usr/bin/env node
/**
 * WCAG Comment Validation Script
 * Validates that all low-contrast text classes have WCAG Exception comments
 * 
 * Usage:
 *   npm run wcag:validate      - Run validation
 *   npm run wcag:validate:json - Output JSON report
 */

const fs = require('fs');
const path = require('path');

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
};

// Patterns that REQUIRE WCAG comments
const PATTERNS_REQUIRING_COMMENTS = [
  { pattern: /text-kiosk-text\/[12][0-9]/g, severity: 'critical', name: '/10-29' },
  { pattern: /text-kiosk-text\/[34][0-9]/g, severity: 'serious', name: '/30-49' },
  { pattern: /text-kiosk-text\/5[0-9]/g, severity: 'moderate', name: '/50-59' },
];

// Comment patterns that validate an exception
const VALID_COMMENT_PATTERNS = [
  /\/\*\s*WCAG\s*Exception/i,
  /\{\/\*\s*WCAG\s*Exception/i,
  /\/\/\s*WCAG\s*Exception/i,
];

function findTsxFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
      files.push(...findTsxFiles(fullPath));
    } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.jsx'))) {
      files.push(fullPath);
    }
  }
  return files;
}

function hasWcagComment(lines, lineNumber) {
  // Check 1-3 lines before for WCAG comment
  for (let i = 1; i <= 3; i++) {
    const checkLine = lineNumber - i;
    if (checkLine >= 0) {
      const line = lines[checkLine];
      if (VALID_COMMENT_PATTERNS.some(p => p.test(line))) {
        return true;
      }
    }
  }
  return false;
}

function validateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const relativePath = path.relative(process.cwd(), filePath);
  const issues = [];
  const documented = [];

  for (const { pattern, severity, name } of PATTERNS_REQUIRING_COMMENTS) {
    pattern.lastIndex = 0;
    let match;
    
    while ((match = pattern.exec(content)) !== null) {
      const beforeMatch = content.substring(0, match.index);
      const lineNumber = beforeMatch.split('\n').length - 1;
      
      if (hasWcagComment(lines, lineNumber)) {
        documented.push({
          file: relativePath,
          line: lineNumber + 1,
          match: match[0],
          severity,
          status: 'documented'
        });
      } else {
        issues.push({
          file: relativePath,
          line: lineNumber + 1,
          match: match[0],
          severity,
          status: 'missing-comment'
        });
      }
    }
  }

  return { issues, documented };
}

function main() {
  const args = process.argv.slice(2);
  const outputJson = args.includes('--json');
  
  console.log(`${COLORS.cyan}${COLORS.bold}`);
  console.log('╔═══════════════════════════════════════════════════╗');
  console.log('║   TSiJUKEBOX WCAG Comment Validator               ║');
  console.log('╚═══════════════════════════════════════════════════╝');
  console.log(`${COLORS.reset}`);

  const srcDir = path.join(process.cwd(), 'src');
  const files = findTsxFiles(srcDir);
  
  let allIssues = [];
  let allDocumented = [];
  
  for (const file of files) {
    const { issues, documented } = validateFile(file);
    allIssues.push(...issues);
    allDocumented.push(...documented);
  }

  if (outputJson) {
    console.log(JSON.stringify({
      filesScanned: files.length,
      undocumented: allIssues.length,
      documented: allDocumented.length,
      passed: allIssues.length === 0,
      issues: allIssues,
      documentedExceptions: allDocumented,
    }, null, 2));
    process.exit(allIssues.length > 0 ? 1 : 0);
    return;
  }

  // Print results
  console.log(`${COLORS.cyan}Scanned ${files.length} files${COLORS.reset}\n`);
  
  if (allDocumented.length > 0) {
    console.log(`${COLORS.green}✓ ${allDocumented.length} documented WCAG exceptions found${COLORS.reset}`);
    const byFile = allDocumented.reduce((acc, d) => {
      if (!acc[d.file]) acc[d.file] = [];
      acc[d.file].push(d);
      return acc;
    }, {});
    for (const [file, docs] of Object.entries(byFile)) {
      console.log(`  ${COLORS.dim}${file}: ${docs.length} exception(s)${COLORS.reset}`);
    }
  }

  if (allIssues.length === 0) {
    console.log(`\n${COLORS.green}${COLORS.bold}✅ All low-contrast occurrences have WCAG comments!${COLORS.reset}`);
    process.exit(0);
  }

  console.log(`\n${COLORS.red}✗ ${allIssues.length} low-contrast occurrences WITHOUT WCAG comments${COLORS.reset}\n`);
  
  const byFile = allIssues.reduce((acc, i) => {
    if (!acc[i.file]) acc[i.file] = [];
    acc[i.file].push(i);
    return acc;
  }, {});

  for (const [file, issues] of Object.entries(byFile)) {
    console.log(`${COLORS.yellow}${file}${COLORS.reset}`);
    issues.forEach(i => {
      const icon = i.severity === 'critical' ? '🔴' : i.severity === 'serious' ? '🟠' : '🟡';
      console.log(`  ${icon} Line ${i.line}: ${i.match} (add /* WCAG Exception: [reason] */)`);
    });
  }

  console.log(`\n${COLORS.cyan}💡 Para documentar uma exceção, adicione na linha anterior:${COLORS.reset}`);
  console.log(`   {/* WCAG Exception: /XX [elemento] porque [justificativa] */}`);
  
  process.exit(1);
}

main();
