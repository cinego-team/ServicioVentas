import { Test, TestingModule } from '@nestjs/testing';
import { EntradaController } from './entrada.controller';
import { EntradaService } from './entrada.service';

describe('EntradaController', () => {
  let controller: EntradaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EntradaController],
      providers: [EntradaService],
    }).compile();

    controller = module.get<EntradaController>(EntradaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
