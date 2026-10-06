import { Module } from '@nestjs/common';
import { AnalisisController } from './api/controller/analisis.controller';
import { AnalisisService } from './service/analisis.service';
import { PostgresAnalisisRepository } from './infrastructure/postgres.analisis.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalisisEntity } from './infrastructure/analisis.entity';

@Module({
  controllers: [AnalisisController],
  providers: [AnalisisService,PostgresAnalisisRepository],
  imports:[TypeOrmModule.forFeature([AnalisisEntity])],
  exports:[],
})
export class AnalisisModule {}
