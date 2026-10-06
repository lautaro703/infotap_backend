import { Module } from '@nestjs/common';
import { ParticipantesController } from './api/controller/participantes.controller';
import { ParticipantesService } from './service/participantes.service';
import { PostgresParticiopanteRepository } from './infrastructure/postgres.participantes.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParticipanteEntity } from './infrastructure/participantes.entity';

@Module({
  controllers: [ParticipantesController],
  providers: [ParticipantesService,PostgresParticiopanteRepository],
  imports: [TypeOrmModule.forFeature([ParticipanteEntity])],
  exports:[],
})
export class ParticipantesModule {}
