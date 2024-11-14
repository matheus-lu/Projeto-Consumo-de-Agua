import { Test, TestingModule } from '@nestjs/testing';
import { ConsumoAguaService } from './consumo_agua.service';

describe('ConsumoAguaService', () => {
  let service: ConsumoAguaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConsumoAguaService],
    }).compile();

    service = module.get<ConsumoAguaService>(ConsumoAguaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
