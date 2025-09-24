import { Controller,Post,Body,Get,Param } from '@nestjs/common';
import { VentaService } from './venta.service';
import { VentaInput } from './dto';


@Controller('venta')
export class VentaController {
  constructor(private readonly ventaService: VentaService) {
    this.ventaService=ventaService;
  }
    @Post()
    create(@Body() dato: VentaInput) {
      return this.ventaService.nuevaVenta(dato);
    }
    @Get()
    findAllVenta() {
      return this.ventaService.findAll();
    }
    @Get(':id')
     getEntradaById(@Param("id") id: number) {
          return this.ventaService.getVentaById(id);
      }
}
