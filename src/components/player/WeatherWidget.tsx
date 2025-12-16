import { motion } from 'framer-motion';
import { Cloud, MapPin, Droplets, Wind, RefreshCw, AlertCircle } from 'lucide-react';
import { useWeather } from '@/hooks/useWeather';
import { useSettings } from '@/contexts/SettingsContext';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function WeatherWidget() {
  const { weather: weatherSettings } = useSettings();
  const { weather, isLoading, error, refresh } = useWeather({
    city: weatherSettings.city,
    apiKey: weatherSettings.apiKey,
  });

  // Don't render if not configured
  if (!weatherSettings.isEnabled || !weatherSettings.apiKey || !weatherSettings.city) {
    return null;
  }

  if (error) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg badge-3d bg-destructive/20">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <span className="text-xs text-destructive">Erro</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{error}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (isLoading && !weather) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg badge-3d">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <RefreshCw className="w-4 h-4 text-kiosk-text/50" />
        </motion.div>
        <span className="text-xs text-kiosk-text/50">Carregando...</span>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className={cn(
              "flex items-center gap-3 px-4 py-2 rounded-xl",
              "weather-widget-3d cursor-pointer"
            )}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={refresh}
          >
            {/* Weather Icon */}
            <motion.span
              className="text-2xl"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {weather.icon}
            </motion.span>

            {/* Temperature & Location */}
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-kiosk-text">
                  {weather.temperature}°C
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-kiosk-text/60">
                <MapPin className="w-3 h-3" />
                <span>{weather.location}</span>
              </div>
            </div>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-kiosk-surface border-kiosk-surface/50 p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-3xl">{weather.icon}</span>
              <div>
                <p className="font-semibold text-kiosk-text">{weather.condition}</p>
                <p className="text-xs text-kiosk-text/60">
                  Sensação: {weather.feelsLike}°C
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-kiosk-text/80">
              <div className="flex items-center gap-1">
                <Droplets className="w-4 h-4 text-blue-400" />
                <span>{weather.humidity}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Wind className="w-4 h-4 text-cyan-400" />
                <span>{weather.windSpeed} km/h</span>
              </div>
            </div>

            <div className="text-xs text-kiosk-text/40 pt-1 border-t border-kiosk-surface">
              {weather.location}, {weather.region} - {weather.country}
              <br />
              Atualizado: {weather.updatedAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
