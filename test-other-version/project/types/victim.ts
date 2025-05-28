export interface Victim {
  id: string;
  name: string;
  familyGroup?: string;
  location: string;
  status: 'stable' | 'atrisk' | 'critical';
  observations?: string;
  heartRate?: number | null;
  lastUpdated: string;
  needsSync: boolean;
}