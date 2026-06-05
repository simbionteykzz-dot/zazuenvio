import { Client, Operation, SystemStats } from './types';

export const mockStats: SystemStats = {
  totalOps: 24,
  totalUnits: 1565,
  recepciones: { ops: 24, units: 1565, percentage: 100 },
  despachos: { ops: 0, units: 0, percentage: 0 },
  traslados: { ops: 0, units: 0, percentage: 0 },
};

export const mockOperations: Operation[] = [
  { id: 'OP-001', type: 'RECEPCION', productName: 'Caja Standard', units: 50, date: '2026-06-01', status: 'COMPLETED' },
  { id: 'OP-002', type: 'RECEPCION', productName: 'Paquete Express', units: 120, date: '2026-06-01', status: 'COMPLETED' },
  { id: 'OP-003', type: 'RECEPCION', productName: 'Caja Grande', units: 30, date: '2026-06-02', status: 'COMPLETED' },
  { id: 'OP-004', type: 'RECEPCION', productName: 'Sobre Courier', units: 400, date: '2026-06-02', status: 'COMPLETED' },
  { id: 'OP-005', type: 'RECEPCION', productName: 'Paquete Express', units: 965, date: '2026-06-03', status: 'COMPLETED' },
];

export const mockClients: Record<string, Client> = {
  '12345678': {
    dni: '12345678',
    name: 'Juan Perez',
    phone: '+51 987654321',
    email: 'juan.perez@example.com',
    history: ['OP-001', 'OP-003']
  },
  '87654321': {
    dni: '87654321',
    name: 'Maria Sanchez',
    phone: '+51 912345678',
    email: 'maria.sanchez@example.com',
    history: ['OP-002']
  }
};
