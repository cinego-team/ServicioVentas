import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstadoVenta } from '../entities/estadoVenta.entity';
import { estadoVentaResponse, estadoVentaInput } from './dto';

@Injectable()
export class EstadoVentaService {
    constructor(
        @InjectRepository(EstadoVenta)
        private readonly estadoRepo: Repository<EstadoVenta>,
    ) {}
    async crearEstadoVenta(
        dato: estadoVentaInput,
    ): Promise<estadoVentaResponse> {
        const nuevoEstadoVenta = this.estadoRepo.create(dato);
        await this.estadoRepo.save(nuevoEstadoVenta);
        return nuevoEstadoVenta;
    }
    async findAllEstadoVenta(): Promise<estadoVentaResponse[]> {
        return this.estadoRepo.find();
    }
    async getEstadoVentaById(id: number): Promise<estadoVentaResponse | null> {
        return this.estadoRepo.findOneBy({ id });
    }

    async eliminarEstadoVenta(id: number): Promise<string> {
        await this.estadoRepo.delete(id);
        return `El estado de venta con id ${id} ha sido eliminado`;
    }
}
