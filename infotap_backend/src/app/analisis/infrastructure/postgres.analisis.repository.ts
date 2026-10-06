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

    findAll(): Promise<AnalisisEntity[]> {
        return this.repository.find();
    }

    findById(id: number): Promise<AnalisisEntity | null> {
        return this.repository.findOne({where: {id}});
    }

    create(analisis: AnalisisEntity): Promise<AnalisisEntity> {
        const entity= this.repository.create(analisis)
        return this.repository.save(entity)
    }
    
    async delete(id: number): Promise<void>{
        await this.repository.delete(id);
    }

}