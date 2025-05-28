import axios from 'axios';
import { Patient } from '@/types';

// This would be your actual API base URL in a real app
const API_BASE_URL = 'https://api.gefbiotag.example.com';

// Create an axios instance for the API
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const apiService = {
  /**
   * Check if the API is reachable (used to determine online status)
   */
  checkConnection: async (): Promise<boolean> => {
    try {
      // In a real app, we'd ping the actual API
      // For this demo, we'll simulate random connectivity to test offline mode
      // Return true 70% of the time to simulate mostly online connection
      return Math.random() < 0.7;
    } catch (error) {
      return false;
    }
  },
  
  /**
   * Get all patients from the API
   */
  getPatients: async (): Promise<Patient[]> => {
    try {
      // In a real app, we'd make an actual API call
      // For this demo, we'll simulate an API response delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock success - would be `const response = await api.get('/patients')` in a real app
      return [];
    } catch (error) {
      console.error('API error getting patients:', error);
      throw error;
    }
  },
  
  /**
   * Create a new patient via the API
   */
  createPatient: async (patient: Patient): Promise<Patient> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock success - would be `const response = await api.post('/patients', patient)` in a real app
      return patient;
    } catch (error) {
      console.error('API error creating patient:', error);
      throw error;
    }
  },
  
  /**
   * Update an existing patient via the API
   */
  updatePatient: async (patient: Patient): Promise<Patient> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock success - would be `const response = await api.put(`/patients/${patient.id}`, patient)` in a real app
      return patient;
    } catch (error) {
      console.error('API error updating patient:', error);
      throw error;
    }
  },
  
  /**
   * Delete a patient via the API
   */
  deletePatient: async (patientId: string): Promise<void> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock success - would be `await api.delete(`/patients/${patientId}`)` in a real app
      return;
    } catch (error) {
      console.error('API error deleting patient:', error);
      throw error;
    }
  }
};