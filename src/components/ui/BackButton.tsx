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
}

export const BackButton = forwardRef<HTMLButtonElement, BackButtonProps>(
  ({ 
    navigationOptions, 
    label = 'Voltar',
    iconSize = 'md',
    variant = 'ghost',
    size = 'icon',
    className,
    ...props 
  }, ref) => {
    const { goBack } = useBackNavigation(navigationOptions);

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        onClick={goBack}
        aria-label={label}
        className={cn(
          'text-kiosk-text/90 hover:text-kiosk-text transition-colors',
          className
        )}
        {...props}
      >
        <ArrowLeft className={iconSizes[iconSize]} />
      </Button>
    );
  }
);

BackButton.displayName = 'BackButton';
