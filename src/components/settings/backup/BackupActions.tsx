import { Download, HardDrive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { BackupType } from './types';

interface BackupActionsProps {
  onBackup: (type: BackupType) => void;
  isLoading?: boolean;
  disabled?: boolean;
  showIncremental?: boolean;
}

export function BackupActions({ 
  onBackup, 
  isLoading = false, 
  disabled = false,
  showIncremental = true 
}: BackupActionsProps) {
  return (
    <div className="flex gap-2">
      <Button
        onClick={() => onBackup('full')}
        disabled={disabled || isLoading}
        className="flex-1 button-primary-glow-3d ripple-effect"
      >
        {isLoading ? (
          <HardDrive className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Download className="w-4 h-4 mr-2" />
        )}
        Backup Completo
      </Button>
      
      {showIncremental && (
        <Button
          onClick={() => onBackup('incremental')}
          disabled={disabled || isLoading}
          className="flex-1 button-outline-neon ripple-effect"
        >
          {isLoading ? (
            <HardDrive className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          Incremental
        </Button>
      )}
    </div>
  );
}
