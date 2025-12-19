import { forwardRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { useBackNavigation, type UseBackNavigationOptions } from '@/hooks/common/useBackNavigation';
import { cn } from '@/lib/utils';

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
} as const;

export interface BackButtonProps extends Omit<ButtonProps, 'onClick'> {
  /** Options passed to useBackNavigation hook */
  navigationOptions?: UseBackNavigationOptions;
  /** Accessible label for the button */
  label?: string;
  /** Icon size variant */
  iconSize?: keyof typeof iconSizes;
  /** Show label text next to icon */
  showLabel?: boolean;
  /** Position of label relative to icon */
  labelPosition?: 'before' | 'after';
}

export const BackButton = forwardRef<HTMLButtonElement, BackButtonProps>(
  ({ 
    navigationOptions, 
    label = 'Voltar',
    iconSize = 'md',
    showLabel = false,
    labelPosition = 'after',
    variant = 'ghost',
    size,
    className,
    ...props 
  }, ref) => {
    const { goBack } = useBackNavigation(navigationOptions);
    
    // Use 'icon' size only when not showing label
    const buttonSize = size ?? (showLabel ? 'default' : 'icon');

    return (
      <Button
        ref={ref}
        variant={variant}
        size={buttonSize}
        onClick={goBack}
        aria-label={label}
        className={cn(
          'text-kiosk-text/90 hover:text-kiosk-text transition-colors',
          showLabel && 'gap-2',
          className
        )}
        {...props}
      >
        {showLabel && labelPosition === 'before' && (
          <span className="text-sm font-medium">{label}</span>
        )}
        <ArrowLeft className={iconSizes[iconSize]} />
        {showLabel && labelPosition === 'after' && (
          <span className="text-sm font-medium">{label}</span>
        )}
      </Button>
    );
  }
);

BackButton.displayName = 'BackButton';
