import { Injectable, NotFoundException } from '@nestjs/common';
import { PostgresAnalisisRepository } from '../infrastructure/postgres.analisis.repository';
import { AnalisisEntity } from '../infrastructure/analisis.entity';
import { GetAnalisisQuery } from './dtos/get.analisis.query';
import { PostAnalisisCommand } from './dtos/post.analisisi.command';
import { DeleteAnalisisCommand } from './dtos/delete.analisis.command';
import { PutAnalisisCommand } from './dtos/put.analisis.command';

@Injectable()
export class AnalisisService {
    constructor(
        private readonly analisisRepository: PostgresAnalisisRepository
    ){}

    async findAll():Promise<AnalisisEntity[]>{
        return this.analisisRepository.findAll();
    }

    async findById(query: GetAnalisisQuery){
        const analisis= await this.analisisRepository.findById(query.id)
        if (!analisis) throw new NotFoundException('analisis no disponible');
        return analisis;
    }

    async create(command: PostAnalisisCommand){
        const analisis = new AnalisisEntity();
        Object.assign(analisis, command);
        return this.analisisRepository.create(analisis);
    }

    async delete(command: DeleteAnalisisCommand):Promise<void>{
        const analisis= await this.analisisRepository.findById(command.id);
        if(!analisis) throw new NotFoundException('analisis no disponible');
        await this.analisisRepository.delete(analisis.id);
    } 

    async update(query: GetAnalisisQuery, command: PutAnalisisCommand) {
        const analisis = await this.analisisRepository.findById(query.id);
        if (!analisis) {
            throw new NotFoundException('Análisis no disponible');
        }
        Object.assign(analisis, command);
        return await this.analisisRepository.update(analisis.id, analisis);
    }
}
