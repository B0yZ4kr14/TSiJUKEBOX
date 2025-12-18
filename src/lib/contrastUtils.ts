/**
 * WCAG 2.1 Contrast Ratio Utilities
 * Funções para calcular e verificar ratios de contraste de acessibilidade
 */

// Converter cor HSL string para RGB
export function hslToRgb(hslString: string): { r: number; g: number; b: number } | null {
  // Tentar parse de vários formatos HSL
  const hslMatch = hslString.match(/hsl\(\s*(\d+)\s+(\d+)%\s+(\d+)%/);
  const hslCommaMatch = hslString.match(/hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%/);
  
  let h: number, s: number, l: number;
  
  if (hslMatch) {
    h = parseInt(hslMatch[1]) / 360;
    s = parseInt(hslMatch[2]) / 100;
    l = parseInt(hslMatch[3]) / 100;
  } else if (hslCommaMatch) {
    h = parseInt(hslCommaMatch[1]) / 360;
    s = parseInt(hslCommaMatch[2]) / 100;
    l = parseInt(hslCommaMatch[3]) / 100;
  } else {
    return null;
  }

  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

// Converter cor RGB string para objeto
export function parseRgb(rgbString: string): { r: number; g: number; b: number } | null {
  const match = rgbString.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
  if (match) {
    return {
      r: parseInt(match[1]),
      g: parseInt(match[2]),
      b: parseInt(match[3]),
    };
  }
  return null;
}

// Converter hex para RGB
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Parse qualquer formato de cor
export function parseColor(color: string): { r: number; g: number; b: number } | null {
  if (!color) return null;
  
  color = color.trim();
  
  if (color.startsWith('hsl')) {
    return hslToRgb(color);
  }
  if (color.startsWith('rgb')) {
    return parseRgb(color);
  }
  if (color.startsWith('#')) {
    return hexToRgb(color);
  }
  
  // Cores nomeadas comuns
  const namedColors: Record<string, { r: number; g: number; b: number }> = {
    white: { r: 255, g: 255, b: 255 },
    black: { r: 0, g: 0, b: 0 },
    transparent: { r: 0, g: 0, b: 0 },
  };
  
  return namedColors[color.toLowerCase()] || null;
}

// Calcular luminância relativa (WCAG 2.1)
export function getRelativeLuminance(rgb: { r: number; g: number; b: number }): number {
  const sRGB = [rgb.r, rgb.g, rgb.b].map((v) => {
    v = v / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
}

// Calcular ratio de contraste WCAG 2.1
export function calculateContrastRatio(
  foreground: string,
  background: string
): number | null {
  const fgRgb = parseColor(foreground);
  const bgRgb = parseColor(background);

  if (!fgRgb || !bgRgb) return null;

  const fgLuminance = getRelativeLuminance(fgRgb);
  const bgLuminance = getRelativeLuminance(bgRgb);

  const lighter = Math.max(fgLuminance, bgLuminance);
  const darker = Math.min(fgLuminance, bgLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

// Verificar se atende WCAG AA
export function meetsWCAGAA(ratio: number, isLargeText: boolean = false): boolean {
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

// Verificar se atende WCAG AAA
export function meetsWCAGAAA(ratio: number, isLargeText: boolean = false): boolean {
  return isLargeText ? ratio >= 4.5 : ratio >= 7;
}

// Determinar se o texto é "grande" (>=18pt ou >=14pt bold)
export function isLargeText(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element);
  const fontSize = parseFloat(style.fontSize);
  const fontWeight = parseInt(style.fontWeight) || 400;
  
  // 18pt = 24px, 14pt = 18.67px
  if (fontSize >= 24) return true;
  if (fontSize >= 18.67 && fontWeight >= 700) return true;
  
  return false;
}

// Obter cor de fundo efetiva (percorrendo ancestors)
export function getEffectiveBackgroundColor(element: HTMLElement): string {
  let current: HTMLElement | null = element;
  
  while (current) {
    const style = window.getComputedStyle(current);
    const bgColor = style.backgroundColor;
    
    // Se não for transparente, retornar
    if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
      return bgColor;
    }
    
    current = current.parentElement;
  }
  
  // Fallback para branco se não encontrar
  return 'rgb(255, 255, 255)';
}

// Determinar se uma cor é "clara"
export function isLightColor(color: string): boolean {
  const rgb = parseColor(color);
  if (!rgb) return false;
  
  const luminance = getRelativeLuminance(rgb);
  return luminance > 0.5;
}

// Determinar se uma cor é "escura"
export function isDarkColor(color: string): boolean {
  return !isLightColor(color);
}

// Sugerir correção de cor
export function suggestCorrection(
  currentColor: string,
  background: string,
  targetRatio: number = 4.5
): string {
  const bgRgb = parseColor(background);
  if (!bgRgb) return currentColor;
  
  const bgLuminance = getRelativeLuminance(bgRgb);
  
  // Se fundo escuro, sugerir cor clara; se fundo claro, sugerir cor escura
  if (bgLuminance < 0.5) {
    // Fundo escuro - sugerir amarelo neon
    return 'hsl(45 100% 65%)';
  } else {
    // Fundo claro - sugerir texto escuro
    return 'hsl(220 25% 15%)';
  }
}

// Classificar severidade do problema
export function getContrastSeverity(
  ratio: number,
  isLarge: boolean
): 'error' | 'warning' | 'ok' {
  if (meetsWCAGAA(ratio, isLarge)) return 'ok';
  if (ratio >= (isLarge ? 2 : 3)) return 'warning';
  return 'error';
}
