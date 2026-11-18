import { Injectable } from "@nestjs/common";
import { analisisRepository } from "../domain/contracts/analisis.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { AnalisisEntity } from "./analisis.entity";
import { Repository } from "typeorm";

@Injectable()
export class PostgresAnalisisRepository implements analisisRepository{
    constructor(
        @InjectRepository(AnalisisEntity) private readonly repository:Repository<AnalisisEntity>
    ){}

    async findAll(): Promise<AnalisisEntity[]> {
        return await this.repository.find({relations: ['archivo']});
    }

    async findById(id: number): Promise<AnalisisEntity | null> {
        return await this.repository.findOne({where: {id}});
    }

    async create(analisis: AnalisisEntity): Promise<AnalisisEntity> {
        const entity= this.repository.create(analisis)
        return await this.repository.save(entity)
    }
    
    async delete(id: number): Promise<void>{
        await this.repository.delete(id);
    }

    async update(id:number, analisis:Partial<AnalisisEntity>): Promise<AnalisisEntity>{
        return await this.repository.save({...analisis, id})
    }

}