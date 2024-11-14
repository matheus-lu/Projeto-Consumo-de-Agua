import { Test, TestingModule } from '@nestjs/testing';
import { ConsumoAguaController } from './consumo_agua.controller';

describe('ConsumoAguaController', () => {
  let controller: ConsumoAguaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsumoAguaController],
    }).compile();

    controller = module.get<ConsumoAguaController>(ConsumoAguaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
