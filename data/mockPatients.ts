import { Patient } from '@/types';
import { mockShelters } from './mockShelters';

const getShelterCoords = (shelterId: string) => {
  const shelter = mockShelters.find(s => s.id === shelterId);
  return shelter?.address
    ? { latitude: shelter.address.latitude, longitude: shelter.address.longitude }
    : { latitude: -23.55, longitude: -46.63 };
};

export const mockPatients: Patient[] = [
  {
    id: 'p-1',
    name: 'Maria Silva',
    address: 'Rua das Flores, 123, Apto 45',
    bracelet: {
      id: 'NFC000123',
      nfc: {
        id: 'NFC000123',
        information: ['Nome: Maria Silva', 'Abrigo: Abrigo Central']
      },
      iotHeartRate: {
        id: 'HR000123',
        bpm: 85,
        timestamp: Date.now() - 3600000
      }
    },
    shelterId: 'shelter-1',
    createdAt: Date.now() - 7200000,
    updatedAt: Date.now() - 3600000,
  },
  {
    id: 'p-2',
    name: 'João Santos',
    address: 'Av. Paulista, 1500, Apto 102',
    bracelet: {
      id: 'NFC000124',
      nfc: {
        id: 'NFC000124',
        information: ['Nome: João Santos', 'Abrigo: Escola Municipal Anchieta', 'Observações: Paciente com hipertensão']
      },
      iotHeartRate: {
        id: 'HR000124',
        bpm: 105,
        timestamp: Date.now() - 1800000
      }
    },
    shelterId: 'shelter-2',
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 1800000,
  },
  {
    id: 'p-3',
    name: 'Ana Oliveira',
    address: 'Rua Augusta, 500',
    bracelet: {
      id: 'NFC000125',
      nfc: {
        id: 'NFC000125',
        information: ['Nome: Ana Oliveira', 'Abrigo: Ginásio Ibirapuera']
      },
      iotHeartRate: {
        id: 'HR000125',
        bpm: 72,
        timestamp: Date.now() - 7200000
      }
    },
    shelterId: 'shelter-3',
    createdAt: Date.now() - 172800000,
    updatedAt: Date.now() - 7200000,
  },
  {
    id: 'p-4',
    name: 'Carlos Pereira',
    address: 'Alameda Santos, 700, Apto 304',
    bracelet: {
      id: 'NFC000126',
      nfc: {
        id: 'NFC000126',
        information: ['Nome: Carlos Pereira', 'Abrigo: Centro Comunitário Zona Leste', 'Observações: Paciente com diabetes']
      },
      iotHeartRate: {
        id: 'HR000126',
        bpm: 55,
        timestamp: Date.now() - 900000
      }
    },
    shelterId: 'shelter-4',
    createdAt: Date.now() - 259200000,
    updatedAt: Date.now() - 900000,
  }
];