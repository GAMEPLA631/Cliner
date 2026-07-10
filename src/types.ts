export interface LogMessage {
  timestamp: string;
  type: 'info' | 'success' | 'warn' | 'error';
  text: string;
}

export interface CleanerModule {
  id: string;
  name: string;
  path: string;
  scanned: boolean;
  itemCount: number;
  sizeInBytes: number;
  description: string;
}

export interface RegistryIssue {
  id: string;
  hive: string;
  key: string;
  valueName: string;
  reason: string;
  fixed: boolean;
}

export interface SystemInfoData {
  osName: string;
  architecture: string;
  cpuName: string;
  totalDisk: number; // GB
  usedDisk: number; // GB
  freeDisk: number; // GB
  totalRam: number; // GB
  usedRam: number; // GB
  freeRam: number; // GB
}
