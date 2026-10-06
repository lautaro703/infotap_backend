import { Module } from '@nestjs/common';
import { BarriosController } from './api/controller/barrios.controller';
import { BarriosService } from './service/barrios.service';
import { PostgreBarrioRepository } from './infrastructure/postgres.barrios.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BarrioEntity } from './infrastructure/barrios.entity';
import { CiudadEntity } from '../ciudad/infrastructure/ciudad.entity';
@Module({
  controllers: [BarriosController],
  providers: [BarriosService, PostgreBarrioRepository],
  imports:[TypeOrmModule.forFeature([BarrioEntity])],
  exports:[],
})
export class BarriosModule {}
