import { motion } from 'framer-motion';
import { Zap, RefreshCw, TestTube, WifiOff } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export type ConnectionType = 'demo' | 'websocket' | 'polling' | 'polling-fallback' | 'disconnected';

interface ConnectionIndicatorProps {
  connectionType: ConnectionType;
  className?: string;
}

const connectionConfig: Record<ConnectionType, {
  icon: typeof Zap;
  label: string;
  description: string;
  color: string;
  bgColor: string;
}> = {
  demo: {
    icon: TestTube,
    label: 'Demo',
    description: 'Modo demonstração com dados simulados',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
  },
  websocket: {
    icon: Zap,
    label: 'Live',
    description: 'Conexão em tempo real via WebSocket',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
  },
  polling: {
    icon: RefreshCw,
    label: 'Polling',
    description: 'Atualizações periódicas via HTTP',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
  },
  'polling-fallback': {
    icon: RefreshCw,
    label: 'Polling',
    description: 'Fallback para polling (WebSocket indisponível)',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
  },
  disconnected: {
    icon: WifiOff,
    label: 'Offline',
    description: 'Sem conexão com o servidor',
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
  },
};

export function ConnectionIndicator({ connectionType, className = '' }: ConnectionIndicatorProps) {
  const config = connectionConfig[connectionType];
  const Icon = config.icon;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div
          className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs ${config.bgColor} ${config.color} ${className}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {connectionType === 'polling' || connectionType === 'polling-fallback' ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Icon className="w-3 h-3" />
            </motion.div>
          ) : connectionType === 'demo' ? (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Icon className="w-3 h-3" />
            </motion.div>
          ) : connectionType === 'websocket' ? (
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Icon className="w-3 h-3" />
            </motion.div>
          ) : (
            <Icon className="w-3 h-3" />
          )}
          <span className="hidden sm:inline font-medium">{config.label}</span>
        </motion.div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="bg-kiosk-surface border-kiosk-border">
        <p className="text-sm">{config.description}</p>
      </TooltipContent>
    </Tooltip>
  );
}
