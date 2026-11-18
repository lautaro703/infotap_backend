import { Module } from '@nestjs/common';
import { BarriosController } from './api/controller/barrios.controller';
import { BarriosService } from './service/barrios.service';
import { PostgreBarrioRepository } from './infrastructure/postgres.barrios.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeolocalizacionService } from '../geolocalizacion/service/geolocalizacion.service';
import { BarrioEntity } from './infrastructure/barrios.entity';
@Module({
  controllers: [BarriosController],
  providers: [BarriosService, PostgreBarrioRepository, GeolocalizacionService],
  imports:[TypeOrmModule.forFeature([BarrioEntity])],
  exports:[BarriosService],
})
export class BarriosModule {}
