import { Body, Controller, Post, Get, Param, Put, Delete } from '@nestjs/common';
import { EntradaService } from './entrada.service';
import { EntradaInput } from './dto';


@Controller('entrada')
export class EntradaController {
    EntradaService: EntradaService;
    constructor(private readonly entradaService: EntradaService) {
        this.EntradaService = entradaService;
    }
    @Post()
    create(@Body() disponibilidadButacaIds: number[]) {
        return this.entradaService.crearEntradasPorDisponibilidadButacaIds(disponibilidadButacaIds);
    }
}


