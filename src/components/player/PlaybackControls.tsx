import { Shuffle, Repeat, Repeat1, ListMusic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PlaybackControlsProps {
  shuffle: boolean;
  repeat: 'off' | 'track' | 'context';
  onShuffleToggle: () => void;
  onRepeatToggle: () => void;
  onQueueOpen: () => void;
  disabled?: boolean;
}

export function PlaybackControls({
  shuffle,
  repeat,
  onShuffleToggle,
  onRepeatToggle,
  onQueueOpen,
  disabled,
}: PlaybackControlsProps) {
  return (
    <div className="flex items-center gap-2">
      {/* Shuffle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onShuffleToggle}
        disabled={disabled}
        className={cn(
          "w-10 h-10 rounded-full transition-colors",
          shuffle
            ? "text-[#1DB954] hover:text-[#1DB954]/80"
            : "text-kiosk-text/50 hover:text-kiosk-text"
        )}
        title={shuffle ? "Shuffle: Ligado" : "Shuffle: Desligado"}
      >
        <Shuffle className="w-5 h-5" />
      </Button>

      {/* Repeat */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onRepeatToggle}
        disabled={disabled}
        className={cn(
          "w-10 h-10 rounded-full transition-colors",
          repeat !== 'off'
            ? "text-[#1DB954] hover:text-[#1DB954]/80"
            : "text-kiosk-text/50 hover:text-kiosk-text"
        )}
        title={
          repeat === 'off' ? "Repeat: Desligado" :
          repeat === 'track' ? "Repeat: Faixa" : "Repeat: Contexto"
        }
      >
        {repeat === 'track' ? (
          <Repeat1 className="w-5 h-5" />
        ) : (
          <Repeat className="w-5 h-5" />
        )}
      </Button>

      {/* Queue */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onQueueOpen}
        disabled={disabled}
        className="w-10 h-10 rounded-full text-kiosk-text/50 hover:text-kiosk-text transition-colors"
        title="Fila de reprodução"
      >
        <ListMusic className="w-5 h-5" />
      </Button>
    </div>
  );
}
