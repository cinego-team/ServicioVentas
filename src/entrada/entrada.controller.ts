import { Body, Controller,Post,Get,Param,Put,Delete } from '@nestjs/common';
import { EntradaService } from './entrada.service';
import { EntradaInput } from './dto';


@Controller('entrada')
export class EntradaController {
  EntradaService:EntradaService;
  constructor(private readonly entradaService: EntradaService) {
    this.EntradaService=entradaService;
  }
  @Post()
  create(@Body() dato: EntradaInput) {
    return this.entradaService.nuevaEntrada(dato);
  }
  @Get()
  findAllEntrada() {
    return this.entradaService.findAll();
  }
  @Get(':id')
   getEntradaById(@Param("id") id: number) {
        return this.entradaService.getEntradaById(id);
    }
  @Put("edit/:id")
    updateEntrada(
        @Param("id") id: number,
        @Body() entrada: EntradaInput,
    ) {
        return this.entradaService.updateEntrada(id, entrada);
    }
  //patch por ver porque solo es un campo
   @Delete(":id")
    deleteEntrada(@Param("id") id: number) {
        return this.entradaService.deleteEntradaById(id);
    }

}


