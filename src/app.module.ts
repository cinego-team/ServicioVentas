import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VentaModule } from './venta/venta.module';
import { EntradaModule } from './entrada/entrada.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entrada } from './entities/entrada.entity';
import { Venta } from './entities/venta.entity';
import { EstadoVenta } from './entities/estadoVenta.entity';
import { EstadoVentaModule } from './estado-venta/estado-venta.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "postgres",
            url: process.env.PG_MSVENTAS,
            ssl: { rejectUnauthorized: false },
            autoLoadEntities: true,
            synchronize: true,
            entities: [Venta, Entrada, EstadoVenta],
        }),
        VentaModule, EntradaModule, EstadoVentaModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
