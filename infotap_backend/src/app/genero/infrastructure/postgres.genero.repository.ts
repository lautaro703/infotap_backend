import { GeneroRepository } from "../domain/contracts/genero.repository";
import { Injectable, Options } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm"
import { GeneroEntity } from "./genero.entity";
import { Repository } from "typeorm";
import { read } from "fs";
@Injectable()
export class PostgresGeneroRepository implements GeneroRepository{
    
    constructor(
        @InjectRepository(GeneroEntity)
        private readonly repository: Repository<GeneroEntity>,
    ){}

    async findAll(){
        return await this.repository.find();
    }

    async findById(id: number): Promise<GeneroEntity | null> {
        return  this.repository.findOne({where: {id}});
    }

    async save(genero: GeneroEntity): Promise<GeneroEntity> {
        const entity= this.repository.create(genero)
        return this.repository.save(entity);
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete(id)
    }

}