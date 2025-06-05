import axios from 'axios';
import { Patient } from '@/types';

// Troque aqui para o endpoint real da sua API
const API_BASE_URL = 'https://6840dd77d48516d1d3599c53.mockapi.io/patients';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const apiService = {
  /**
   * Checa se a API está online (usando /patients como healthcheck)
   */
  checkConnection: async (): Promise<boolean> => {
    try {
      await api.get('/patients');
      return true;
    } catch (error) {
      return false;
    }
  },

  /**
   * Busca todos os pacientes
   */
  getPatients: async (): Promise<Patient[]> => {
    try {
      const response = await api.get('/patients');
      return response.data; // <-- NÃO use adaptUserToPatient
    } catch (error) {
      console.error('API error getting patients:', error);
      throw error;
    }
  },

  /**
   * Busca paciente por ID
   */
  getPatientById: async (id: string | number): Promise<Patient> => {
    try {
      const response = await api.get(`/patients/${id}`);
      return response.data; // <-- NÃO use adaptUserToPatient
    } catch (error) {
      console.error('API error getting patient by id:', error);
      throw error;
    }
  },

  /**
   * Cria um novo paciente
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
   * Atualiza um paciente
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
   * Deleta um paciente
   */
  deletePatient: async (patientId: string | number): Promise<void> => {
    try {
      await api.delete(`/patients/${patientId}`);
      return;
    } catch (error) {
      console.error('API error deleting patient:', error);
      throw error;
    }
  }
};