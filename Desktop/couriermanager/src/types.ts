export interface Operation {
  id: string;
  type: 'RECEPCION' | 'DESPACHO' | 'TRASLADO';
  productName: string;
  units: number;
  date: string;
  status: 'COMPLETED' | 'PENDING' | 'CANCELLED';
}

export interface Client {
  dni: string;
  name: string;
  phone: string;
  email: string;
  history: string[]; // array of operation IDs
}

export interface SystemStats {
  totalOps: number;
  totalUnits: number;
  recepciones: { ops: number; units: number; percentage: number };
  despachos: { ops: number; units: number; percentage: number };
  traslados: { ops: number; units: number; percentage: number };
}
