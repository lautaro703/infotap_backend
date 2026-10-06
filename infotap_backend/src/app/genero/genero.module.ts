import { Module } from '@nestjs/common';
import { GeneroController } from './api/controller/genero.controller';
import { GeneroService } from './service/genero.service';
import { PostgresGeneroRepository } from './infrastructure/postgres.genero.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeneroEntity } from './infrastructure/genero.entity';
@Module({
  controllers: [GeneroController],
  providers: [GeneroService,PostgresGeneroRepository],
  imports: [TypeOrmModule.forFeature([GeneroEntity])],
  exports:[],
})
export class GeneroModule {}
