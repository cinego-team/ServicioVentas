export class VentaInput {
  fecha: string;      // ISO string
  hora: string;       // ISO string o 'HH:mm:ss'
  total: number;
  promocionId?: number;
  entradas: {
    id: number;
    codigoSeguridad: string;
   disponibilidadButaca: number;
  }[];
}
export class VentaResponse {
  nroVenta: number;
  fecha: Date;
  hora: Date;
  total: number;
  promocionId?: number;
  entradas: {
    id: number;
    codigoSeguridad: string;
    disponibilidaButaca: number;
  }[];
}
//hola ramiro, aca esta el cambio