import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plug, 
  Database, 
  Settings2, 
  Palette, 
  Shield, 
  Globe,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export type SettingsCategory = 
  | 'connections' 
  | 'data' 
  | 'system' 
  | 'appearance' 
  | 'security' 
  | 'integrations';

interface CategoryItem {
  id: SettingsCategory;
  label: string;
  icon: React.ElementType;
  color: string;
}

const categories: CategoryItem[] = [
  { id: 'connections', label: 'Conexões', icon: Plug, color: 'cyan' },
  { id: 'data', label: 'Dados', icon: Database, color: 'amber' },
  { id: 'system', label: 'Sistema', icon: Settings2, color: 'purple' },
  { id: 'appearance', label: 'Aparência', icon: Palette, color: 'pink' },
  { id: 'security', label: 'Segurança', icon: Shield, color: 'green' },
  { id: 'integrations', label: 'Integrações', icon: Globe, color: 'blue' },
];

interface SettingsSidebarProps {
  activeCategory: SettingsCategory;
  onCategoryChange: (category: SettingsCategory) => void;
}

export function SettingsSidebar({ activeCategory, onCategoryChange }: SettingsSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <TooltipProvider delayDuration={100}>
      <motion.aside
        className={cn(
          "settings-sidebar",
          isExpanded && "settings-sidebar-expanded"
        )}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          className="settings-sidebar-toggle"
        >
          {isExpanded ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </Button>

        {/* Category Buttons */}
        <nav className="flex flex-col gap-2 mt-4">
          {categories.map((category, index) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;

            return (
              <Tooltip key={category.id}>
                <TooltipTrigger asChild>
                  <motion.button
                    onClick={() => onCategoryChange(category.id)}
                    className={cn(
                      "settings-nav-button",
                      `settings-nav-button-${category.color}`,
                      isActive && "active"
                    )}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className={cn(
                      "w-5 h-5 transition-all duration-200",
                      isActive && "settings-nav-icon-active"
                    )} />
                    {isExpanded && (
                      <motion.span
                        className="ml-3 text-sm font-medium whitespace-nowrap"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        {category.label}
                      </motion.span>
                    )}
                  </motion.button>
                </TooltipTrigger>
                {!isExpanded && (
                  <TooltipContent side="right" className="settings-tooltip">
                    {category.label}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </nav>
      </motion.aside>
    </TooltipProvider>
  );
}
