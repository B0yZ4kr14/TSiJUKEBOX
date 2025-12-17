import { LucideIcon, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SettingsGuideCardProps {
  id: string;
  title: string;
  description?: string; // Optional - not displayed, kept for compatibility
  icon: LucideIcon;
  onClick: () => void;
}

export function SettingsGuideCard({ 
  title, 
  icon: Icon, 
  onClick 
}: SettingsGuideCardProps) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "p-3 cursor-pointer transition-all hover:scale-[1.02] group",
        "bg-kiosk-surface/50 border border-cyan-500/30 hover:border-cyan-500/50",
        "hover:shadow-[0_0_20px_hsl(195_100%_50%_/_0.15)]"
      )}
    >
      <div className="flex items-center gap-3">
        {/* Icon with neon blue effect */}
        <div className="p-2.5 rounded-lg bg-cyan-500/10 shadow-[0_0_12px_hsl(185_100%_50%_/_0.2)] flex-shrink-0">
          <Icon className="w-5 h-5 icon-neon-blue" />
        </div>
        
        {/* Title only - high contrast */}
        <h4 className="font-semibold text-white text-sm flex-1">{title}</h4>
        
        <ArrowRight className="w-4 h-4 text-cyan-400/50 group-hover:text-cyan-400 transition-colors flex-shrink-0" />
      </div>
    </Card>
  );
}
