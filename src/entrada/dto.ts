export class CrearEntradaInputDto {
    disponibilidadButacaIds: number[];
    expiracion: Date;
}
export class EntradaResponse {
    id: number;
    codigoSeguridad: string;
    DisponibilidadButacaId: number;
}
