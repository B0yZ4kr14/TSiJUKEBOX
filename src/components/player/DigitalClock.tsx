import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DigitalClockProps {
  showSeconds?: boolean;
  showDate?: boolean;
  className?: string;
}

export function DigitalClock({ 
  showSeconds = false, 
  showDate = true,
  className = '' 
}: DigitalClockProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = () => {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      ...(showSeconds && { second: '2-digit' }),
      hour12: false,
    };
    return time.toLocaleTimeString('pt-BR', options);
  };

  const formatDate = () => {
    return time.toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  const timeKey = formatTime();

  return (
    <div className={cn(
      "flex items-center gap-4 badge-3d px-6 py-2.5 rounded-2xl min-w-[200px]",
      className
    )}>
      <div className="flex flex-col items-center w-full">
        <AnimatePresence mode="wait">
          <motion.span
            key={timeKey}
            initial={{ opacity: 0.6, y: -3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0.6, y: 3 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={cn(
              "text-xl font-mono font-bold tabular-nums tracking-wider",
              "text-gold-neon clock-gold"
            )}
          >
            {timeKey}
          </motion.span>
        </AnimatePresence>
        {showDate && (
          <span className="text-[11px] uppercase tracking-wide font-medium clock-date-neon">
            {formatDate()}
          </span>
        )}
      </div>
    </div>
  );
}
