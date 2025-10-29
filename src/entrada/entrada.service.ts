import { Injectable, BadRequestException } from '@nestjs/common';
import { Entrada } from '../entities/entrada.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta } from '../entities/venta.entity';
import { EntradaInput, EntradaResponse } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EntradaService {
    constructor(
        @InjectRepository(Entrada)
        private readonly entradaRepo: Repository<Entrada>,
    ) { }

    async crearEntradasPorDisponibilidadButacaIds(
        disponibilidadButacaIds: number[],
    ): Promise<Entrada[]> {
        const entradas: Entrada[] = [];
        for (const disponibilidadButacaId of disponibilidadButacaIds) {
            // Crear la instancia
            const entrada = this.entradaRepo.create({ disponibilidadButacaId, codigoSeguridad: '' });

            // Guardarla (ahora tendrá un id)
            await this.entradaRepo.save(entrada);

            // Generar el código usando el id recién asignado
            entrada.codigoSeguridad = bcrypt.hashSync(
                `${entrada.id}-${entrada.disponibilidadButacaId}`,
                10
            );

            // Actualizar la entrada con el código
            await this.entradaRepo.save(entrada);

            console.log(entrada);
            entradas.push(entrada);
        }

        return entradas;
    }
}
