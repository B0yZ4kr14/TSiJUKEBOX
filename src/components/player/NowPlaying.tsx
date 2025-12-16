import { Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TrackInfo } from '@/lib/api/types';
import { cn } from '@/lib/utils';

interface NowPlayingProps {
  track: TrackInfo | null;
  isPlaying: boolean;
}

export function NowPlaying({ track, isPlaying }: NowPlayingProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Album Cover - Static with subtle effects */}
      <div className="relative">
        {/* Outer glow when playing */}
        <motion.div
          className="absolute -inset-6 rounded-2xl bg-kiosk-primary/20 blur-2xl"
          animate={{
            opacity: isPlaying ? [0.2, 0.4, 0.2] : 0.1,
            scale: isPlaying ? [1, 1.02, 1] : 1,
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Shadow layer for depth */}
        <div className="absolute -inset-2 rounded-2xl bg-black/40 blur-xl" />

        {/* Main album cover - NO ROTATION */}
        <motion.div 
          className={cn(
            "w-72 h-72 md:w-80 md:h-80 rounded-2xl overflow-hidden relative z-10",
            "bg-kiosk-surface border border-white/10",
            "shadow-2xl shadow-black/60"
          )}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            boxShadow: isPlaying 
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 60px -15px hsl(var(--kiosk-primary) / 0.3)'
              : '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence mode="wait">
            {track?.cover ? (
              <motion.img
                key={track.cover}
                src={track.cover}
                alt={`${track.title} - ${track.artist}`}
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              />
            ) : (
              <motion.div 
                key="placeholder"
                className="w-full h-full bg-gradient-to-br from-kiosk-surface to-kiosk-bg flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Music className="w-24 h-24 text-kiosk-primary/40" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Subtle overlay gradient for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/5 pointer-events-none" />
        </motion.div>

        {/* Playing indicator - subtle pulse at corner */}
        {isPlaying && (
          <motion.div
            className="absolute -bottom-2 -right-2 w-4 h-4 rounded-full bg-kiosk-primary z-20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </div>

      {/* Track Info */}
      <div className="text-center space-y-2 max-w-md">
        <AnimatePresence mode="wait">
          <motion.h2 
            key={track?.title || 'no-track'}
            className="text-2xl md:text-3xl font-bold text-kiosk-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {track?.title || 'Nenhuma faixa'}
          </motion.h2>
        </AnimatePresence>
        
        <AnimatePresence mode="wait">
          <motion.p 
            key={track?.artist || 'no-artist'}
            className="text-lg text-kiosk-text/70"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {track?.artist || 'Aguardando...'}
          </motion.p>
        </AnimatePresence>
        
        <AnimatePresence>
          {track?.album && (
            <motion.p 
              key={track.album}
              className="text-sm text-kiosk-text/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {track.album}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
