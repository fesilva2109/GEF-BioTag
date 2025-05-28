import { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check for stored user data on component mount
    loadUserFromStorage();
  }, []);
  
  const loadUserFromStorage = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('@user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const login = async (username: string, password: string) => {
    // In a real app, you'd validate credentials against an API
    // For this demo, we'll mock the authentication
    try {
      // Create mock user
      const mockUser: User = {
        id: 'user-123',
        username: username,
        name: 'Resgatista',
        role: 'rescuer',
        token: 'mock-jwt-token',
      };
      
      // Store user in storage
      await AsyncStorage.setItem('@user', JSON.stringify(mockUser));
      
      // Update state
      setUser(mockUser);
      return Promise.resolve();
    } catch (error) {
      console.error('Login error:', error);
      return Promise.reject(error);
    }
  };
  
  const logout = async () => {
    try {
      // Clear user from storage
      await AsyncStorage.removeItem('@user');
      
      // Update state
      setUser(null);
      return Promise.resolve();
    } catch (error) {
      console.error('Logout error:', error);
      return Promise.reject(error);
    }
  };
  
  return (
    <UserContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}