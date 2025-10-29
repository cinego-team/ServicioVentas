import { Module } from '@nestjs/common';
import { EntradaService } from './entrada.service';
import { EntradaController } from './entrada.controller';
import { Entrada } from 'src/entities/entrada.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Entrada])],
    controllers: [EntradaController],
    providers: [EntradaService],
    exports: [EntradaService],
})
export class EntradaModule { }
