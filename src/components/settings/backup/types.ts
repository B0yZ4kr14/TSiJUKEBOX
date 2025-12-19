// Backup module types

export type BackupProvider = 'local' | 'cloud' | 'distributed';
export type BackupType = 'full' | 'incremental';
export type BackupStatus = 'pending' | 'completed' | 'failed' | 'syncing';
export type CloudProvider = 'aws' | 'gdrive' | 'dropbox' | 'mega' | 'onedrive' | 'storj';
export type BackupStrategy = 'round-robin' | 'mirror-all' | 'primary-secondary';
export type SyncSchedule = 'hourly' | 'daily' | 'weekly';
export type CompressionLevel = 'none' | 'fast' | 'best';

export interface BackupItem {
  id: string;
  name: string;
  type: BackupType;
  size: string;
  date: string;
  provider: BackupProvider;
  status: BackupStatus;
}

export interface CloudConfig {
  provider: CloudProvider | '';
  awsBucket?: string;
  awsAccessKey?: string;
  awsSecretKey?: string;
  awsRegion?: string;
  megaEmail?: string;
  megaPassword?: string;
  storjAccessGrant?: string;
  isOAuthConnected?: boolean;
}

export interface ScheduleConfig {
  enabled: boolean;
  frequency: SyncSchedule;
  time: string;
  retention: number;
  providers: BackupProvider[];
}

export interface DistributedConfig {
  enabled: boolean;
  strategy: BackupStrategy;
  primaryClientId: string;
  replicaCount: number;
  syncSchedule: SyncSchedule;
  encryptBackups: boolean;
  compressionLevel: CompressionLevel;
}

export interface BackupReplica {
  clientId: string;
  clientName: string;
  lastSync: string | null;
  status: BackupStatus;
  size: string;
}

export interface BackupHistoryItem {
  id: string;
  provider: BackupProvider;
  type: BackupType;
  status: BackupStatus;
  size: string;
  date: string;
  duration?: number;
}

export interface BackupManagerState {
  backups: Record<BackupProvider, BackupItem[]>;
  history: BackupHistoryItem[];
  cloudConfig: CloudConfig;
  scheduleConfig: ScheduleConfig;
  distributedConfig: DistributedConfig;
  replicas: BackupReplica[];
}
