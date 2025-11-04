import { Controller } from '@nestjs/common';
import { EstadoVentaService } from './estado-venta.service';

@Controller('estado-venta')
export class EstadoVentaController {
  constructor(private readonly estadoVentaService: EstadoVentaService) {}
}
