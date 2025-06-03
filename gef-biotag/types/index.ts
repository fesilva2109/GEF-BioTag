export interface Patient {
  id: string;
  name: string;
  address: string;
  bracelet: Bracelet;
  shelterId: string;
  createdAt: number;
  updatedAt: number;
}

export interface Bracelet {
  id: string;
  rfid: RFID;
  nfc: NFC;
  iotHeartRate: IOTHeartRate;
}

export interface RFID {
  id: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface NFC {
  id: string;
  information: string[];
}

export interface IOTHeartRate {
  id: string;
  bpm: number;
  timestamp: number;
}

export interface Shelter {
  id: string;
  name: string;
  address: string;
  capacity: number;
  patients?: string[]; // Array of patient IDs
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: 'rescuer' | 'admin' | 'medical';
  token?: string;
}

export type HeartRateStatus = 'normal' | 'warning' | 'critical';

export interface ConnectionStatus {
  online: boolean;
  lastSynced: number | null;
}

export type HeartRateRange = {
  min: number;
  max: number;
  status: HeartRateStatus;
};