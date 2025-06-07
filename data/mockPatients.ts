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
      rfid: {
        id: 'RFID000123',
        coordinates: getShelterCoords('shelter-1')
      },
      nfc: {
        id: 'NFC000123',
        information: ['Nome: Maria Silva', 'Abrigo: Abrigo Central']
      },
      iotHeartRate: {
        id: 'HR000123',
        bpm: 85,
        timestamp: Date.now() - 3600000 // 1 hour ago
      }
    },
    shelterId: 'shelter-1',
    createdAt: Date.now() - 7200000, // 2 hours ago
    updatedAt: Date.now() - 3600000, // 1 hour ago
  },
  {
    id: 'p-2',
    name: 'João Santos',
    address: 'Av. Paulista, 1500, Apto 102',
    bracelet: {
      id: 'NFC000124',
      rfid: {
        id: 'RFID000124',
        coordinates: getShelterCoords('shelter-2')
      },
      nfc: {
        id: 'NFC000124',
        information: ['Nome: João Santos', 'Abrigo: Escola Municipal Anchieta', 'Observações: Paciente com hipertensão']
      },
      iotHeartRate: {
        id: 'HR000124',
        bpm: 105,
        timestamp: Date.now() - 1800000 // 30 minutes ago
      }
    },
    shelterId: 'shelter-2',
    createdAt: Date.now() - 86400000, // 1 day ago
    updatedAt: Date.now() - 1800000, // 30 minutes ago
  },
  {
    id: 'p-3',
    name: 'Ana Oliveira',
    address: 'Rua Augusta, 500',
    bracelet: {
      id: 'NFC000125',
      rfid: {
        id: 'RFID000125',
        coordinates: getShelterCoords('shelter-3')
      },
      nfc: {
        id: 'NFC000125',
        information: ['Nome: Ana Oliveira', 'Abrigo: Ginásio Ibirapuera']
      },
      iotHeartRate: {
        id: 'HR000125',
        bpm: 72,
        timestamp: Date.now() - 7200000 // 2 hours ago
      }
    },
    shelterId: 'shelter-3',
    createdAt: Date.now() - 172800000, // 2 days ago
    updatedAt: Date.now() - 7200000, // 2 hours ago
  },
  {
    id: 'p-4',
    name: 'Carlos Pereira',
    address: 'Alameda Santos, 700, Apto 304',
    bracelet: {
      id: 'NFC000126',
      rfid: {
        id: 'RFID000126',
        coordinates: getShelterCoords('shelter-4')
      },
      nfc: {
        id: 'NFC000126',
        information: ['Nome: Carlos Pereira', 'Abrigo: Centro Comunitário Zona Leste', 'Observações: Paciente com diabetes']
      },
      iotHeartRate: {
        id: 'HR000126',
        bpm: 55,
        timestamp: Date.now() - 900000 // 15 minutes ago
      }
    },
    shelterId: 'shelter-4',
    createdAt: Date.now() - 259200000, // 3 days ago
    updatedAt: Date.now() - 900000, // 15 minutes ago
  }
];