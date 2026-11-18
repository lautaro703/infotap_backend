import { Module } from '@nestjs/common';
import { ArchivosController } from './api/controller/archivos.controller';
import { ArchivoService } from './service/archivos.service';
import { PostgresArchivoRepository } from './infrastructure/postgres.archivos.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArchivoEntity } from './infrastructure/archivos.entity';
import { GeneroModule } from '../genero/genero.module';
import { BarriosModule } from '../barrios/barrios.module';
import { CiudadModule } from '../ciudad/ciudad.module';
import { AnalisisModule } from '../analisis/analisis.module';
import { ParticipantesModule } from '../participantes/participantes.module';
import { ProvinciaModule } from '../provincia/provincia.module';

@Module({
  controllers: [ArchivosController],
  providers: [ArchivoService,PostgresArchivoRepository],
  imports: [TypeOrmModule.forFeature([ArchivoEntity]),GeneroModule,BarriosModule,CiudadModule,AnalisisModule,ParticipantesModule,ProvinciaModule],
  exports:[],
})
export class ArchivoModule {}
