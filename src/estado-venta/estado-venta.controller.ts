import { Controller, Delete, Post, Get, Param, Body } from '@nestjs/common';
import { EstadoVentaService } from './estado-venta.service';
import { estadoVentaInput } from './dto';

@Controller('estado-venta')
export class EstadoVentaController {
    constructor(private readonly estadoVentaService: EstadoVentaService) {
        this.estadoVentaService = estadoVentaService;
    }
    @Post()
    crearEstadoVenta(@Body() dato: estadoVentaInput) {
        return this.estadoVentaService.crearEstadoVenta(dato);
    }
    @Get()
    findAllEstadoVenta() {
        return this.estadoVentaService.findAllEstadoVenta();
    }
    @Get(':id')
    getEstadoVentaById(@Param('id') id: number) {
        return this.estadoVentaService.getEstadoVentaById(id);
    }
    @Delete(':id')
    eliminarEstadoVenta(@Param('id') id: number) {
        return this.estadoVentaService.eliminarEstadoVenta(id);
    }
}
