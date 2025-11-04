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
    ) { }

    async crearEntradasPorDisponibilidadButacaIds(
        disponibilidadButacaIds: number[],
        expiracion: Date
    ): Promise<Entrada[]> {
        const entradas: Entrada[] = [];
        for (const disponibilidadButacaId of disponibilidadButacaIds) {
            const token: string = randomBytes(16).toString('hex');


            // Crear la instancia
            const entrada = this.entradaRepo.create({ token, codigoSeguridad: '', esUsado: false, disponibilidadButacaId, expiracion });

            // Guardarla (ahora tendrá un id)
            await this.entradaRepo.save(entrada);

            // Generar el código usando el id recién asignado
            entrada.codigoSeguridad = `${entrada.id}-${entrada.disponibilidadButacaId}`;

            // Actualizar la entrada con el código
            await this.entradaRepo.save(entrada);

            console.log(entrada);
            entradas.push(entrada);
        }

        return entradas;
    }
}
