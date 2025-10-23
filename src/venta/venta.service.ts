import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { Venta } from '../entities/venta.entity';
import { Entrada } from '../entities/entrada.entity';
import {
    VentaInput,
    VentaResponse,
    DatosFuncion,
    PromocionDTO,
    DatosMP,
    CerrarVentaInput,
} from './dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
    axiosAPIFunciones,
    axiosAPIIntegracionMP,
    axiosAPIPromociones,
} from '../axios_service/axios.client';
import { config } from '../axios_service/env';
import { EstadoVenta } from 'src/entities/estadoVenta.entity';
import { EntradaService } from 'src/entrada/entrada.service';

@Injectable()
export class VentaService {
    constructor(
        private readonly entradaService: EntradaService,
        @InjectRepository(Venta)
        private readonly ventaRepo: Repository<Venta>,
        @InjectRepository(Entrada)
        private readonly entradaRepo: Repository<Entrada>,
        @InjectRepository(EstadoVenta)
        private readonly estadoRepo: Repository<EstadoVenta>,
    ) {}

    // Listar todas las ventas
    /*
    async findAll(): Promise<VentaResponse[]> {
        const ventas = await this.ventaRepo.find({ relations: ['entradas'] });

        return ventas.map((venta) => ({
            nroVenta: venta.nroVenta,
            fecha: venta.fecha,
            hora: new Date(venta.hora),
            total: venta.total,
            promocionId: venta.promocionId,
            entradas: venta.entradas.map(
                ({ id, codigoSeguridad, disponibilidadButacaId }) => ({
                    id,
                    codigoSeguridad,
                    disponibilidaButaca: disponibilidadButacaId,
                }),
            ),
        }));
    }
        

    // Obtener venta por ID

    async getVentaById(id: number): Promise<VentaResponse> {
        const venta = await this.ventaRepo.findOne({
            where: { nroVenta: id },
            relations: ['entradas'],
        });
        if (!venta) throw new BadRequestException('Venta no encontrada');

        return {
            nroVenta: venta.nroVenta,
            fecha: venta.fecha,
            hora: new Date(venta.hora),
            total: venta.total,
            promocionId: venta.promocionId,
            entradas: venta.entradas.map(
                ({ id, codigoSeguridad, disponibilidadButacaId }) => ({
                    id,
                    codigoSeguridad,
                    disponibilidaButaca: disponibilidadButacaId,
                }),
            ),
        };
    }
        */
    async abrirVenta(user, dato: VentaInput): Promise<VentaResponse> {
        //chequear que no tiene usuario
        if (!user || !user.id) {
            throw new BadRequestException('Usuario no autenticado');
        }
        try {
            //reservo las butacas con las disponibilidadId
            axiosAPIFunciones.post(
                config.APIFuncionesUrls.reservarButacasByIds,
                {
                    body: {
                        disponibilidaButacasIds: dato.disponibilidaButacaIds,
                    },
                },
            );
            //buscamos la promocion con mayor porcentaje (id y porcentaje)
            const promocionValida: PromocionDTO = await axiosAPIPromociones.get(
                config.APIPromocionesUrls.verificarPromocionById(user.id),
            );
            //obtenemos el precio de las entradas
            const precioEntradas: number = await axiosAPIFunciones.get(
                config.APIFuncionesUrls.obtenerPrecioEntradaByFuncionId(
                    dato.funcionId,
                ),
            );
            //comenzamos a obtener el total
            let total: number = 0;
            if (dato.disponibilidaButacaIds.length === 1) {
                total = precioEntradas * (1 - promocionValida.descuento);
            } else if (dato.disponibilidaButacaIds.length > 1) {
                total =
                    precioEntradas * (1 - promocionValida.descuento) +
                    precioEntradas * (dato.disponibilidaButacaIds.length - 1);
            } else if (dato.disponibilidaButacaIds.length <= 0 || total === 0) {
                throw new BadRequestException('No se seleccionaron butacas');
            }
            //buscamos fecha, hora y el titulo de la funcion
            const datoFuncion: DatosFuncion = await axiosAPIFunciones.get(
                config.APIFuncionesUrls.getDatosFuncionById(dato.funcionId),
            );
            //creamos la venta
            const estadoPendiente: EstadoVenta | null =
                await this.estadoRepo.findOneBy({
                    nombre: 'PENDIENTE DE PAGO',
                });
            if (!estadoPendiente) {
                throw new InternalServerErrorException(
                    'Estado de venta PENDIENTE DE PAGO no encontrado',
                );
            }

            const nuevaVenta = this.ventaRepo.create({
                hora: new Date().toISOString().split('T')[1],
                fecha: new Date(),
                total: total,
                promocionId: promocionValida.id,
                estadoVenta: estadoPendiente,
            });
            const ventaGuardada = await this.ventaRepo.save(nuevaVenta);

            //abrimos el cobro
            const datosMP: DatosMP = await axiosAPIIntegracionMP.post(
                config.APIIntegracionMPUrls.abrirCobro,
                {
                    body: {
                        idsDisponibilidad: dato.disponibilidaButacaIds,
                        fechaFuncion: datoFuncion.fechaFuncion,
                        horaFuncion: datoFuncion.horaFuncion,
                        titulo: datoFuncion.titulo,
                        total: total,
                        ventaId: ventaGuardada.nroVenta,
                        usuarioId: user.id,
                    },
                },
            );
            const respuesta: VentaResponse = {
                nroVenta: ventaGuardada.nroVenta,
                fecha: ventaGuardada.fecha,
                hora: ventaGuardada.hora,
                total: ventaGuardada.total,
                promocionId: ventaGuardada.promocionId,
                urlPagoMP: datosMP.init_point,
                idPagoMP: datosMP.id,
            };
            return respuesta;
        } catch (error) {
            throw new InternalServerErrorException(
                'Error al procesar la venta',
            );
        }
    }
    async cerrarVenta(data: CerrarVentaInput): Promise<void> {
        if (data.status === 'approved') {
            const entradas =
                await this.entradaService.crearEntradasPorDisponibilidadButacaIds(
                    data.disponibilidadButacaIds,
                );
            if (!entradas) {
                throw new InternalServerErrorException(
                    'Error al crear las entradas',
                );
            }
            const venta: Venta | null = await this.ventaRepo.findOne({
                where: {
                    nroVenta: data.ventaId,
                },
                relations: ['estadoVenta', 'entradas'],
            });
            if (!venta) {
                throw new InternalServerErrorException('Venta no encontrada');
            }
            const estadoConfirmada = await this.estadoRepo.findOneBy({
                nombre: 'APROBADA',
            });
            if (!estadoConfirmada) {
                throw new InternalServerErrorException(
                    'Estado de venta APROBADA no encontrado',
                );
            }
            venta.estadoVenta = estadoConfirmada;
            venta.entradas = entradas;
            await this.ventaRepo.save(venta);
            //ocupar las butacas
            axiosAPIFunciones.post(config.APIFuncionesUrls.ocuparButacasByIds, {
                body: {
                    disponibilidaButacasIds: data.disponibilidadButacaIds,
                },
            });
            //generar qr y enviarlas via email
        }
    }
}
