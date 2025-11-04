import { Body, Controller, Post, Get, Param, Put, Delete } from '@nestjs/common';
import { EntradaService } from './entrada.service';
import { CrearEntradaInputDto } from './dto';


@Controller('entrada')
export class EntradaController {
    EntradaService: EntradaService;
    constructor(private readonly entradaService: EntradaService) {
        this.EntradaService = entradaService;
    }
    @Post()
    create(@Body() data: CrearEntradaInputDto) {
        return this.entradaService.crearEntradasPorDisponibilidadButacaIds(data.disponibilidadButacaIds, data.expiracion);
    }
}


