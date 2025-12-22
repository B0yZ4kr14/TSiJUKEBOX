import { Page, test as base, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Accessibility testing fixture using axe-core
 * Provides WCAG 2.1 AA compliance validation
 */
export interface A11yResults {
  violations: A11yViolation[];
  passes: number;
  incomplete: number;
  inapplicable: number;
}

export interface A11yViolation {
  id: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical';
  description: string;
  help: string;
  helpUrl: string;
  nodes: number;
  wcagTags: string[];
}

export class A11yPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Run full WCAG 2.1 AA accessibility scan
   */
  async scanPage(options?: {
    include?: string[];
    exclude?: string[];
    disableRules?: string[];
  }): Promise<A11yResults> {
    let builder = new AxeBuilder({ page: this.page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']);

    if (options?.include) {
      builder = builder.include(options.include);
    }
    if (options?.exclude) {
      builder = builder.exclude(options.exclude);
    }
    if (options?.disableRules) {
      builder = builder.disableRules(options.disableRules);
    }

    const results = await builder.analyze();

    return {
      violations: results.violations.map((v) => ({
        id: v.id,
        impact: v.impact as 'minor' | 'moderate' | 'serious' | 'critical',
        description: v.description,
        help: v.help,
        helpUrl: v.helpUrl,
        nodes: v.nodes.length,
        wcagTags: v.tags.filter((t) => t.startsWith('wcag')),
      })),
      passes: results.passes.length,
      incomplete: results.incomplete.length,
      inapplicable: results.inapplicable.length,
    };
  }

  /**
   * Assert page has no critical or serious WCAG violations
   */
  async expectNoSeriousViolations(options?: {
    exclude?: string[];
    disableRules?: string[];
  }): Promise<void> {
    const results = await this.scanPage(options);
    
    const seriousViolations = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );

    if (seriousViolations.length > 0) {
      const report = seriousViolations
        .map((v) => `  - [${v.impact.toUpperCase()}] ${v.id}: ${v.help} (${v.nodes} elements)\n    ${v.helpUrl}`)
        .join('\n');
      
      throw new Error(`Found ${seriousViolations.length} serious/critical WCAG violations:\n${report}`);
    }
  }

  /**
   * Assert page has no WCAG violations at all
   */
  async expectNoViolations(options?: {
    exclude?: string[];
    disableRules?: string[];
  }): Promise<void> {
    const results = await this.scanPage(options);

    if (results.violations.length > 0) {
      const report = results.violations
        .map((v) => `  - [${v.impact}] ${v.id}: ${v.help} (${v.nodes} elements)`)
        .join('\n');
      
      throw new Error(`Found ${results.violations.length} WCAG violations:\n${report}`);
    }
  }

  /**
   * Check color contrast ratio for text elements
   */
  async checkColorContrast(): Promise<A11yViolation[]> {
    const results = await new AxeBuilder({ page: this.page })
      .withRules(['color-contrast', 'color-contrast-enhanced'])
      .analyze();

    return results.violations.map((v) => ({
      id: v.id,
      impact: v.impact as 'minor' | 'moderate' | 'serious' | 'critical',
      description: v.description,
      help: v.help,
      helpUrl: v.helpUrl,
      nodes: v.nodes.length,
      wcagTags: v.tags.filter((t) => t.startsWith('wcag')),
    }));
  }

  /**
   * Check form elements have proper labels
   */
  async checkFormLabels(): Promise<A11yViolation[]> {
    const results = await new AxeBuilder({ page: this.page })
      .withRules(['label', 'label-title-only', 'form-field-multiple-labels'])
      .analyze();

    return results.violations.map((v) => ({
      id: v.id,
      impact: v.impact as 'minor' | 'moderate' | 'serious' | 'critical',
      description: v.description,
      help: v.help,
      helpUrl: v.helpUrl,
      nodes: v.nodes.length,
      wcagTags: v.tags.filter((t) => t.startsWith('wcag')),
    }));
  }

  /**
   * Check all images have alt text
   */
  async checkImageAlts(): Promise<A11yViolation[]> {
    const results = await new AxeBuilder({ page: this.page })
      .withRules(['image-alt', 'input-image-alt', 'role-img-alt'])
      .analyze();

    return results.violations.map((v) => ({
      id: v.id,
      impact: v.impact as 'minor' | 'moderate' | 'serious' | 'critical',
      description: v.description,
      help: v.help,
      helpUrl: v.helpUrl,
      nodes: v.nodes.length,
      wcagTags: v.tags.filter((t) => t.startsWith('wcag')),
    }));
  }

  /**
   * Check ARIA attributes are valid
   */
  async checkAriaAttributes(): Promise<A11yViolation[]> {
    const results = await new AxeBuilder({ page: this.page })
      .withRules([
        'aria-allowed-attr',
        'aria-required-attr',
        'aria-required-children',
        'aria-required-parent',
        'aria-valid-attr',
        'aria-valid-attr-value',
      ])
      .analyze();

    return results.violations.map((v) => ({
      id: v.id,
      impact: v.impact as 'minor' | 'moderate' | 'serious' | 'critical',
      description: v.description,
      help: v.help,
      helpUrl: v.helpUrl,
      nodes: v.nodes.length,
      wcagTags: v.tags.filter((t) => t.startsWith('wcag')),
    }));
  }

  /**
   * Check keyboard navigation is possible
   */
  async checkKeyboardNav(): Promise<A11yViolation[]> {
    const results = await new AxeBuilder({ page: this.page })
      .withRules([
        'tabindex',
        'focus-order-semantics',
        'scrollable-region-focusable',
        'bypass',
      ])
      .analyze();

    return results.violations.map((v) => ({
      id: v.id,
      impact: v.impact as 'minor' | 'moderate' | 'serious' | 'critical',
      description: v.description,
      help: v.help,
      helpUrl: v.helpUrl,
      nodes: v.nodes.length,
      wcagTags: v.tags.filter((t) => t.startsWith('wcag')),
    }));
  }

  /**
   * Print accessibility report to console
   */
  async printReport(): Promise<void> {
    const results = await this.scanPage();
    
    console.log('\n=== Accessibility Report ===');
    console.log(`✓ Passed: ${results.passes}`);
    console.log(`⚠ Incomplete: ${results.incomplete}`);
    console.log(`✗ Violations: ${results.violations.length}`);
    
    if (results.violations.length > 0) {
      console.log('\nViolations:');
      for (const v of results.violations) {
        const icon = v.impact === 'critical' || v.impact === 'serious' ? '🔴' : '🟡';
        console.log(`${icon} [${v.impact.toUpperCase()}] ${v.id}`);
        console.log(`   ${v.help}`);
        console.log(`   Affected: ${v.nodes} elements`);
        console.log(`   WCAG: ${v.wcagTags.join(', ')}`);
      }
    }
    console.log('============================\n');
  }
}

/**
 * Extended test fixture with accessibility helpers
 */
export const test = base.extend<{ a11y: A11yPage }>({
  a11y: async ({ page }, use) => {
    const a11y = new A11yPage(page);
    await use(a11y);
  },
});

export { expect };
