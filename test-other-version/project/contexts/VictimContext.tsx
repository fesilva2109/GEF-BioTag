import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Victim } from '@/types/victim';
import { api } from '@/services/api';
import { useConnectivity } from '@/hooks/useConnectivity';

interface VictimContextData {
  victims: Victim[];
  getVictims: () => Promise<void>;
  getVictimById: (id: string) => Victim | null;
  addVictim: (victim: Victim) => Promise<void>;
  updateVictim: (victim: Victim) => Promise<void>;
  deleteVictim: (id: string) => Promise<void>;
  syncWithServer: () => Promise<void>;
  clearAllData: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  lastSyncTime: string | null;
}

export const VictimContext = createContext<VictimContextData>({
  victims: [],
  getVictims: async () => {},
  getVictimById: () => null,
  addVictim: async () => {},
  updateVictim: async () => {},
  deleteVictim: async () => {},
  syncWithServer: async () => {},
  clearAllData: async () => {},
  isLoading: false,
  error: null,
  lastSyncTime: null,
});

export const VictimProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [victims, setVictims] = useState<Victim[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const { isConnected } = useConnectivity();

  useEffect(() => {
    // Load victims from AsyncStorage on mount
    getVictims();
    
    // Load last sync time
    AsyncStorage.getItem('@GEFBioTag:lastSyncTime')
      .then(time => {
        if (time) {
          setLastSyncTime(time);
        }
      })
      .catch(err => {
        console.error('Error loading last sync time:', err);
      });
  }, []);

  const saveVictimsToStorage = async (data: Victim[]) => {
    try {
      await AsyncStorage.setItem('@GEFBioTag:victims', JSON.stringify(data));
    } catch (e) {
      console.error('Error saving victims to storage:', e);
      throw new Error('Erro ao salvar dados localmente');
    }
  };

  const getVictims = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First, load from local storage
      const storedVictims = await AsyncStorage.getItem('@GEFBioTag:victims');
      
      if (storedVictims) {
        setVictims(JSON.parse(storedVictims));
      }
      
      // If connected, try to sync with server
      if (isConnected) {
        await syncWithServer();
      }
    } catch (e) {
      console.error('Error getting victims:', e);
      setError('Erro ao carregar vítimas');
    } finally {
      setIsLoading(false);
    }
  };

  const getVictimById = (id: string): Victim | null => {
    return victims.find(victim => victim.id === id) || null;
  };

  const addVictim = async (victim: Victim) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Add needsSync flag if not present
      const victimToAdd = {
        ...victim,
        needsSync: true,
        lastUpdated: new Date().toISOString(),
      };
      
      const updatedVictims = [...victims, victimToAdd];
      await saveVictimsToStorage(updatedVictims);
      setVictims(updatedVictims);
      
      // If connected, try to sync immediately
      if (isConnected) {
        await syncWithServer();
      }
    } catch (e) {
      console.error('Error adding victim:', e);
      setError('Erro ao adicionar vítima');
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const updateVictim = async (victim: Victim) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedVictims = victims.map(v => 
        v.id === victim.id ? { ...victim, needsSync: true } : v
      );
      
      await saveVictimsToStorage(updatedVictims);
      setVictims(updatedVictims);
      
      // If connected, try to sync immediately
      if (isConnected) {
        await syncWithServer();
      }
    } catch (e) {
      console.error('Error updating victim:', e);
      setError('Erro ao atualizar vítima');
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteVictim = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, we'd mark it for deletion on server
      // For this demo, we'll just remove locally
      const updatedVictims = victims.filter(v => v.id !== id);
      
      await saveVictimsToStorage(updatedVictims);
      setVictims(updatedVictims);
      
      // If connected, try to sync immediately
      if (isConnected) {
        await syncWithServer();
      }
    } catch (e) {
      console.error('Error deleting victim:', e);
      setError('Erro ao excluir vítima');
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const syncWithServer = async () => {
    if (!isConnected) {
      setError('Sem conexão com a internet');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would sync with server
      // For this demo, we'll simulate a successful sync
      
      // Get victims that need sync
      const victimsToSync = victims.filter(v => v.needsSync);
      
      if (victimsToSync.length === 0) {
        // Nothing to sync
        return;
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mark all as synced
      const updatedVictims = victims.map(v => ({
        ...v,
        needsSync: false
      }));
      
      await saveVictimsToStorage(updatedVictims);
      setVictims(updatedVictims);
      
      // Update last sync time
      const now = new Date().toISOString();
      await AsyncStorage.setItem('@GEFBioTag:lastSyncTime', now);
      setLastSyncTime(now);
    } catch (e) {
      console.error('Error syncing with server:', e);
      setError('Erro ao sincronizar com o servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const clearAllData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await AsyncStorage.removeItem('@GEFBioTag:victims');
      setVictims([]);
    } catch (e) {
      console.error('Error clearing data:', e);
      setError('Erro ao limpar dados');
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VictimContext.Provider
      value={{
        victims,
        getVictims,
        getVictimById,
        addVictim,
        updateVictim,
        deleteVictim,
        syncWithServer,
        clearAllData,
        isLoading,
        error,
        lastSyncTime,
      }}
    >
      {children}
    </VictimContext.Provider>
  );
};