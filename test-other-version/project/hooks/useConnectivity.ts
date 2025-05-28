import { useContext } from 'react';
import { ConnectivityContext } from '@/contexts/ConnectivityContext';

export const useConnectivity = () => {
  return useContext(ConnectivityContext);
};