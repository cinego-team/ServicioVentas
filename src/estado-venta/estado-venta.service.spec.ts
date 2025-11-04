import { Test, TestingModule } from '@nestjs/testing';
import { EstadoVentaService } from './estado-venta.service';

describe('EstadoVentaService', () => {
  let service: EstadoVentaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EstadoVentaService],
    }).compile();

    service = module.get<EstadoVentaService>(EstadoVentaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
