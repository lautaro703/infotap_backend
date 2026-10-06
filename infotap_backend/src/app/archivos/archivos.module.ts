import { Module } from '@nestjs/common';
import { ArchivosController } from './api/controller/archivos.controller';
import { ArchivoService } from './service/archivos.service';
import { PostgresArchivoRepository } from './infrastructure/postgres.archivos.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArchivoEntity } from './infrastructure/archivos.entity';

@Module({
  controllers: [ArchivosController],
  providers: [ArchivoService,PostgresArchivoRepository],
  imports: [TypeOrmModule.forFeature([ArchivoEntity])],
  exports:[],
})
export class ArchivoModule {}
