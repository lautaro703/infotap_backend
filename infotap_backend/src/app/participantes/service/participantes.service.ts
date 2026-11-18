import { Injectable, NotFoundException } from '@nestjs/common';
import { PostgresParticiopanteRepository } from '../infrastructure/postgres.participantes.repository';
import { DeleteParticipanteCommand } from './dtos/delete.participantes.command';
import { PostParticipanteCommand } from './dtos/post.participantes.command';
import { GetParticipanteQuery } from './dtos/get.participantes.query';
import { ParticipanteEntity } from '../infrastructure/participantes.entity';
import { PutParticipanteCommand } from './dtos/put.participantes.command';

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

    async findByDni(dni:number){
        return await this.participanteRepository.findByDni(dni)
    }

    async update(command: PutParticipanteCommand) {
        const participante = await this.participanteRepository.findById(
            command.id
        );

        if (!participante) {
            throw new NotFoundException('Participante no disponible');
        }

        participante.analisis = command.analisis;

        return await this.participanteRepository.update(participante);
    }

    async delete(command: DeleteParticipanteCommand):Promise<void>{
        const participante= await this.participanteRepository.findById(command.id);
        if(!participante) throw new NotFoundException('participante no disponible');
        await this.participanteRepository.delete(participante.id);
    } 
}
