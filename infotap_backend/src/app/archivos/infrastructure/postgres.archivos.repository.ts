import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ArchivoEntity } from "./archivos.entity";
import { ArchivoRepository } from "../domain/contracts/archivos.repository";
import { Repository } from "typeorm";

@Injectable()
export class PostgresArchivoRepository implements ArchivoRepository{
    constructor(
        @InjectRepository(ArchivoEntity) private readonly repository:Repository<ArchivoEntity>
    ){}

    async findAll(): Promise<ArchivoEntity[]> {
        return await this.repository.find();
    }

    async findById(id: number): Promise<ArchivoEntity | null> {
        return await this.repository.findOne({where: {id}});
    }

    async create(archivo: ArchivoEntity): Promise<ArchivoEntity> {
        const entity= this.repository.create(archivo)
        return await this.repository.save(entity)
    }
    
    async delete(id: number): Promise<void>{
        await this.repository.delete(id);
    }

}