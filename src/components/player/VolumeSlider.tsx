import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Volume, Volume1, Volume2, VolumeX } from 'lucide-react';
import { useVolume } from '@/hooks/useVolume';
import { cn } from '@/lib/utils';

interface VolumeSliderProps {
  volume: number;
  muted: boolean;
}

export function VolumeSlider({ volume, muted }: VolumeSliderProps) {
  const { setVolume, toggleMute, isLoading } = useVolume();

  const getVolumeIcon = () => {
    if (muted || volume === 0) return VolumeX;
    if (volume < 33) return Volume;
    if (volume < 66) return Volume1;
    return Volume2;
  };

  const VolumeIcon = getVolumeIcon();

  return (
    <motion.div 
      className="flex items-center gap-4 w-full max-w-md px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => toggleMute(!muted)}
          disabled={isLoading}
          className={cn(
            "w-12 h-12 rounded-full shrink-0",
            "bg-kiosk-surface/30 hover:bg-kiosk-surface/50",
            "text-kiosk-text/70 hover:text-kiosk-text",
            "transition-colors duration-200",
            muted && "text-destructive hover:text-destructive"
          )}
        >
          <motion.div
            key={muted ? 'muted' : 'unmuted'}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <VolumeIcon className="w-5 h-5" />
          </motion.div>
        </Button>
      </motion.div>

      <div className="flex-1 relative">
        {/* Volume level indicator background */}
        <motion.div
          className="absolute inset-y-0 left-0 bg-kiosk-primary/20 rounded-full"
          animate={{ width: `${muted ? 0 : volume}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          style={{ height: '100%' }}
        />
        
        <Slider
          value={[muted ? 0 : volume]}
          onValueChange={([value]) => setVolume(value)}
          max={100}
          step={1}
          disabled={isLoading}
          className="relative z-10"
        />
      </div>

      <motion.span 
        className="text-sm font-medium text-kiosk-text/70 w-12 text-right tabular-nums"
        key={muted ? 0 : volume}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {muted ? 0 : volume}%
      </motion.span>
    </motion.div>
  );
}
