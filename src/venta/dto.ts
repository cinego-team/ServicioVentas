export class VentaInput {
    // fecha: string;      // ISO string
    // hora: string;       // ISO string o 'HH:mm:ss'
    // total: number;
    disponibilidaButacaIds: number[];
    funcionId: number;
}
export class VentaResponse {
    nroVenta: number;
    fecha: Date;
    hora: string;
    total: number;
    promocionId: number;
    urlPagoMP?: string;
    idPagoMP?: number;
}
export class DatosFuncion {
    fechaFuncion: string;
    horaFuncion: string;
    titulo: string;
}

export class PromocionDTO {
    id: number;
    descuento: number;
}

export class DatosMP {
    id: number;
    init_point: string;
}
export class CerrarVentaInput {
    status: string;
    ventaId: number;
    usuarioId: number;
    disponibilidadButacaIds: number[];
}

//hola ramiro, aca esta el cambio
