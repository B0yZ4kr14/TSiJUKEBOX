import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

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
    <Popover>
      <PopoverTrigger asChild>
        <motion.div 
          className={cn(
            "flex items-center gap-3 badge-3d px-4 py-1.5 rounded-xl min-w-[180px] cursor-pointer",
            "hover:scale-105 transition-transform duration-200",
            className
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-3 w-full justify-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={timeKey}
                initial={{ opacity: 0.6, y: -2 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0.6, y: 2 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="text-lg font-mono font-bold tabular-nums tracking-wider text-gold-neon clock-gold"
              >
                {timeKey}
              </motion.span>
            </AnimatePresence>
            
            {showDate && (
              <>
                <div className="w-px h-4 bg-cyan-500/30" />
                <span className="text-[10px] uppercase tracking-wide font-medium clock-date-neon whitespace-nowrap">
                  {formatDate()}
                </span>
              </>
            )}
          </div>
        </motion.div>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0 bg-slate-900/95 border-cyan-500/40 backdrop-blur-sm" 
        align="center"
        sideOffset={8}
      >
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="calendar-neon pointer-events-auto"
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
