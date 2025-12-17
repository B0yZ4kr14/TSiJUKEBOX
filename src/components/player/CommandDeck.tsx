import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Activity, RefreshCw, SlidersHorizontal, Power, ChevronRight, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { api } from '@/lib/api/client';
import { useUser } from '@/contexts/UserContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useRipple } from '@/hooks/useRipple';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { RippleContainer } from '@/components/ui/RippleContainer';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CommandDeckProps {
  disabled?: boolean;
}

interface DeckButtonProps {
  icon: React.ReactNode;
  label: string;
  tooltip: string;
  onClick: () => void;
  color: 'cyan' | 'amber' | 'white' | 'red';
  disabled?: boolean;
}

const colorClasses = {
  cyan: {
    bg: 'bg-gradient-to-b from-slate-600 via-slate-700 to-slate-800',
    border: 'border-cyan-400/50',
    text: 'text-cyan-300',
    glow: 'shadow-[0_0_30px_hsl(185_100%_50%/0.3)]',
    hover: 'hover:border-cyan-300/80 hover:shadow-[0_0_45px_hsl(185_100%_50%/0.5)]',
    icon: 'text-cyan-300 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]',
    pulseClass: 'deck-button-cyan deck-button-3d-ultra',
  },
  amber: {
    bg: 'bg-gradient-to-b from-slate-600 via-slate-700 to-slate-800',
    border: 'border-amber-400/50',
    text: 'text-amber-300',
    glow: 'shadow-[0_0_30px_hsl(30_100%_50%/0.3)]',
    hover: 'hover:border-amber-300/80 hover:shadow-[0_0_45px_hsl(30_100%_50%/0.5)]',
    icon: 'text-amber-300 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]',
    pulseClass: 'deck-button-amber deck-button-3d-ultra',
  },
  white: {
    bg: 'bg-gradient-to-b from-slate-600 via-slate-700 to-slate-800',
    border: 'border-white/40',
    text: 'text-white',
    glow: 'shadow-[0_0_25px_hsl(0_0%_100%/0.25)]',
    hover: 'hover:border-white/60 hover:shadow-[0_0_40px_hsl(0_0%_100%/0.4)]',
    icon: 'text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.7)]',
    pulseClass: 'deck-button-white deck-button-3d-ultra',
  },
  red: {
    bg: 'bg-gradient-to-b from-slate-600 via-slate-700 to-slate-800',
    border: 'border-red-400/50',
    text: 'text-red-300',
    glow: 'shadow-[0_0_30px_hsl(0_100%_50%/0.3)]',
    hover: 'hover:border-red-300/80 hover:shadow-[0_0_45px_hsl(0_100%_50%/0.5)]',
    icon: 'text-red-300 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]',
    pulseClass: 'deck-button-red deck-button-3d-ultra',
  },
};

function DeckButton({ icon, label, tooltip, onClick, color, disabled }: DeckButtonProps) {
  const colors = colorClasses[color];
  const { ripples, createRipple } = useRipple();
  const { playSound } = useSoundEffects();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    createRipple(e);
    playSound('click');
    onClick();
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button
            onClick={handleClick}
            disabled={disabled}
            className={`
              relative flex flex-col items-center justify-center gap-2.5
              w-[88px] h-[88px] rounded-2xl overflow-hidden
              ${colors.bg} border-2 ${colors.border}
              ${colors.pulseClass}
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              ${colors.glow} ${colors.hover}
            `}
            whileHover={{ y: -8, scale: 1.05 }}
            whileTap={{ y: 3, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            {/* Ripple effect */}
            <RippleContainer ripples={ripples} color={color} />
            
            {/* Top highlight for extreme 3D bevel */}
            <div className="absolute inset-x-2 top-1.5 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full z-10" />
            
            {/* Left edge highlight */}
            <div className="absolute left-1.5 inset-y-3 w-0.5 bg-gradient-to-b from-white/30 via-white/15 to-transparent rounded-full z-10" />
            
            {/* Icon with glow */}
            <span className={`${colors.icon} relative z-10`}>{icon}</span>
            
            {/* Label */}
            <span className={`text-[11px] font-bold ${colors.text} uppercase tracking-wider relative z-10`}>
              {label}
            </span>

            {/* Bottom shadow for extreme 3D depth */}
            <div className="absolute inset-x-2 bottom-1.5 h-1.5 bg-gradient-to-r from-transparent via-black/70 to-transparent rounded-full z-10" />
            
            {/* Right edge shadow */}
            <div className="absolute right-1.5 inset-y-3 w-0.5 bg-gradient-to-b from-black/20 via-black/40 to-black/20 rounded-full z-10" />
          </motion.button>
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-slate-900 border-slate-600 text-white shadow-2xl">
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface SystemUrls {
  dashboardUrl: string;
  datasourceUrl: string;
}

export function CommandDeck({ disabled = false }: CommandDeckProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { hasPermission } = useUser();
  const { playSound } = useSoundEffects();
  const [showRebootDialog, setShowRebootDialog] = useState(false);
  const [isReloading, setIsReloading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [urls, setUrls] = useState<SystemUrls>({
    dashboardUrl: 'http://localhost:3000',
    datasourceUrl: 'http://localhost:9090',
  });

  // Load URLs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('system_urls');
    if (saved) {
      try {
        setUrls(JSON.parse(saved));
      } catch {
        // Use defaults
      }
    }
  }, []);

  // Only show for admin users
  const canAccessSystemControls = hasPermission('canAccessSystemControls');

  const handleDashboard = () => {
    window.open(urls.dashboardUrl, '_blank');
  };

  const handleDatasource = () => {
    window.open(urls.datasourceUrl, '_blank');
  };

  const handleReload = async () => {
    setIsReloading(true);
    try {
      await api.reloadServices();
      toast.success(t('commandDeck.messages.reloadSuccess'));
    } catch (error) {
      toast.error(t('commandDeck.messages.reloadError'));
    } finally {
      setIsReloading(false);
    }
  };

  const handleSetup = () => {
    navigate('/settings');
  };

  const handleReboot = async () => {
    try {
      await api.rebootSystem();
      toast.success(t('commandDeck.messages.rebootSuccess'));
    } catch (error) {
      toast.error(t('commandDeck.messages.rebootError'));
    }
    setShowRebootDialog(false);
  };

  // Don't render if user doesn't have system control permissions
  if (!canAccessSystemControls) {
    return null;
  }

  const containerVariants = {
    hidden: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        staggerDirection: -1,
        when: "afterChildren"
      }
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
        staggerDirection: 1,
      }
    }
  };

  const buttonVariants = {
    hidden: { 
      opacity: 0, 
      x: -20,
      scale: 0.8,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30
      }
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  return (
    <>
      {/* Vertical Command Deck - Left Side - Positioned near top for full visibility */}
      <motion.div
        className="fixed left-0 top-8 z-50 flex items-center"
        initial={{ x: -120, rotateY: -10 }}
        animate={{ 
          x: isExpanded ? 16 : -96,
          rotateY: isExpanded ? 0 : -5 
        }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        style={{ perspective: 1200 }}
      >
        {/* Deck Container - Ultra 3D Professional */}
        <div className="command-deck-vertical flex flex-col gap-4 p-5 rounded-r-3xl">
          {/* Admin Badge */}
          <div className="text-center mb-1">
            <span className="text-[10px] font-semibold text-label-yellow uppercase tracking-[0.2em]">
              {t('commandDeck.admin')}
            </span>
          </div>

          {/* Buttons with cascade animation */}
          <motion.div 
            className="flex flex-col gap-3"
            variants={containerVariants}
            initial="hidden"
            animate={isExpanded ? "visible" : "hidden"}
          >
            {/* Info Buttons (Cyan) */}
            <motion.div variants={buttonVariants}>
              <DeckButton
                icon={<LineChart className="w-6 h-6" />}
                label={t('commandDeck.dashboard')}
                tooltip={t('commandDeck.tooltips.dashboard')}
                onClick={handleDashboard}
                color="cyan"
                disabled={disabled}
              />
            </motion.div>
            <motion.div variants={buttonVariants}>
              <DeckButton
                icon={<Activity className="w-6 h-6" />}
                label={t('commandDeck.datasource')}
                tooltip={t('commandDeck.tooltips.datasource')}
                onClick={handleDatasource}
                color="cyan"
                disabled={disabled}
              />
            </motion.div>

            {/* Divider */}
            <motion.div variants={buttonVariants}>
              <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent my-1" />
            </motion.div>

            {/* Action Button (Amber) */}
            <motion.div variants={buttonVariants}>
              <DeckButton
                icon={<RefreshCw className={`w-6 h-6 ${isReloading ? 'animate-spin' : ''}`} />}
                label={t('commandDeck.reload')}
                tooltip={t('commandDeck.tooltips.reload')}
                onClick={handleReload}
                color="amber"
                disabled={disabled || isReloading}
              />
            </motion.div>

            {/* Setup Button (White) */}
            <motion.div variants={buttonVariants}>
              <DeckButton
                icon={<SlidersHorizontal className="w-6 h-6" />}
                label={t('commandDeck.setup')}
                tooltip={t('commandDeck.tooltips.setup')}
                onClick={handleSetup}
                color="white"
                disabled={disabled}
              />
            </motion.div>

            {/* Help Button (White) */}
            <motion.div variants={buttonVariants}>
              <DeckButton
                icon={<HelpCircle className="w-6 h-6" />}
                label={t('commandDeck.help')}
                tooltip={t('commandDeck.tooltips.help')}
                onClick={() => navigate('/help')}
                color="white"
                disabled={disabled}
              />
            </motion.div>

            {/* Divider */}
            <motion.div variants={buttonVariants}>
              <div className="h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent my-1" />
            </motion.div>

            {/* Critical Button (Red) */}
            <motion.div variants={buttonVariants}>
              <DeckButton
                icon={<Power className="w-6 h-6" />}
                label={t('commandDeck.reboot')}
                tooltip={t('commandDeck.tooltips.reboot')}
                onClick={() => setShowRebootDialog(true)}
                color="red"
                disabled={disabled}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Toggle Tab */}
        <motion.button
          onClick={() => {
            const newState = !isExpanded;
            setIsExpanded(newState);
            playSound(newState ? 'open' : 'close');
          }}
          className="command-deck-tab flex items-center justify-center w-6 h-16 rounded-r-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronRight className="w-4 h-4 text-cyan-400" />
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Reboot Confirmation Dialog */}
      <AlertDialog open={showRebootDialog} onOpenChange={setShowRebootDialog}>
        <AlertDialogContent className="bg-slate-900 border-red-500/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-400 flex items-center gap-2">
              <Power className="w-5 h-5" />
              {t('commandDeck.rebootDialog.title')}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-kiosk-text/75">
              {t('commandDeck.rebootDialog.description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 hover:bg-slate-700 button-outline-neon">
              {t('common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleReboot}
              className="bg-red-600 hover:bg-red-700 text-white button-destructive-neon"
            >
              {t('commandDeck.rebootDialog.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}