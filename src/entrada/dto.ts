export class CrearEntradaInputDto {
    disponibilidadButacaIds: number[];
    expiracion: Date;
    venta: any;
}
export class EntradaResponse {
    id: number;
    codigoSeguridad: string;
    DisponibilidadButacaId: number;
}
