import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type BrandTextSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
export type BrandTextWeight = 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
export type BrandTextAnimation = 'none' | 'typing' | 'typing-loop';

interface BrandTextProps {
  className?: string;
  size?: BrandTextSize;
  weight?: BrandTextWeight;
  noShimmer?: boolean;
  /** Tipo de animação de digitação */
  animate?: BrandTextAnimation;
  /** Velocidade de digitação em ms por caractere (default: 100) */
  typingSpeed?: number;
  /** Delay inicial antes de começar a digitar em ms (default: 0) */
  typingDelay?: number;
  /** Callback quando a digitação completar */
  onTypingComplete?: () => void;
}

const BRAND_TEXT = 'TSiJUKEBOX';
const TSI_LENGTH = 3; // "TSi"

const sizeClasses: Record<BrandTextSize, string> = {
  sm: 'text-sm',      // 14px
  md: 'text-base',    // 16px (padrão)
  lg: 'text-lg',      // 18px
  xl: 'text-2xl',     // 24px
  '2xl': 'text-3xl',  // 30px
  '3xl': 'text-4xl',  // 36px
};

const weightClasses: Record<BrandTextWeight, string> = {
  light: 'font-light',       // 300
  normal: 'font-normal',     // 400
  medium: 'font-medium',     // 500
  semibold: 'font-semibold', // 600
  bold: 'font-bold',         // 700 (padrão atual)
  extrabold: 'font-extrabold', // 800
};

/**
 * Componente reutilizável para renderizar "TSiJUKEBOX"
 * com cores da logo: TSi em prata/steel, JUKEBOX em dourado/âmbar
 * Suporta variantes de tamanho, peso, animação shimmer e typing
 */
export function BrandText({ 
  className, 
  size = 'md', 
  weight = 'bold',
  noShimmer = false,
  animate = 'none',
  typingSpeed = 100,
  typingDelay = 0,
  onTypingComplete
}: BrandTextProps) {
  const [displayedChars, setDisplayedChars] = useState(animate === 'none' ? BRAND_TEXT.length : 0);
  const [showCursor, setShowCursor] = useState(animate !== 'none');
  const [isTypingComplete, setIsTypingComplete] = useState(animate === 'none');

  const resetTyping = useCallback(() => {
    setDisplayedChars(0);
    setShowCursor(true);
    setIsTypingComplete(false);
  }, []);

  useEffect(() => {
    if (animate === 'none') {
      setDisplayedChars(BRAND_TEXT.length);
      setShowCursor(false);
      return;
    }

    // Delay inicial antes de começar a digitar
    const delayTimer = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayedChars((prev) => {
          if (prev >= BRAND_TEXT.length) {
            clearInterval(interval);
            setIsTypingComplete(true);
            
            if (animate === 'typing-loop') {
              // Loop: aguarda e recomeça
              setTimeout(() => {
                resetTyping();
              }, 2000);
            } else {
              // Typing simples: esconde cursor após completar
              setTimeout(() => {
                setShowCursor(false);
                onTypingComplete?.();
              }, 500);
            }
            return prev;
          }
          return prev + 1;
        });
      }, typingSpeed);
      
      return () => clearInterval(interval);
    }, typingDelay);
    
    return () => clearTimeout(delayTimer);
  }, [animate, typingSpeed, typingDelay, onTypingComplete, resetTyping]);

  const shimmerClass = noShimmer ? 'no-shimmer' : '';
  
  // Texto visível atual
  const tsiVisible = BRAND_TEXT.slice(0, Math.min(displayedChars, TSI_LENGTH));
  const jukeboxVisible = displayedChars > TSI_LENGTH 
    ? BRAND_TEXT.slice(TSI_LENGTH, displayedChars) 
    : '';

  return (
    <span className={cn('inline', sizeClasses[size], weightClasses[weight], className)}>
      <span className={cn('text-brand-tsi', shimmerClass)}>{tsiVisible}</span>
      <span className={cn('text-brand-jukebox', shimmerClass)}>{jukeboxVisible}</span>
      {showCursor && animate !== 'none' && (
        <motion.span
          className="inline-block w-[2px] h-[0.9em] bg-current ml-0.5 align-middle brand-typing-cursor"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
          aria-hidden="true"
        />
      )}
    </span>
  );
}

interface FormatBrandOptions {
  size?: BrandTextSize;
  weight?: BrandTextWeight;
  noShimmer?: boolean;
}

/**
 * Formata texto substituindo "TSiJUKEBOX" por componente estilizado
 * Útil para textos dinâmicos que podem conter a marca
 */
export function formatBrandInText(
  text: string, 
  options?: FormatBrandOptions
): React.ReactNode {
  if (!text || !text.includes('TSiJUKEBOX')) return text;
  
  const parts = text.split(/(TSiJUKEBOX)/g);
  return parts.map((part, i) => 
    part === 'TSiJUKEBOX' 
      ? <BrandText key={i} size={options?.size} weight={options?.weight} noShimmer={options?.noShimmer} />
      : part
  );
}

export default BrandText;
