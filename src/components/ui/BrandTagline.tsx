import React from 'react';
import { cn } from '@/lib/utils';
import { BrandText, BrandTextSize, BrandTextWeight } from './BrandText';

export type TaglineVariant = 'default' | 'subtle' | 'accent' | 'neon' | 'gradient';
export type TaglineSize = 'xs' | 'sm' | 'md' | 'lg';

interface BrandTaglineProps {
  text?: string;
  variant?: TaglineVariant;
  size?: TaglineSize;
  uppercase?: boolean;
  className?: string;
}

const sizeClasses: Record<TaglineSize, string> = {
  xs: 'text-[10px] tracking-[0.2em]',
  sm: 'text-xs tracking-[0.15em]',
  md: 'text-sm tracking-widest',
  lg: 'text-base tracking-widest',
};

const variantClasses: Record<TaglineVariant, string> = {
  default: 'text-kiosk-text/60',
  subtle: 'text-kiosk-text/40',
  accent: 'text-cyan-400/80',
  neon: 'text-brand-tagline-neon',
  gradient: 'text-brand-tagline-gradient',
};

const DEFAULT_TAGLINE = 'Enterprise Music System';

/**
 * Componente BrandTagline para renderizar tagline estilizada
 * Use junto com BrandText em headers e footers
 */
export function BrandTagline({ 
  text = DEFAULT_TAGLINE,
  variant = 'default',
  size = 'sm',
  uppercase = true,
  className 
}: BrandTaglineProps) {
  return (
    <p className={cn(
      sizeClasses[size],
      variantClasses[variant],
      uppercase && 'uppercase',
      'font-medium',
      className
    )}>
      {text}
    </p>
  );
}

interface BrandWithTaglineProps {
  brandSize?: BrandTextSize;
  brandWeight?: BrandTextWeight;
  taglineSize?: TaglineSize;
  taglineVariant?: TaglineVariant;
  taglineText?: string;
  centered?: boolean;
  className?: string;
  noShimmer?: boolean;
}

/**
 * Componente combinado BrandText + BrandTagline para uso em headers/footers
 */
export function BrandWithTagline({
  brandSize = 'lg',
  brandWeight = 'bold',
  taglineSize = 'sm',
  taglineVariant = 'subtle',
  taglineText,
  centered = true,
  className,
  noShimmer = false,
}: BrandWithTaglineProps) {
  return (
    <div className={cn(
      'flex flex-col gap-1',
      centered && 'items-center',
      className
    )}>
      <BrandText size={brandSize} weight={brandWeight} noShimmer={noShimmer} />
      <BrandTagline 
        text={taglineText} 
        size={taglineSize} 
        variant={taglineVariant} 
      />
    </div>
  );
}

export default BrandTagline;
