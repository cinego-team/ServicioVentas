import { Injectable, BadRequestException } from '@nestjs/common';
import { Entrada } from '../entities/entrada.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta } from '../entities/venta.entity';
import { EntradaInput, EntradaResponse } from './dto';

@Injectable()
export class EntradaService {
    constructor(
        @InjectRepository(Entrada)
        private readonly entradaRepo: Repository<Entrada>,
        @InjectRepository(Venta) private readonly ventaRepo: Repository<Venta>,
        private readonly disponibilidadButaca: DisponibilidadButacaService,
    ) {}
    async nuevaEntrada(datos: EntradaInput): Promise<EntradaResponse> {
        if (datos.DisponibilidadButacaId) {
            const esValida =
                await this.disponibilidadButaca.validarDisponibilidad(
                    datos.DisponibilidadButacaId,
                );
            if (!esValida)
                throw new BadRequestException(
                    `Promoción con id ${datos.DisponibilidadButacaId} no válida`,
                );
        }
        const entrada = this.entradaRepo.create({
            codigoSeguridad: datos.codigoSeguridad,
            disponibilidadButacaId: datos.DisponibilidadButacaId,
        });
        const savedEntrada = await this.entradaRepo.save(entrada);
        const response: EntradaResponse = {
            id: savedEntrada.id,
            codigoSeguridad: savedEntrada.codigoSeguridad,
            DisponibilidadButacaId: savedEntrada.disponibilidadButacaId,
        };
        return response;
    }
    async findAll(): Promise<Entrada[]> {
        return await this.entradaRepo.find();
    }
    async getEntradaById(id: number): Promise<EntradaResponse> {
        const entrada = await this.entradaRepo.findOneBy({ id });
        if (!entrada) {
            throw new Error(`Entrada con id ${id} no encontrada`);
        }
        return {
            id: entrada.id,
            codigoSeguridad: entrada.codigoSeguridad,
            DisponibilidadButacaId: entrada.disponibilidadButacaId,
        };
    }
    async updateEntrada(
        id: number,
        datos: EntradaInput,
    ): Promise<EntradaResponse> {
        const constEntrada = await this.entradaRepo.findOne({
            where: { id },
        });
        if (!constEntrada) {
            throw new Error(`Entrada con id ${id} no encontrada`);
        }
        constEntrada.codigoSeguridad = datos.codigoSeguridad;
        await this.entradaRepo.save(constEntrada);
        const response: EntradaResponse = {
            id: constEntrada.id,
            codigoSeguridad: constEntrada.codigoSeguridad,
            DisponibilidadButacaId: constEntrada.disponibilidadButacaId,
        };
        return response;
    }
    async deleteEntradaById(id: number): Promise<{ message: string }> {
        const entrada = await this.entradaRepo.findOneBy({ id });
        if (!entrada) {
            throw new Error(`Entrada con id ${id} no encontrada`);
        }
        await this.entradaRepo.remove(entrada);
        return { message: 'Entrada Eliminada' };
    }

    async crearEntradasPorDisponibilidadButacaIds(
        disponibilidadButacaIds: number[],
    ): Promise<Entrada[]> {
        //logica
        const entradas: Entrada[] = [];
        return entradas;
    }
}
