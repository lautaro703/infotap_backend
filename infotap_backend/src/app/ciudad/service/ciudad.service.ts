import { Injectable, NotFoundException } from '@nestjs/common';
import { PostgresCiudadRepository } from '../infrastructure/postgres.ciudad.repository';
import { CiudadEntity } from '../infrastructure/ciudad.entity';
import { GetCiudadQuery } from './dtos/get.ciudad.query';
import { PostCiudadCommand } from './dtos/post.ciudad.command';
import { PutCiudadCommand } from './dtos/put.ciudad.command';
import { DeleteCiudadCommand } from './dtos/delete.ciudad.command';

@Injectable()
export class CiudadService {
    constructor(
        private readonly ciudadRepository: PostgresCiudadRepository
    ){}

    findAll():Promise<CiudadEntity[]>{
        return this.ciudadRepository.findAll();
    }

    async findById(query: GetCiudadQuery){
        const ciudad= await this.ciudadRepository.findById(query.id)
        if (!ciudad) throw new NotFoundException('ciudad no disponible');
        return ciudad;
    }

    async create(command: PostCiudadCommand){
        const ciudad = new CiudadEntity();
        Object.assign(ciudad, command);
        return this.ciudadRepository.create(ciudad);
    }

    async update(query: GetCiudadQuery, command: PutCiudadCommand){
        const ciudad= await this.ciudadRepository.findById(query.id);
        if(!ciudad) throw new NotFoundException('ciudad no disponible');
        Object.assign(ciudad,command);
        return this.ciudadRepository.update(ciudad.id,ciudad);
    }

    async delete(command: DeleteCiudadCommand):Promise<void>{
        const ciudad= await this.ciudadRepository.findById(command.id);
        if(!ciudad) throw new NotFoundException('ciudad no disponible');
        await this.ciudadRepository.delete(ciudad.id);
    } 
}
