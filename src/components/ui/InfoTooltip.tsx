import { ReactNode } from 'react';
import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface InfoTooltipProps {
  content: string;
  children?: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  showIcon?: boolean;
  iconClassName?: string;
}

export function InfoTooltip({ 
  content, 
  children, 
  side = 'top',
  showIcon = true,
  iconClassName = 'w-4 h-4 icon-neon-blue cursor-help'
}: InfoTooltipProps) {
  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>
        {children || (
          showIcon && <HelpCircle className={iconClassName} />
        )}
      </TooltipTrigger>
      <TooltipContent 
        side={side} 
        className="max-w-xs bg-slate-900 border-slate-600 text-kiosk-text p-3 z-50"
      >
        <p className="text-sm leading-relaxed">{content}</p>
      </TooltipContent>
    </Tooltip>
  );
}
