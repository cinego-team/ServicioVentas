import { Injectable, BadRequestException } from '@nestjs/common';
import { Entrada } from '../entities/entrada.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';

@Injectable()
export class EntradaService {
    constructor(
        @InjectRepository(Entrada)
        private readonly entradaRepo: Repository<Entrada>,
    ) {}

    async crearEntradasPorDisponibilidadButacaIds(
        disponibilidadButacaIds: number[],
        expiracion: Date,
        venta: any,
    ): Promise<Entrada[]> {
        const entradas: Entrada[] = [];
        for (const disponibilidadButacaId of disponibilidadButacaIds) {
            const token: string = randomBytes(16).toString('hex');

            // Crear la instancia
            const entrada = this.entradaRepo.create({
                token,
                esUsado: false,
                disponibilidadButacaId,
                expiracion,
                venta,
            });

            // Guardarla (ahora tendrá un id)
            await this.entradaRepo.save(entrada);

            entradas.push(entrada);
        }

        return entradas;
    }
}
