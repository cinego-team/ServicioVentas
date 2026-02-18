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
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: Number(process.env.PUERTO_BD),
            database: process.env.PG_DATABASE_MS_USUARIOS,
            username: process.env.PG_USERNAME,
            password: process.env.PG_PASSWORD,
            synchronize: true,
            entities: [Venta, Entrada, EstadoVenta],
        }),
        VentaModule, EntradaModule, EstadoVentaModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
