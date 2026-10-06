import { Injectable } from "@nestjs/common";
import { BarrioRepository } from "../domain/contracts/barrios.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { BarrioEntity } from "./barrios.entity";
import { Repository } from "typeorm";

@Injectable()
export class PostgreBarrioRepository implements BarrioRepository{
    constructor(
        @InjectRepository(BarrioEntity) private readonly repository:Repository<BarrioEntity>
    ){}

   async findAll(): Promise<BarrioEntity[]> {
        return this.repository.find();
    }

    async findById(id: number): Promise<BarrioEntity | null> {
        return this.repository.findOne({where: {id}});
    }

    async save(barrio: BarrioEntity): Promise<BarrioEntity> {
        const entity= this.repository.create(barrio)
        return this.repository.save(entity)
    }

    async update(id:number, barrio:Partial<BarrioEntity>): Promise<BarrioEntity>{
        return this.repository.save(barrio)
    }
    
    async delete(id: number): Promise<void>{
        await this.repository.delete(id);
    }  
}