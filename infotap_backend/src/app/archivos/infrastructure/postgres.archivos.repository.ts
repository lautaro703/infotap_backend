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

    findAll(): Promise<ArchivoEntity[]> {
        return this.repository.find();
    }

    findById(id: number): Promise<ArchivoEntity | null> {
        return this.repository.findOne({where: {id}});
    }

    create(archivo: ArchivoEntity): Promise<ArchivoEntity> {
        const entity= this.repository.create(archivo)
        return this.repository.save(entity)
    }
    
    async delete(id: number): Promise<void>{
        await this.repository.delete(id);
    }

}