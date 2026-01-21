import { Controller, Post, Body, Get, Param, Req, Query } from '@nestjs/common';
import { VentaService } from './venta.service';
import { CerrarVentaInput, VentaInput } from './dto';
import { DefaultValuePipe, ParseIntPipe } from '@nestjs/common/pipes';

@Controller('venta')
export class VentaController {
    constructor(private readonly ventaService: VentaService) {}

    @Post('abrir-venta')
    abrirVenta(@Body() dato: any) {
        // Extraemos el usuarioId que viene en el body desde el Gateway
        const usuario = { id: dato.usuarioId }; 
        
        // El resto son los datos de la venta
        const ventaInput: VentaInput = {
            funcionId: dato.funcionId,
            disponibilidadButacaIds: dato.disponibilidadButacaIds
        };

        console.log('📦 Procesando en Microservicio para usuario:', usuario.id);
        return this.ventaService.abrirVenta(usuario, ventaInput);
    }

    @Get('admin/all')
    findAllVenta() {
        return this.ventaService.getVentas();
    }

    @Post('cerrar-venta/:id')
    cerrarVenta(@Param('id') id: number, @Body() data: CerrarVentaInput) {
        return this.ventaService.cerrarVenta(data);
    }

    @Get('admin/reportes/horarios-mas-elegidos/actual')
    async getHorariosMasElegidos() {
        return this.ventaService.getHorariosMasElegidos();
    }

    @Get('admin/reportes/entradas-por-dia-semana/actual')
    async getEntradasPorDiaSemanaMesActual() {
        return await this.ventaService.getEntradasPorDiaSemanaMesActual();
    }

    @Get('admin/reportes/peliculas-rango-ventas/trimestral')
    getPeliculasPorRangoVentasTrimestral(
        @Query('trimestre', new DefaultValuePipe(Math.ceil((new Date().getMonth() + 1) / 3)), ParseIntPipe) trimestre: number,
        @Query('anio', new DefaultValuePipe(new Date().getFullYear()), ParseIntPipe) anio: number,
    ) {
        return this.ventaService.getPeliculasPorRangoVentasTrimestral(trimestre, anio);
    }
}
