import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Music, Plus, Loader2 } from 'lucide-react';
import { AddTrackParams } from '@/hooks/jam/useJamQueue';
import { toast } from 'sonner';

interface JamAddTrackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTrack: (track: AddTrackParams) => Promise<boolean>;
}

// Demo tracks for testing
const DEMO_TRACKS = [
  {
    trackId: 'demo-1',
    trackName: 'Blinding Lights',
    artistName: 'The Weeknd',
    albumArt: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36',
    durationMs: 200000,
  },
  {
    trackId: 'demo-2',
    trackName: 'Levitating',
    artistName: 'Dua Lipa',
    albumArt: 'https://i.scdn.co/image/ab67616d0000b273bd26ede1ae69327010d49946',
    durationMs: 203000,
  },
  {
    trackId: 'demo-3',
    trackName: 'Watermelon Sugar',
    artistName: 'Harry Styles',
    albumArt: 'https://i.scdn.co/image/ab67616d0000b273f5df5b1d8f3c1b1b1b3b1b1b',
    durationMs: 174000,
  },
  {
    trackId: 'demo-4',
    trackName: 'drivers license',
    artistName: 'Olivia Rodrigo',
    albumArt: 'https://i.scdn.co/image/ab67616d0000b2738f9b7b2b2b2b2b2b2b2b2b2b',
    durationMs: 242000,
  },
  {
    trackId: 'demo-5',
    trackName: 'Save Your Tears',
    artistName: 'The Weeknd',
    albumArt: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36',
    durationMs: 215000,
  },
];

export function JamAddTrackModal({ open, onOpenChange, onAddTrack }: JamAddTrackModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState<string | null>(null);

  const filteredTracks = DEMO_TRACKS.filter(
    track =>
      track.trackName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artistName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddTrack = async (track: typeof DEMO_TRACKS[0]) => {
    setIsAdding(track.trackId);
    try {
      const success = await onAddTrack(track);
      if (success) {
        onOpenChange(false);
        setSearchQuery('');
      }
    } finally {
      setIsAdding(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Music className="w-5 h-5" />
            Adicionar Música
          </DialogTitle>
          <DialogDescription>
            Pesquise e adicione músicas à fila colaborativa
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar músicas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/50"
            />
          </div>

          {/* Results */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {filteredTracks.map((track) => (
              <motion.div
                key={track.trackId}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
              >
                {track.albumArt ? (
                  <img
                    src={track.albumArt}
                    alt={track.trackName}
                    className="w-10 h-10 rounded object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '';
                      (e.target as HTMLImageElement).className = 'hidden';
                    }}
                  />
                ) : (
                  <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                    <Music className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate text-sm">
                    {track.trackName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {track.artistName}
                  </p>
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleAddTrack(track)}
                  disabled={isAdding === track.trackId}
                  className="gap-1"
                >
                  {isAdding === track.trackId ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </Button>
              </motion.div>
            ))}

            {filteredTracks.length === 0 && searchQuery && (
              <p className="text-center text-sm text-muted-foreground py-4">
                Nenhuma música encontrada
              </p>
            )}
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Demo: Estas são músicas de exemplo para teste
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
