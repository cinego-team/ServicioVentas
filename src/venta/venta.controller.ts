import { Controller, Post, Body, Get, Param, Req, Query } from '@nestjs/common';
import { VentaService } from './venta.service';
import { CerrarVentaInput, RequestWithUser, VentaInput } from './dto';

@Controller('venta')
export class VentaController {
    constructor(private readonly ventaService: VentaService) {
        this.ventaService = ventaService;
    }

    @Get('admin/all')
    findAllVenta() {
        return this.ventaService.getVentas();
    }
    /*
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
    @Get('reportes/horarios-mas-elegidos/actual')
    async getHorariosMasElegidos() {
        return this.ventaService.getHorariosMasElegidos();
    }
    @Get('reportes/entradas-por-dia-semana/actual')
    async getEntradasPorDiaSemanaMesActual() {
        return await this.ventaService.getEntradasPorDiaSemanaMesActual();
    }
}
