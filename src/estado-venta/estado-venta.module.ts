import { Module } from '@nestjs/common';
import { EstadoVentaService } from './estado-venta.service';
import { EstadoVentaController } from './estado-venta.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstadoVenta } from 'src/entities/estadoVenta.entity';

@Module({
    controllers: [EstadoVentaController],
    providers: [EstadoVentaService],
    imports: [TypeOrmModule.forFeature([EstadoVenta])],
})
export class EstadoVentaModule { }
