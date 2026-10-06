import { Module } from '@nestjs/common';
import { ProvinciaController } from './api/controller/provincia.controller';
import { ProvinciaService } from './service/provincia.service';
import { PostgresProvinciaRepository } from './infrastructure/postgres.provincia.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProvinciaEntity } from './infrastructure/provincia.entity';

@Module({
  controllers: [ProvinciaController],
  providers: [ProvinciaService,PostgresProvinciaRepository],
  imports: [TypeOrmModule.forFeature([ProvinciaEntity])],
  exports:[],
})
export class ProvinciaModule {}
