import { Injectable, NotFoundException } from '@nestjs/common';
import { GeneroRepository } from '../domain/contracts/genero.repository';
import { PostGeneroCommand } from './dtos/post.genero.command';
import { GeneroEntity } from '../infrastructure/genero.entity';
import { DeleteGeneroCommand } from './dtos/delete.genero.command';
import { GetGeneroQuery } from './dtos/get.genero.query';
import { PostgresGeneroRepository } from '../infrastructure/postgres.genero.repository';

@Injectable()
export class GeneroService {

    constructor(
        private readonly generoRepository:PostgresGeneroRepository,
    ){}

    async findAll(){
        return this.generoRepository.findAll()
    }

    async findById(query: GetGeneroQuery){
        const genero = await this.generoRepository.findById(query.id);
        if(!genero) throw new NotFoundException('el genero no existe');
        return genero;
    }

    async create(command: PostGeneroCommand){
        const genero= new GeneroEntity();
        Object.assign(genero,command);
        return this.generoRepository.save(genero)
    }

    async delete(command: DeleteGeneroCommand){
        const genero= await this.generoRepository.findById(command.id);
        if(!genero) throw new NotFoundException('ciudad no disponible');
        await this.generoRepository.delete(genero.id);
    }
}
