import { mockShelters } from '@/data/mockShelters';
import { apiService } from '@/services/apiService';
import { Patient, Shelter } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { Alert } from 'react-native';

interface DataContextType {
  patients: Patient[];
  shelters: Shelter[];
  addPatient: (patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt' | 'synced'>) => Promise<Patient>;
  updatePatientHeartRate: (patientId: string, bpm: number) => Promise<void>;
  updatePatient: (updatedPatient: Patient) => Promise<void>;
  removePatient: (patientId: string) => Promise<void>;
  isOffline: boolean;
}

export const DataContext = createContext<DataContextType>({
  patients: [],
  shelters: [],
  addPatient: async () => ({ id: '', name: '', address: '', bracelet: { id: '', rfid: { id: '', coordinates: { latitude: 0, longitude: 0 } }, nfc: { id: '', information: [] }, iotHeartRate: { id: '', bpm: 0, timestamp: 0 } }, shelterId: '', createdAt: 0, updatedAt: 0, synced: false }),
  updatePatientHeartRate: async () => { },
  updatePatient: async () => { },
  removePatient: async () => { },
  isOffline: false,
});

interface DataProviderProps {
  children: ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setShelters(mockShelters);
      const apiPatients = await apiService.getPatients();
      setPatients(apiPatients);
      await AsyncStorage.setItem('@patients', JSON.stringify(apiPatients));
      setIsOffline(false);
    } catch (error) {
      setIsOffline(true);
      Alert.alert(
        'Erro de Conexão',
        'Não foi possível conectar à API. Você pode continuar usando o app localmente.'
      );
      // Carrega pacientes do armazenamento local
      const localPatients = await AsyncStorage.getItem('@patients');
      if (localPatients) setPatients(JSON.parse(localPatients));
    }
  };

  const addPatient = async (patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt' | 'synced'>): Promise<Patient> => {
    const timestamp = Date.now();
    const newPatient: Patient = {
      id: 'p-' + Math.random().toString(36).substr(2, 9),
      ...patientData,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    try {
      if (isOffline) {
        const updatedPatients = [...patients, newPatient];
        setPatients(updatedPatients);
        await AsyncStorage.setItem('@patients', JSON.stringify(updatedPatients));
        return newPatient;
      } else {
        const created = await apiService.createPatient(newPatient);
        const updatedPatients = [...patients, created];
        setPatients(updatedPatients);
        await AsyncStorage.setItem('@patients', JSON.stringify(updatedPatients));
        return created;
      }
    } catch (error) {
      throw error;
    }
  };

  const updatePatientHeartRate = async (patientId: string, bpm: number): Promise<void> => {
    const timestamp = Date.now();
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
          synced: !isOffline ? true : false,
        };
      }
      return patient;
    });

    try {
      if (isOffline) {
        setPatients(updatedPatients);
        await AsyncStorage.setItem('@patients', JSON.stringify(updatedPatients));
      } else {
        const patient = updatedPatients.find(p => p.id === patientId);
        if (patient) await apiService.updatePatient(patient);
        setPatients(updatedPatients);
        await AsyncStorage.setItem('@patients', JSON.stringify(updatedPatients));
      }
    } catch (error) {
      throw error;
    }
  };

  const updatePatient = async (updatedPatient: Patient): Promise<void> => {
    try {
      if (isOffline) {
        const updatedPatients = patients.map(p =>
          p.id === updatedPatient.id ? { ...updatedPatient, synced: false } : p
        );
        setPatients(updatedPatients);
        await AsyncStorage.setItem('@patients', JSON.stringify(updatedPatients));
      } else {
        await apiService.updatePatient(updatedPatient);
        const updatedPatients = patients.map(p =>
          p.id === updatedPatient.id ? { ...updatedPatient, synced: true } : p
        );
        setPatients(updatedPatients);
        await AsyncStorage.setItem('@patients', JSON.stringify(updatedPatients));
      }
    } catch (error) {
      throw error;
    }
  };

  const removePatient = async (patientId: string): Promise<void> => {
    try {
      let updatedPatients;
      if (isOffline) {
        updatedPatients = patients.filter(patient => patient.id !== patientId);
        setPatients(updatedPatients);
        await AsyncStorage.setItem('@patients', JSON.stringify(updatedPatients));
      } else {
        await apiService.deletePatient(patientId);
        updatedPatients = patients.filter(patient => patient.id !== patientId);
        setPatients(updatedPatients);
        await AsyncStorage.setItem('@patients', JSON.stringify(updatedPatients));
      }
    } catch (error) {
      throw error;
    }
  };


  return (
    <DataContext.Provider value={{
      patients,
      shelters,
      addPatient,
      updatePatientHeartRate,
      updatePatient,
      removePatient,
      isOffline,
    }}>
      {children}
    </DataContext.Provider>
  );
}