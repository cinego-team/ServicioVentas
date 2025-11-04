import { Controller, Post, Body, Get, Param, Req } from '@nestjs/common';
import { VentaService } from './venta.service';
import { CerrarVentaInput, RequestWithUser, VentaInput } from './dto';

@Controller('venta')
export class VentaController {
    constructor(private readonly ventaService: VentaService) {
        this.ventaService = ventaService;
    }
    /*
    @Get()
    findAllVenta() {
        return this.ventaService.findAll();
    }
    @Get(':id')
    getEntradaById(@Param('id') id: number) {
        return this.ventaService.getVentaById(id);
    }
*/
    @Post('abrir-venta')
    abrirVenta(@Req() req: RequestWithUser, @Body() dato: VentaInput) {
        return this.ventaService.abrirVenta(req.user, dato);
    }
    @Post('cerrar-venta/:id')
    cerrarVenta(@Param('id') id: number, @Body() data: CerrarVentaInput) {
        return this.ventaService.cerrarVenta(data);
    }
}
