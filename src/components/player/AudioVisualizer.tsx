import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AudioVisualizerProps {
  isPlaying: boolean;
  barCount?: number;
  className?: string;
}

export function AudioVisualizer({ 
  isPlaying, 
  barCount = 32,
  className 
}: AudioVisualizerProps) {
  const [bars, setBars] = useState<number[]>(() => 
    Array(barCount).fill(0).map(() => Math.random() * 0.3 + 0.1)
  );
  const animationRef = useRef<number>();
  const lastUpdateRef = useRef<number>(0);

  useEffect(() => {
    if (!isPlaying) {
      // Fade out bars when not playing
      setBars(prev => prev.map(h => Math.max(h * 0.95, 0.05)));
      return;
    }

    const animate = (timestamp: number) => {
      // Throttle to ~30fps for performance
      if (timestamp - lastUpdateRef.current < 33) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastUpdateRef.current = timestamp;

      setBars(prev => prev.map((_, i) => {
        // Create wave-like pattern
        const wave = Math.sin(timestamp / 500 + i * 0.3) * 0.2;
        const random = Math.random() * 0.4;
        const centerBoost = 1 - Math.abs(i - barCount / 2) / (barCount / 2) * 0.3;
        return Math.min(Math.max(0.1, (0.3 + wave + random) * centerBoost), 1);
      }));

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, barCount]);

  return (
    <div className={cn(
      "flex items-end justify-center gap-[2px] h-16",
      className
    )}>
      {bars.map((height, i) => (
        <motion.div
          key={i}
          className="w-1.5 rounded-full bg-gradient-to-t from-kiosk-primary to-kiosk-primary/50"
          initial={{ height: '10%' }}
          animate={{ 
            height: `${height * 100}%`,
            opacity: isPlaying ? 0.8 + height * 0.2 : 0.3,
          }}
          transition={{ 
            type: 'spring',
            stiffness: 300,
            damping: 20,
          }}
        />
      ))}
    </div>
  );
}
