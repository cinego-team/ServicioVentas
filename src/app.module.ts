import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VentaModule } from './venta/venta.module';
import { EntradaModule } from './entrada/entrada.module';

@Module({
  imports: [VentaModule, EntradaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
