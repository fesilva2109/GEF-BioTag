import { useContext } from 'react';
import { VictimContext } from '@/contexts/VictimContext';

export const useVictims = () => {
  return useContext(VictimContext);
};