import { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Patient, Shelter, ConnectionStatus } from '@/types';
import { mockShelters } from '@/data/mockShelters';
import { mockPatients } from '@/data/mockPatients';
import { apiService } from '@/services/apiService';

interface DataContextType {
  patients: Patient[];
  shelters: Shelter[];
  connectionStatus: ConnectionStatus;
  lastSyncTime: number | null;
  unsyncedPatientsCount: number;
  addPatient: (patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt' | 'synced'>) => Promise<Patient>;
  updatePatientHeartRate: (patientId: string, bpm: number) => Promise<void>;
  removePatient: (patientId: string) => Promise<void>;
  syncData: () => Promise<void>;
}

export const DataContext = createContext<DataContextType>({
  patients: [],
  shelters: [],
  connectionStatus: { online: false, lastSynced: null },
  lastSyncTime: null,
  unsyncedPatientsCount: 0,
  addPatient: async () => ({ id: '', name: '', address: '', bracelet: { id: '', rfid: { id: '', coordinates: { latitude: 0, longitude: 0 } }, nfc: { id: '', information: [] }, iotHeartRate: { id: '', bpm: 0, timestamp: 0 } }, shelterId: '', createdAt: 0, updatedAt: 0, synced: false }),
  updatePatientHeartRate: async () => {},
  removePatient: async () => {},
  syncData: async () => {},
});

interface DataProviderProps {
  children: ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({ online: false, lastSynced: null });
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null);
  
  useEffect(() => {
    // Load initial data
    loadData();
    
    // Check connection status periodically
    const intervalId = setInterval(checkConnectionStatus, 5000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const loadData = async () => {
    try {
      // Try to load data from storage first
      const storedPatients = await AsyncStorage.getItem('@patients');
      const storedShelters = await AsyncStorage.getItem('@shelters');
      const storedLastSync = await AsyncStorage.getItem('@lastSyncTime');
      
      if (storedPatients) {
        setPatients(JSON.parse(storedPatients));
      } else {
        // If no stored data, use mock data
        setPatients(mockPatients);
        await AsyncStorage.setItem('@patients', JSON.stringify(mockPatients));
      }
      
      if (storedShelters) {
        setShelters(JSON.parse(storedShelters));
      } else {
        // If no stored shelters, use mock data
        setShelters(mockShelters);
        await AsyncStorage.setItem('@shelters', JSON.stringify(mockShelters));
      }
      
      if (storedLastSync) {
        setLastSyncTime(JSON.parse(storedLastSync));
      }
      
      // Check connection initially
      await checkConnectionStatus();
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };
  
  const checkConnectionStatus = async () => {
    try {
      const isOnline = await apiService.checkConnection();
      setConnectionStatus(prev => ({ ...prev, online: isOnline }));
    } catch (error) {
      setConnectionStatus(prev => ({ ...prev, online: false }));
    }
  };
  
  const addPatient = async (patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt' | 'synced'>): Promise<Patient> => {
    try {
      const timestamp = Date.now();
      const newPatient: Patient = {
        id: 'p-' + Math.random().toString(36).substr(2, 9),
        ...patientData,
        createdAt: timestamp,
        updatedAt: timestamp,
        synced: connectionStatus.online,
      };
      
      // Update local state
      const updatedPatients = [...patients, newPatient];
      setPatients(updatedPatients);
      
      // Save to local storage
      await AsyncStorage.setItem('@patients', JSON.stringify(updatedPatients));
      
      // If online, sync with server
      if (connectionStatus.online) {
        try {
          await apiService.createPatient(newPatient);
        } catch (error) {
          // If API call fails, mark as unsynced
          const fixedPatients = updatedPatients.map(p => 
            p.id === newPatient.id ? { ...p, synced: false } : p
          );
          setPatients(fixedPatients);
          await AsyncStorage.setItem('@patients', JSON.stringify(fixedPatients));
        }
      }
      
      return newPatient;
    } catch (error) {
      console.error('Error adding patient:', error);
      throw error;
    }
  };
  
  const updatePatientHeartRate = async (patientId: string, bpm: number): Promise<void> => {
    try {
      const timestamp = Date.now();
      
      // Update local state
      const updatedPatients = patients.map(patient => {
        if (patient.id === patientId) {
          return {
            ...patient,
            bracelet: {
              ...patient.bracelet,
              iotHeartRate: {
                ...patient.bracelet.iotHeartRate,
                bpm,
                timestamp
              }
            },
            updatedAt: timestamp,
            synced: connectionStatus.online,
          };
        }
        return patient;
      });
      
      setPatients(updatedPatients);
      
      // Save to local storage
      await AsyncStorage.setItem('@patients', JSON.stringify(updatedPatients));
      
      // If online, sync with server
      if (connectionStatus.online) {
        try {
          const patient = updatedPatients.find(p => p.id === patientId);
          if (patient) {
            await apiService.updatePatient(patient);
          }
        } catch (error) {
          // If API call fails, mark as unsynced
          const fixedPatients = updatedPatients.map(p => 
            p.id === patientId ? { ...p, synced: false } : p
          );
          setPatients(fixedPatients);
          await AsyncStorage.setItem('@patients', JSON.stringify(fixedPatients));
        }
      }
    } catch (error) {
      console.error('Error updating heart rate:', error);
      throw error;
    }
  };
  
  const removePatient = async (patientId: string): Promise<void> => {
    try {
      // Update local state
      const updatedPatients = patients.filter(patient => patient.id !== patientId);
      setPatients(updatedPatients);
      
      // Save to local storage
      await AsyncStorage.setItem('@patients', JSON.stringify(updatedPatients));
      
      // If online, sync with server
      if (connectionStatus.online) {
        try {
          await apiService.deletePatient(patientId);
        } catch (error) {
          console.error('Error deleting patient from server:', error);
          // No need to revert local deletion if server delete fails
        }
      }
    } catch (error) {
      console.error('Error removing patient:', error);
      throw error;
    }
  };
  
  const syncData = async (): Promise<void> => {
    if (!connectionStatus.online) {
      return Promise.reject(new Error('Offline, cannot sync'));
    }
    
    try {
      // Find patients that need syncing
      const unsyncedPatients = patients.filter(patient => !patient.synced);
      
      if (unsyncedPatients.length === 0) {
        const syncTime = Date.now();
        setLastSyncTime(syncTime);
        setConnectionStatus(prev => ({ ...prev, lastSynced: syncTime }));
        await AsyncStorage.setItem('@lastSyncTime', JSON.stringify(syncTime));
        return;
      }
      
      // Sync each unsynced patient
      for (const patient of unsyncedPatients) {
        await apiService.updatePatient(patient);
      }
      
      // Mark all as synced
      const syncedPatients = patients.map(patient => ({ ...patient, synced: true }));
      setPatients(syncedPatients);
      
      // Update sync time
      const syncTime = Date.now();
      setLastSyncTime(syncTime);
      setConnectionStatus(prev => ({ ...prev, lastSynced: syncTime }));
      
      // Save to storage
      await AsyncStorage.setItem('@patients', JSON.stringify(syncedPatients));
      await AsyncStorage.setItem('@lastSyncTime', JSON.stringify(syncTime));
    } catch (error) {
      console.error('Error syncing data:', error);
      throw error;
    }
  };
  
  const unsyncedPatientsCount = patients.filter(p => !p.synced).length;
  
  return (
    <DataContext.Provider value={{
      patients,
      shelters,
      connectionStatus,
      lastSyncTime,
      unsyncedPatientsCount,
      addPatient,
      updatePatientHeartRate,
      removePatient,
      syncData,
    }}>
      {children}
    </DataContext.Provider>
  );
}