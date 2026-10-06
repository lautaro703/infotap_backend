import { Injectable, NotFoundException } from '@nestjs/common';
import { provinciaRepository } from '../domain/contracts/provincia.repository';
import { NumericType } from 'typeorm';
import { GetProvinciaQuery } from './dtos/get.provincia.query';
import { PostProvinciaCommand } from './dtos/post.provincia.command';
import { ProvinciaEntity } from '../infrastructure/provincia.entity';
import { PostgresProvinciaRepository } from '../infrastructure/postgres.provincia.repository';

@Injectable()
export class ProvinciaService {

    constructor(
        private readonly provinciaRepository:PostgresProvinciaRepository,
    ){}

    async findAll(){
        return this.provinciaRepository.findAll()
    }

    async findById(query: GetProvinciaQuery){
        const provincia = await this.provinciaRepository.findById(query.id);
        if(!provincia) throw new NotFoundException('La provincia no existe');
        return provincia;
    }

    async create(command: PostProvinciaCommand){
        const provincia=new ProvinciaEntity();
        Object.assign(provincia,command);
        return this.provinciaRepository.save(provincia)
    }
}

