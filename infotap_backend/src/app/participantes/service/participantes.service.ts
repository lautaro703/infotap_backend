import { Injectable, NotFoundException } from '@nestjs/common';
import { PostgresParticiopanteRepository } from '../infrastructure/postgres.participantes.repository';
import { DeleteParticipanteCommand } from './dtos/delete.participantes.command';
import { PostParticipanteCommand } from './dtos/post.participantes.command';
import { GetParticipanteQuery } from './dtos/get.participantes.query';
import { ParticipanteEntity } from '../infrastructure/participantes.entity';

@Injectable()
export class ParticipantesService {
    constructor(
        private readonly participanteRepository: PostgresParticiopanteRepository
    ){}

    findAll():Promise<ParticipanteEntity[]>{
        return this.participanteRepository.findAll();
    }

    async findById(query: GetParticipanteQuery){
        const participante= await this.participanteRepository.findById(query.id)
        if (!participante) throw new NotFoundException('participante no disponible');
        return participante;
    }

    async create(command: PostParticipanteCommand){
        const participante = new ParticipanteEntity();
        Object.assign(participante, command);
        return this.participanteRepository.create(participante);
    }

    async delete(command: DeleteParticipanteCommand):Promise<void>{
        const participante= await this.participanteRepository.findById(command.id);
        if(!participante) throw new NotFoundException('participante no disponible');
        await this.participanteRepository.delete(participante.id);
    } 
}
