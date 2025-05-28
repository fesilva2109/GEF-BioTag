import React, { createContext, useState, useEffect } from 'react';
import * as Network from 'expo-network';

interface ConnectivityContextData {
  isConnected: boolean;
  checkConnection: () => Promise<void>;
}

export const ConnectivityContext = createContext<ConnectivityContextData>({
  isConnected: true,
  checkConnection: async () => {},
});

export const ConnectivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);

  const checkConnection = async () => {
    try {
      const networkState = await Network.getNetworkStateAsync();
      setIsConnected(networkState.isConnected && networkState.isInternetReachable!);
    } catch (error) {
      console.error('Error checking network:', error);
      setIsConnected(false);
    }
  };

  useEffect(() => {
    // Check connectivity on mount
    checkConnection();
    
    // Set up a periodic check
    const interval = setInterval(() => {
      checkConnection();
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <ConnectivityContext.Provider value={{ isConnected, checkConnection }}>
      {children}
    </ConnectivityContext.Provider>
  );
};