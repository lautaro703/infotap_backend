import { Test, TestingModule } from '@nestjs/testing';
import { GeolocalizacionService } from './geolocalizacion.service';

describe('GeolocalizacionService', () => {
  let service: GeolocalizacionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeolocalizacionService],
    }).compile();

    service = module.get<GeolocalizacionService>(GeolocalizacionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
