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
    DatosUsuario,
} from './dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
    axiosAPIEnviarMails,
    axiosAPIFunciones,
    axiosAPIIntegracionMP,
    axiosAPIPromociones,
    axiosAPIUsuarios,
} from '../axios_service/axios.client';
import { config } from '../axios_service/env';
import { EstadoVenta } from 'src/entities/estadoVenta.entity';
import { EntradaService } from 'src/entrada/entrada.service';
import { generarQR } from './services/qr.service';

@Injectable()
export class VentaService {
    constructor(
        private readonly entradaService: EntradaService,
        @InjectRepository(Venta)
        private readonly ventaRepo: Repository<Venta>,
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
                // hora: null //new Date().toISOString().split('T')[1],
                // fecha: null //new Date(),
                total: total,
                promocionId: promocionValida.id,
                estadoVenta: estadoPendiente,
                cliente: user.id,
                fechaFuncion: datoFuncion.fechaFuncion,
                horaFuncion: datoFuncion.horaFuncion,
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
            const venta: Venta | null = await this.ventaRepo.findOne({
                where: {
                    nroVenta: data.ventaId,
                },
                relations: ['estadoVenta', 'entradas'],
            });

            if (!venta) {
                throw new InternalServerErrorException('Venta no encontrada');
            }

            const entradas: Entrada[] =
                await this.entradaService.crearEntradasPorDisponibilidadButacaIds(
                    data.disponibilidadButacaIds,
                    new Date(data.fechaFuncion),
                );

            if (!entradas) {
                throw new InternalServerErrorException(
                    'Error al crear las entradas',
                );
            }

            const estadoConfirmada = await this.estadoRepo.findOneBy({
                nombre: 'APROBADA',
            });

            if (!estadoConfirmada) {
                throw new InternalServerErrorException(
                    'Estado de venta APROBADA no encontrado',
                );
            }

            venta.fecha = new Date();
            venta.estadoVenta = estadoConfirmada;
            venta.entradas = entradas;
            await this.ventaRepo.save(venta);

            //ocupar las butacas
            axiosAPIFunciones.post(config.APIFuncionesUrls.ocuparButacasByIds, {
                body: {
                    disponibilidaButacasIds: data.disponibilidadButacaIds,
                },
            });

            //obtener tokens de entrada para generar qr
            const textosQR: string[] = entradas.map((entrada) => {
                return entrada.token;
            });

            //obtener email de usuario
            const datosUsuario: DatosUsuario = await axiosAPIUsuarios.get(
                config.APIUsuariosUrls.getDatosBlienteById(data.usuarioId),
            );

            //enviar mail con datos de envío y contenido.
            axiosAPIEnviarMails.post(config.APIEnviarMailsUrls.sendMail, {
                body: {
                    titulo: data.titulo,
                    fecha: data.fechaFuncion.split('T')[0],
                    hora: data.horaFuncion.split('T')[1],
                    destinatario: datosUsuario.email,
                    qrs: textosQR,
                },
            });
        }
    }

    // Reporte: top 5 horarios más elegidos del mes
    async getHorariosMasElegidos() {
        const hoy = new Date();
        const mes = hoy.getMonth() + 1;
        const anio = hoy.getFullYear();

        return await this.ventaRepo
            .createQueryBuilder('venta')
            .innerJoin('venta.funcion', 'funcion')
            .select('EXTRACT(HOUR FROM funcion.fecha)', 'hora')
            .addSelect('COUNT(*)', 'cantidad')
            .where('EXTRACT(MONTH FROM funcion.fecha) = :mes', { mes })
            .andWhere('EXTRACT(YEAR FROM funcion.fecha) = :anio', { anio })
            .groupBy('hora')
            .orderBy('cantidad', 'DESC')
            .limit(5)
            .getRawMany();
    }

    // Reporte: cantidad de entradas vendidas por día de la semana en el mes actual
    async getEntradasPorDiaSemanaMesActual(): Promise<any[]> {
        const ahora = new Date();
        const mesActual = ahora.getMonth() + 1;
        const anioActual = ahora.getFullYear();

        return await this.ventaRepo
            .createQueryBuilder('v')
            .innerJoin('v.estadoVenta', 'estado')
            .innerJoin('v.entradas', 'e')
            .innerJoin('v.funcion', 'f') // ← AQUI USAMOS LA FECHA REAL
            .select("TRIM(TO_CHAR(f.fecha, 'TMDay')) AS dia_semana")
            .addSelect('COUNT(e.id)', 'cantidad_entradas')
            .where('estado.nombre = :estado', { estado: 'APROBADA' })
            .andWhere('EXTRACT(MONTH FROM f.fecha) = :mes', { mes: mesActual })
            .andWhere('EXTRACT(YEAR FROM f.fecha) = :anio', {
                anio: anioActual,
            })
            .groupBy('dia_semana')
            .orderBy(
                `
            CASE 
                WHEN TRIM(TO_CHAR(f.fecha, 'TMDay')) = 'Lunes' THEN 1
                WHEN TRIM(TO_CHAR(f.fecha, 'TMDay')) = 'Martes' THEN 2
                WHEN TRIM(TO_CHAR(f.fecha, 'TMDay')) = 'Miércoles' THEN 3
                WHEN TRIM(TO_CHAR(f.fecha, 'TMDay')) = 'Jueves' THEN 4
                WHEN TRIM(TO_CHAR(f.fecha, 'TMDay')) = 'Viernes' THEN 5
                WHEN TRIM(TO_CHAR(f.fecha, 'TMDay')) = 'Sábado' THEN 6
                WHEN TRIM(TO_CHAR(f.fecha, 'TMDay')) = 'Domingo' THEN 7
            END
        `,
            )
            .getRawMany();
    }
}
