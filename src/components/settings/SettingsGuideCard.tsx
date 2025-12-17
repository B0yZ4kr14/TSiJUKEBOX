import { LucideIcon, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SettingsGuideCardProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
}

export function SettingsGuideCard({ 
  title, 
  description, 
  icon: Icon, 
  onClick 
}: SettingsGuideCardProps) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "p-4 cursor-pointer transition-all hover:scale-[1.02] group",
        "bg-kiosk-surface/50 border border-cyan-500/30 hover:border-cyan-500/50",
        "hover:shadow-[0_0_20px_hsl(195_100%_50%_/_0.15)]"
      )}
    >
      <div className="flex items-center gap-4">
        {/* Icon with 3D neon blue effect */}
        <div className="p-3 rounded-lg bg-cyan-500/10 shadow-[0_0_15px_hsl(185_100%_50%_/_0.2)] flex-shrink-0">
          <Icon className="w-6 h-6 icon-neon-blue" />
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Full title - no truncate */}
          <h4 className="font-semibold text-white text-base mb-1">{title}</h4>
          {/* Description with improved contrast */}
          <p className="text-sm text-kiosk-text/75">{description}</p>
        </div>
        
        <ArrowRight className="w-5 h-5 text-cyan-400/50 group-hover:text-cyan-400 transition-colors flex-shrink-0" />
      </div>
    </Card>
  );
}
