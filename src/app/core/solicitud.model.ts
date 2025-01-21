import { Detalle } from './detalle.model';

export interface Solicitud {
  solicitudId: number;
  proveedorId: string;
  usuario: string;
  fecha: string;
  estado: string;
  detalles: Detalle[];
}
