import { Module } from '@nestjs/common';
import { VentaService } from './venta.service';
import { VentaController } from './venta.controller';
import { EntradaModule } from 'src/entrada/entrada.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venta } from 'src/entities/venta.entity';
import { EstadoVenta } from 'src/entities/estadoVenta.entity';
import { Entrada } from 'src/entities/entrada.entity';
import { EstadoVentaModule } from 'src/estado-venta/estado-venta.module';

@Module({
    controllers: [VentaController],
    providers: [VentaService],
    imports: [TypeOrmModule.forFeature([Venta, EstadoVenta, Entrada]), EntradaModule, EstadoVentaModule],
})
export class VentaModule { }
