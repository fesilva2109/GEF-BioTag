import axios from 'axios';
import { Patient } from '@/types';

// Troque aqui para o endpoint real da sua API
const API_BASE_URL = 'https://6840dd77d48516d1d3599c53.mockapi.io/patients';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Adapta um usuário do JSONPlaceholder para um Patient do seu domínio
function adaptUserToPatient(user: any): Patient {
  return {
    id: String(user.id),
    name: user.name,
    address: `${user.address?.street || ''}, ${user.address?.suite || ''}, ${user.address?.city || ''}`,
    bracelet: {
      id: 'NFC' + String(user.id).padStart(6, '0'),
      rfid: {
        id: 'RFID' + String(user.id).padStart(6, '0'),
        coordinates: {
          latitude: -23.55 + (user.id * 0.01),
          longitude: -46.63 + (user.id * 0.01),
        }
      },
      nfc: {
        id: 'NFC' + String(user.id).padStart(6, '0'),
        information: [`Nome: ${user.name}`, `Email: ${user.email}`]
      },
      iotHeartRate: {
        id: 'HR' + String(user.id).padStart(6, '0'),
        bpm: 60 + (user.id % 60),
        timestamp: Date.now() - (user.id * 1000000)
      }
    },
    shelterId: 'shelter-1',
    createdAt: Date.now() - (user.id * 1000000),
    updatedAt: Date.now() - (user.id * 500000),
  };
}

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
      return response.data.map(adaptUserToPatient);
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
      return adaptUserToPatient(response.data);
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
      const response = await api.post('/patients', {
        name: patient.name,
        email: patient.bracelet.nfc.information[1]?.replace('Email: ', '') || 'fake@email.com',
        address: {
          street: patient.address,
          suite: '',
          city: '',
        }
      });
      return adaptUserToPatient(response.data);
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
      const response = await api.put(`/patients/${patient.id}`, {
        name: patient.name,
        email: patient.bracelet.nfc.information[1]?.replace('Email: ', '') || 'fake@email.com',
        address: {
          street: patient.address,
          suite: '',
          city: '',
        }
      });
      return adaptUserToPatient(response.data);
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