import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, FileCode, ChevronUp, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DetectedFile {
  path: string;
  timestamp: number;
}

interface DevFileChangeMonitorProps {
  /** Files detected for sync */
  detectedFiles?: DetectedFile[];
  /** Whether detection is active */
  isDetecting?: boolean;
  /** Callback when starting detection */
  onStartDetection?: () => void;
  /** Last detection timestamp */
  lastDetection?: Date | null;
}

/**
 * DevFileChangeMonitor - Floating badge showing pending files for sync
 * Only visible in development mode when there are detected files
 */
export function DevFileChangeMonitor({
  detectedFiles = [],
  isDetecting = false,
  onStartDetection,
  lastDetection,
}: DevFileChangeMonitorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Auto-start detection on mount
  useEffect(() => {
    if (onStartDetection) {
      onStartDetection();
      console.log('[DevFileChangeMonitor] Auto-started file change detection');
    }
  }, [onStartDetection]);

  // Don't render if no files detected
  if (detectedFiles.length === 0) {
    return null;
  }

  const fileCount = detectedFiles.length;
  const pluralSuffix = fileCount === 1 ? '' : 's';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="fixed bottom-20 left-4 z-50"
    >
      {/* Main Badge */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-full shadow-lg",
          "bg-amber-500/90 hover:bg-amber-400 text-black",
          "transition-all duration-200 cursor-pointer",
          "border border-amber-600/30",
          "focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-background"
        )}
        aria-expanded={isExpanded}
        aria-label={`${fileCount} arquivo${pluralSuffix} pendente${pluralSuffix} para sync`}
      >
        <RefreshCw 
          className={cn(
            "h-4 w-4 transition-transform",
            isDetecting && "animate-spin"
          )} 
        />
        
        <Badge 
          variant="secondary" 
          className="bg-black/20 text-white font-bold px-2 py-0.5 text-xs"
        >
          {fileCount}
        </Badge>
        
        <span className="text-sm font-medium">
          arquivo{pluralSuffix} para sync
        </span>
        
        {isExpanded ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronUp className="h-4 w-4" />
        )}
      </button>

      {/* Expanded File List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: -10 }}
            animate={{ height: 'auto', opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="mt-2 overflow-hidden"
          >
            <div className="bg-background/95 backdrop-blur-sm rounded-lg shadow-xl border border-border p-3 max-h-48 overflow-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-border">
                <span className="text-xs font-medium text-muted-foreground">
                  Arquivos detectados
                </span>
                {lastDetection && (
                  <span className="text-xs text-muted-foreground">
                    {formatTimeAgo(lastDetection)}
                  </span>
                )}
              </div>
              
              {/* File List */}
              <ul className="space-y-1">
                {detectedFiles.map((file) => (
                  <li 
                    key={file.path}
                    className="flex items-center gap-2 text-xs py-1 px-2 rounded hover:bg-muted/50 transition-colors"
                  >
                    <FileCode className="h-3 w-3 text-amber-500 flex-shrink-0" />
                    <span className="truncate text-foreground" title={file.path}>
                      {file.path}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * Format a date as relative time (e.g., "2 min atrás")
 */
function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  
  if (seconds < 60) {
    return 'agora';
  }
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} min atrás`;
  }
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h atrás`;
  }
  
  return date.toLocaleDateString('pt-BR');
}

export default DevFileChangeMonitor;
