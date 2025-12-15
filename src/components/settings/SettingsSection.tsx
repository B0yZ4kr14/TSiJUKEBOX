import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface SettingsSectionProps {
  icon: ReactNode;
  title: string;
  description?: string;
  badge?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  delay?: number;
}

export function SettingsSection({
  icon,
  title,
  description,
  badge,
  children,
  defaultOpen = true,
  delay = 0,
}: SettingsSectionProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay }}
    >
      <Collapsible defaultOpen={defaultOpen}>
        <Card className="bg-kiosk-surface border-kiosk-border">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-kiosk-surface/80 transition-colors rounded-t-lg">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-kiosk-text">
                  {icon}
                  {title}
                  {badge}
                </CardTitle>
                <ChevronDown className="w-5 h-5 text-kiosk-text/50 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </div>
              {description && (
                <CardDescription className="text-kiosk-text/60">
                  {description}
                </CardDescription>
              )}
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">{children}</CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </motion.div>
  );
}
