import { HeartRateStatus, HeartRateRange } from '@/types';

// Define heart rate ranges for different statuses
const HEART_RATE_RANGES: HeartRateRange[] = [
  { min: 60, max: 100, status: 'normal' },
  { min: 40, max: 59, status: 'warning' },
  { min: 101, max: 120, status: 'warning' },
  { min: 0, max: 39, status: 'critical' },
  { min: 121, max: 300, status: 'critical' },
];

/**
 * Determine heart rate status based on BPM value
 */
export function getHeartRateStatus(bpm: number): HeartRateStatus {
  for (const range of HEART_RATE_RANGES) {
    if (bpm >= range.min && bpm <= range.max) {
      return range.status;
    }
  }
  return 'critical'; // Default to critical if outside all defined ranges
}

/**
 * Format a timestamp into a readable date/time string
 */
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}