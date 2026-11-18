import { Test, TestingModule } from '@nestjs/testing';
import { ArchivoService } from './archivos.service';

describe('ArchivosService', () => {
  let service: ArchivoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArchivoService],
    }).compile();

    service = module.get<ArchivoService>(ArchivoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
