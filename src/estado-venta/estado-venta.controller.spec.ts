import { Test, TestingModule } from '@nestjs/testing';
import { EstadoVentaController } from './estado-venta.controller';
import { EstadoVentaService } from './estado-venta.service';

describe('EstadoVentaController', () => {
  let controller: EstadoVentaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstadoVentaController],
      providers: [EstadoVentaService],
    }).compile();

    controller = module.get<EstadoVentaController>(EstadoVentaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
