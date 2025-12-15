import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { KioskLayout } from '@/components/layout/KioskLayout';
import { NowPlaying } from '@/components/player/NowPlaying';
import { PlayerControls } from '@/components/player/PlayerControls';
import { VolumeSlider } from '@/components/player/VolumeSlider';
import { SystemMonitor } from '@/components/player/SystemMonitor';
import { AudioVisualizer } from '@/components/player/AudioVisualizer';
import { useStatus } from '@/hooks/useStatus';
import { Button } from '@/components/ui/button';
import { Settings, Loader2, Music } from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const loadingVariants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: { duration: 0.5 }
  },
};

export default function Index() {
  const { data: status, isLoading, error } = useStatus();

  if (isLoading && !status) {
    return (
      <KioskLayout>
        <motion.div 
          className="h-screen flex items-center justify-center"
          variants={loadingVariants}
          initial="initial"
          animate="animate"
        >
          <div className="text-center space-y-6">
            {/* Animated logo */}
            <motion.div
              className="relative mx-auto"
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <div className="w-24 h-24 rounded-full bg-kiosk-surface flex items-center justify-center">
                <Music className="w-12 h-12 text-kiosk-primary" />
              </div>
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-kiosk-primary border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-2xl font-bold text-kiosk-text mb-2">TSi JUKEBOX</h1>
              <p className="text-kiosk-text/70">Conectando ao servidor...</p>
            </motion.div>
          </div>
        </motion.div>
      </KioskLayout>
    );
  }

  if (error) {
    return (
      <KioskLayout>
        <motion.div 
          className="h-screen flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-center space-y-4 max-w-md px-4">
            <motion.div 
              className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center mx-auto"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <span className="text-4xl">⚠️</span>
            </motion.div>
            <h2 className="text-2xl font-bold text-kiosk-text">Erro de Conexão</h2>
            <p className="text-kiosk-text/70">
              Não foi possível conectar ao servidor em <br />
              <code className="text-kiosk-primary">https://midiaserver.local/api</code>
            </p>
            <p className="text-sm text-kiosk-text/50">
              Verifique se o backend FastAPI está em execução.
            </p>
          </div>
        </motion.div>
      </KioskLayout>
    );
  }

  return (
    <KioskLayout>
      <AnimatePresence mode="wait">
        <motion.div 
          className="h-screen flex flex-col"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {/* Header */}
          <motion.header 
            className="flex items-center justify-between p-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SystemMonitor 
              cpu={status?.cpu ?? 0} 
              memory={status?.memory ?? 0} 
              temp={status?.temp ?? 0} 
            />
            
            <Link to="/login">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 rounded-full bg-kiosk-surface/30 hover:bg-kiosk-surface/50 text-kiosk-text/50 hover:text-kiosk-text transition-colors"
                >
                  <Settings className="w-5 h-5" />
                </Button>
              </motion.div>
            </Link>
          </motion.header>

          {/* Main Content */}
          <main className="flex-1 flex flex-col items-center justify-center gap-6 px-4 pb-8">
            <NowPlaying 
              track={status?.track ?? null} 
              isPlaying={status?.playing ?? false} 
            />

            {/* Audio Visualizer */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="w-full max-w-md"
            >
              <AudioVisualizer 
                isPlaying={status?.playing ?? false} 
                barCount={48}
              />
            </motion.div>
            
            <PlayerControls isPlaying={status?.playing ?? false} />
            
            <VolumeSlider 
              volume={status?.volume ?? 75} 
              muted={status?.muted ?? false} 
            />
          </main>

          {/* Footer branding */}
          <motion.footer 
            className="pb-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-xs text-kiosk-text/30">
              TSi JUKEBOX Enterprise v4.0
            </p>
          </motion.footer>
        </motion.div>
      </AnimatePresence>
    </KioskLayout>
  );
}
