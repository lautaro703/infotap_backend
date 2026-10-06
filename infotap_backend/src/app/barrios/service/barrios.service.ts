import { Injectable, NotFoundException } from '@nestjs/common';
import { GetBarrioQuery } from './dtos/get.barrios.query';
import { DeleteBarrioCommand } from './dtos/delete.barrios.command';
import { PostBarrioCommand } from './dtos/post.barrios.command';
import { BarrioEntity } from '../infrastructure/barrios.entity';
import { PutBarrioCommand } from './dtos/put.barrio.command';
import { PostgreBarrioRepository } from '../infrastructure/postgres.barrios.repository';

@Injectable()
export class BarriosService {

    constructor(
        private readonly barrioRepository:PostgreBarrioRepository,
    ){}

    async findAll(){
        return this.barrioRepository.findAll()
    }

    async findById(query: GetBarrioQuery){
        const barrio = await this.barrioRepository.findById(query.id);
        if(!barrio) throw new NotFoundException('el barrio no existe');
        return barrio;
    }

    async update(query: GetBarrioQuery, command: PutBarrioCommand){
        const barrio= await this.barrioRepository.findById(query.id);
        if(!barrio) throw new NotFoundException('barrio no disponible');
        Object.assign(barrio,command);
        return this.barrioRepository.update(barrio.id,barrio);
    }

    async create(command: PostBarrioCommand){
        const barrio= new BarrioEntity();
        Object.assign(barrio,command);
        return this.barrioRepository.save(barrio)
    }

    async delete(command: DeleteBarrioCommand){
        const barrio= await this.barrioRepository.findById(command.id);
        if(!barrio) throw new NotFoundException('barrio no disponible');
        await this.barrioRepository.delete(barrio.id);
    } 
}
