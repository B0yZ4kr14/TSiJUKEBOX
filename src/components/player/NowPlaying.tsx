import { Disc3 } from 'lucide-react';
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
      {/* Album Cover with Vinyl Effect */}
      <div className="relative">
        {/* Outer glow when playing */}
        <motion.div
          className="absolute -inset-4 rounded-full bg-kiosk-primary/20 blur-xl"
          animate={{
            opacity: isPlaying ? [0.3, 0.5, 0.3] : 0,
            scale: isPlaying ? [1, 1.05, 1] : 1,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Vinyl disc background */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'repeating-radial-gradient(circle at center, transparent 0px, transparent 2px, rgba(255,255,255,0.03) 3px, transparent 4px)',
          }}
          animate={{
            rotate: isPlaying ? 360 : 0,
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Main album cover */}
        <motion.div 
          className={cn(
            "w-72 h-72 md:w-80 md:h-80 rounded-full overflow-hidden",
            "bg-kiosk-surface border-4 border-kiosk-surface/50",
            "shadow-2xl shadow-black/50",
            "flex items-center justify-center relative z-10"
          )}
          animate={{
            rotate: isPlaying ? 360 : 0,
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
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
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
              />
            ) : (
              <motion.div 
                key="placeholder"
                className="w-full h-full bg-gradient-to-br from-kiosk-surface to-kiosk-bg flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Disc3 className="w-32 h-32 text-kiosk-primary/50" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Center hole effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-kiosk-bg border-4 border-kiosk-surface/30 z-20 shadow-inner" />
        
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-kiosk-primary z-20" />

        {/* Playing pulse ring */}
        {isPlaying && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-kiosk-primary/30"
            animate={{
              scale: [1, 1.15],
              opacity: [0.5, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        )}
      </div>

      {/* Track Info with animations */}
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
