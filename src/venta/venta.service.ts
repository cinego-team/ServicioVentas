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
    VentaResponseAdmin,
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
        console.log('🧠 USER:', user);
        console.log('📦 DTO RECIBIDO:', dato);

        if (!user || !user.id) {
            throw new BadRequestException('Usuario no autenticado');
        }

        try {
            // 1. Reservo las butacas
            await axiosAPIFunciones.patch(
                config.APIFuncionesUrls.reservarButacasByIds,
                { disponibilidadButacaIds: dato.disponibilidadButacaIds },
            );

            // 2. Buscamos la promocion (CORRECCIÓN: Se envía el clienteId por Query)
            let promocionValida: any = null;
            try {
                const url = config.APIPromocionesUrls.verificarPromocionById(
                    user.id,
                );
                const res = await axiosAPIPromociones.get(url);
                promocionValida = res.data;
                console.log('✅ Promoción aplicada:', promocionValida);
            } catch (error) {
                console.log(
                    '⚠️ Cliente sin promo o error, continuando sin descuento...',
                );
                promocionValida = { descuento: 0, id: null };
            }

            // 3. Obtenemos el precio (CORRECCIÓN: Se apunta a FormatoController)
            let precioEntradas = 6000;
            try {
                const resPrecio = await axiosAPIFunciones.get<{
                    precio: number;
                }>(
                    `${config.APIFuncionesUrls.baseUrl}/formato/precio-entrada/${dato.funcionId}`,
                );
                precioEntradas = resPrecio.data.precio;
            } catch (error) {
                console.log('⚠️ Usando precio base 6000');
            }

            // 4. Calculamos el total
            const cantButacas = dato.disponibilidadButacaIds.length;
            const desc = promocionValida?.descuento || 0;
            let total: number = 0;

            if (cantButacas >= 1) {
                // Se asume desc como decimal (ej: 0.15 para 15%). Si es entero, usar (desc/100)
                total =
                    precioEntradas * (1 - desc) +
                    precioEntradas * (cantButacas - 1);
            } else {
                throw new BadRequestException('No se seleccionaron butacas');
            }

            // 5. Buscamos datos de la función (CORRECCIÓN: Formateo de fecha y hora)
            let datoFuncion: any;
            try {
                const resDatos = await axiosAPIFunciones.get<any>(
                    `${config.APIFuncionesUrls}/funcion/${dato.funcionId}`,
                );
                const f = resDatos.data;
                datoFuncion = {
                    titulo: 'Entrada de Cine',
                    fechaFuncion: new Date(f.fecha).toISOString().split('T')[0],
                    horaFuncion: new Date(f.fecha).toTimeString().split(' ')[0],
                };
            } catch (error) {
                const ahora = new Date();
                datoFuncion = {
                    titulo: 'Entradas de Cine',
                    fechaFuncion: ahora.toISOString().split('T')[0],
                    horaFuncion: ahora.toTimeString().split(' ')[0],
                };
            }

            // 6. Creamos la venta (CORRECCIÓN: Se añade 'fecha' y se valida el total)
            const estadoPendiente = await this.estadoRepo.findOneBy({
                nombre: 'PENDIENTE DE PAGO',
            });
            if (!estadoPendiente)
                throw new InternalServerErrorException('Estado no encontrado');

            const nuevaVenta = this.ventaRepo.create({
                fecha: new Date(), // <-- SOLUCIONA: null value violates not-null constraint
                total: isNaN(total) ? precioEntradas * cantButacas : total, // <-- SOLUCIONA: NaN
                promocionId: promocionValida?.id || null,
                estadoVenta: estadoPendiente,
                cliente: user.id,
                fechaFuncion: datoFuncion.fechaFuncion,
                horaFuncion: datoFuncion.horaFuncion,
            });

            const ventaGuardada = await this.ventaRepo.save(nuevaVenta);

            // 7. ABRIMOS EL COBRO EN MERCADO PAGO
            const { data: datosMP } = await axiosAPIIntegracionMP.post<any>(
                config.APIIntegracionMPUrls.abrirCobro,
                {
                    idsDisponibilidad: dato.disponibilidadButacaIds,
                    fechaFuncion: datoFuncion.fechaFuncion,
                    horaFuncion: datoFuncion.horaFuncion,
                    titulo: datoFuncion.titulo,
                    monto: ventaGuardada.total,
                    ventaId: ventaGuardada.nroVenta,
                    usuarioId: user.id,
                },
            );

            return {
                nroVenta: ventaGuardada.nroVenta,
                total: ventaGuardada.total,
                promocionId: ventaGuardada.promocionId,
                urlPagoMP: datosMP.init_point,
                idPagoMP: datosMP.id,
            };
        } catch (error) {
            console.error(
                '🔥 ERROR CRÍTICO EN VENTAS:',
                error?.response?.data || error,
            );
            throw error;
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
                disponibilidaButacasIds: data.disponibilidadButacaIds, // Sin el envoltorio 'body'
            });

            //obtener tokens de entrada para generar qr
            const textosQR: string[] = entradas.map((entrada) => {
                return entrada.token;
            });

            //obtener email de usuario
            const datosUsuario: DatosUsuario = await axiosAPIUsuarios.get(
                config.APIUsuariosUrls.getDatosClienteById(data.usuarioId),
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

    //reporte trimestral de peliculas por rango de ventas
    async getPeliculasPorRangoVentasTrimestral(
        trimestre: number,
        anio: number,
    ): Promise<any[]> {
        return await this.ventaRepo
            .createQueryBuilder()
            .select('rango')
            .addSelect('COUNT(*)', 'cantidad_peliculas')
            .from((subQuery) => {
                return subQuery
                    .select('p.id', 'pelicula_id')
                    .addSelect(
                        `
                    CASE
                        WHEN COUNT(e.id) <= 100 THEN 'Bajas ventas'
                        WHEN COUNT(e.id) <= 500 THEN 'Ventas medias'
                        ELSE 'Altas ventas'
                    END
                `,
                        'rango',
                    )
                    .from('venta', 'v')
                    .innerJoin('v.estadoVenta', 'estado')
                    .innerJoin('v.entradas', 'e')
                    .innerJoin('e.funcion', 'f')
                    .innerJoin('f.pelicula', 'p')
                    .where('estado.nombre = :estado', { estado: 'APROBADA' })
                    .andWhere('EXTRACT(QUARTER FROM f.fecha) = :trimestre', {
                        trimestre,
                    })
                    .andWhere('EXTRACT(YEAR FROM f.fecha) = :anio', { anio })
                    .groupBy('p.id');
            }, 'sub')
            .groupBy('rango')
            .getRawMany();
    }
    //GET VENTAS

    async getVentas(): Promise<VentaResponseAdmin[]> {
        const ventas = await this.ventaRepo.find({
            relations: ['estadoVenta', 'entradas'],
        });

        return Promise.all(
            ventas.map(async (venta): Promise<VentaResponseAdmin> => {
                try {
                    let cliente;

                    try {
                        const { data: datosUsuario } =
                            await axiosAPIUsuarios.get<DatosUsuario>(
                                config.APIUsuariosUrls.getDatosClienteById(
                                    venta.cliente,
                                ),
                            );

                        cliente = {
                            id: datosUsuario.id,
                            nombre: datosUsuario.nombre,
                            apellido: datosUsuario.apellido,
                            email: datosUsuario.email,
                        };
                    } catch (error) {
                        console.error(
                            `Error cliente ${venta.cliente}`,
                            error.message,
                        );

                        cliente = {
                            id: venta.cliente,
                            nombre: 'DESCONOCIDO',
                            apellido: '',
                            email: '',
                        };
                    }

                    let promocion: VentaResponseAdmin['promocion'] = undefined;

                    if (venta.promocionId) {
                        try {
                            const { data: datosPromocion } =
                                await axiosAPIPromociones.get(
                                    config.APIPromocionesUrls.getPromocionById(
                                        venta.promocionId,
                                    ),
                                );

                            promocion = {
                                id: datosPromocion.id,
                                nombre: datosPromocion.nombre,
                                porcentajeDescuento:
                                    datosPromocion.porcentajeDescuento,
                            };
                        } catch (error) {
                            console.warn(
                                `Promoción ${venta.promocionId} no encontrada`,
                            );
                        }
                    }
                    return {
                        nroVenta: venta.nroVenta,
                        fecha: venta.fecha,
                        total: venta.total,
                        promocion,
                        cliente,
                        estadoVenta: {
                            nombre: venta.estadoVenta.nombre,
                        },
                        entradas: (venta.entradas ?? []).map((entrada) => ({
                            id: entrada.id,
                            esUsado: entrada.esUsado,
                        })),
                    };
                } catch (error) {
                    console.error(
                        `Error procesando venta ${venta.nroVenta}`,
                        error,
                    );

                    return {
                        nroVenta: venta.nroVenta,
                        fecha: venta.fecha,
                        total: venta.total,
                        promocion: undefined,
                        cliente: {
                            id: venta.cliente,
                            nombre: 'ERROR',
                            apellido: '',
                            email: '',
                        },
                        estadoVenta: {
                            nombre: venta.estadoVenta?.nombre ?? 'DESCONOCIDO',
                        },
                        entradas: [],
                    };
                }
            }),
        );
    }
}
