import { Module } from '@nestjs/common';
import { VentaService } from './venta.service';
import { VentaController } from './venta.controller';
import { EntradaModule } from 'src/entrada/entrada.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venta } from 'src/entities/venta.entity';

@Module({
    controllers: [VentaController],
    providers: [VentaService],
    imports: [TypeOrmModule.forFeature([Venta]), EntradaModule],
})
export class VentaModule { }
