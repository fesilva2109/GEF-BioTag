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
  nfc: NFC;
  iotHeartRate: IOTHeartRate;
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
  address: {
    [x: string]: any;
    street?: string;
    number?: string;
    city?: string;
    state?: string;
    latitude: number;
    longitude: number;
  };
  capacity: number;
  patients?: string[]; 
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: 'rescuer' | 'admin' | 'medical';
  token?: string;
}

export type HeartRateStatus = 'normal' | 'warning' | 'critical';

export type HeartRateRange = {
  min: number;
  max: number;
  status: HeartRateStatus;
};