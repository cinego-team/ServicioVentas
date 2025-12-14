export class VentaInput {
    disponibilidaButacaIds: number[];
    funcionId: number;
}
export class VentaResponse {
    nroVenta: number;
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
    titulo: string;
    fechaFuncion: string;
    horaFuncion: string;
}
export class RequestWithUser extends Request {
    user?: UserDto;
}
class UserDto {
    id: number;
    email: string;
}
export class DatosUsuario {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    fechaNacimiento: Date;
    nroTelefono: string;
    tipoCliente: {
        denominacion: string;
        descripcion: string;
    };
}
export class VentaResponseAdmin {
    nroVenta: number;
    fecha: Date;
    total: number;
    promocion?: {
        id: number;
        nombre: string;
        porcentajeDescuento: number;
    };
    cliente: {
        id: number;
        nombre: string;
        apellido: string;
        email: string;
    };
    estadoVenta: {
        nombre: string;
    };
    entradas: {
        id: number;
        esUsado: boolean;
    }[];
}
