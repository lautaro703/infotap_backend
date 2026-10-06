import { Module } from '@nestjs/common';
import { CiudadController } from './api/controller/ciudad.controller';
import { CiudadService } from './service/ciudad.service';
import { PostgresCiudadRepository } from './infrastructure/postgres.ciudad.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CiudadEntity } from './infrastructure/ciudad.entity';

@Module({
  controllers: [CiudadController],
  imports: [TypeOrmModule.forFeature([CiudadEntity])],
  providers: [CiudadService,PostgresCiudadRepository],
  exports:[],
})
export class CiudadModule {}
