import { Shelter } from '@/types';

export const mockShelters: Shelter[] = [
  {
    id: 'shelter-1',
    name: 'Abrigo Central',
    address: {
      street: 'Av. Paulista',
      number: '1000',
      city: 'São Paulo',
      state: 'SP',
      latitude: -23.561684,
      longitude: -46.655981
    },
    capacity: 100
  },
  {
    id: 'shelter-2',
    name: 'Escola Municipal Anchieta',
    address: {
      street: 'Rua dos Bandeirantes',
      number: '230',
      city: 'São Paulo',
      state: 'SP',
      latitude: -23.558704,
      longitude: -46.661925
    },
    capacity: 150
  },
  {
    id: 'shelter-3',
    name: 'Ginásio Ibirapuera',
    address: {
      street: 'Av. Ibirapuera',
      number: '500',
      city: 'São Paulo',
      state: 'SP',
      latitude: -23.584131,
      longitude: -46.654927
    },
    capacity: 300
  },
  {
    id: 'shelter-4',
    name: 'Centro Comunitário Zona Leste',
    address: {
      street: 'Rua das Flores',
      number: '123',
      city: 'São Paulo',
      state: 'SP',
      latitude: -23.545678,
      longitude: -46.603456
    },
    capacity: 80
  },
  {
    id: 'shelter-5',
    name: 'Igreja São Francisco',
    address: {
      street: 'Rua São Francisco',
      number: '45',
      city: 'São Paulo',
      state: 'SP',
      latitude: -23.55052,
      longitude: -46.633308
    },
    capacity: 50
  }
];