import axios from 'axios';
import { Patient } from '@/types';

const API_BASE_URL = 'https://api.gefbiotag.example.com'; // Coloque o endereço real da sua API

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const apiService = {
  /**
   * Checa se a API está online
   */
  checkConnection: async (): Promise<boolean> => {
    try {
      await api.get('/health'); // Ajuste para um endpoint real de healthcheck
      return true;
    } catch (error) {
      return false;
    }
  },

  /**
   * Busca todos os pacientes da API
   */
  getPatients: async (): Promise<Patient[]> => {
    try {
      const response = await api.get('/patients');
      return response.data;
    } catch (error) {
      console.error('API error getting patients:', error);
      throw error;
    }
  },

  /**
   * Cria um novo paciente via API
   */
  createPatient: async (patient: Patient): Promise<Patient> => {
    try {
      const response = await api.post('/patients', patient);
      return response.data;
    } catch (error) {
      console.error('API error creating patient:', error);
      throw error;
    }
  },

  /**
   * Atualiza um paciente via API
   */
  updatePatient: async (patient: Patient): Promise<Patient> => {
    try {
      const response = await api.put(`/patients/${patient.id}`, patient);
      return response.data;
    } catch (error) {
      console.error('API error updating patient:', error);
      throw error;
    }
  },

  /**
   * Deleta um paciente via API
   */
  deletePatient: async (patientId: string): Promise<void> => {
    try {
      await api.delete(`/patients/${patientId}`);
      return;
    } catch (error) {
      console.error('API error deleting patient:', error);
      throw error;
    }
  }
};