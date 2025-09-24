import { BadRequestException, Injectable } from '@nestjs/common';
import { Venta } from '../entities/venta.entity';
import { Entrada } from '../entities/entrada.entity';
import { VentaInput, VentaResponse } from './dto';
import { PromocionService } from '../servicios/promocion.service';
import { PrecioEntrada } from '../servicios/precio-entrada.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm'; 

@Injectable()
export class VentaService {
  constructor(
    private readonly promocionService: PromocionService,
    private readonly precioEntrada: PrecioEntrada,
    @InjectRepository(Venta)
    private readonly ventaRepo: Repository<Venta>,
    @InjectRepository(Entrada)
    private readonly entradaRepo: Repository<Entrada>,
  ) {}

  // Calcular total con promoción
  private async calcularTotalConPromocion(venta: Venta): Promise<number> {
    if (!venta.entradas || venta.entradas.length === 0) return 0;

    // Obtener precios usando EntradaService
    const precios = await Promise.all(
      venta.entradas.map(e => this.precioEntrada.obtenerPrecioEntrada(e.id)),
    );

    let total = precios.reduce((acc, precio) => acc + precio, 0);

    // Aplicar descuento si hay promoción
    if (venta.promocionId) {
      try {
        const promo = await this.promocionService.obtenerPromocion(venta.promocionId);
        if (promo?.porcentaje) total = total - (total * promo.porcentaje) / 100;
      } catch (error) {
        console.error('Error consultando la promoción', error);
      }
    }

    venta.total = Number(total.toFixed(2));
    return venta.total;
  }

  // Crear venta

  async nuevaVenta(dato: VentaInput): Promise<VentaResponse> {
    // Validar promoción
    if (dato.promocionId) {
      const esValida = await this.promocionService.validarPromocion(dato.promocionId);
      if (!esValida) throw new BadRequestException(`Promoción con id ${dato.promocionId} no válida`);
    }

    // Traer entradas existentes
    const entradas = await this.entradaRepo.find({
      where: dato.entradas.map(e => ({ id: e.id })),
    });
    if (entradas.length !== dato.entradas.length) {
      throw new BadRequestException('Alguna de las entradas no existe');
    }

    // Crear venta
    const venta = Venta.create({
      fecha: new Date(dato.fecha),
      hora: new Date(dato.hora).toISOString(),
      total: 0,
      promocionId: dato.promocionId,
      entradas,
    });

    // Calcular total
    venta.total = await this.calcularTotalConPromocion(venta);

    // Guardar venta
    await this.ventaRepo.save(venta);

    return {
      nroVenta: venta.nroVenta,
      fecha: venta.fecha,
      hora: new Date(venta.hora),
      total: venta.total,
      promocionId: venta.promocionId,
      entradas: entradas.map(({ id, codigoSeguridad, disponibilidadButacaId }) => ({
        id,
        codigoSeguridad,
        disponibilidaButaca: disponibilidadButacaId,
      })),
    };
  }


  // Listar todas las ventas

  async findAll(): Promise<VentaResponse[]> {
    const ventas = await this.ventaRepo.find({ relations: ['entradas'] });

    return ventas.map(venta => ({
      nroVenta: venta.nroVenta,
      fecha: venta.fecha,
      hora: new Date(venta.hora),
      total: venta.total,
      promocionId: venta.promocionId,
      entradas: venta.entradas.map(({ id, codigoSeguridad, disponibilidadButacaId }) => ({
        id,
        codigoSeguridad,
        disponibilidaButaca: disponibilidadButacaId,
      })),
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
      entradas: venta.entradas.map(({ id, codigoSeguridad, disponibilidadButacaId }) => ({
        id,
        codigoSeguridad,
        disponibilidaButaca: disponibilidadButacaId,
      })),
    };
  }
}
