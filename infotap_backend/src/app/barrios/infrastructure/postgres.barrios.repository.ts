import { Injectable } from "@nestjs/common";
import { BarrioRepository } from "../domain/contracts/barrios.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { BarrioEntity } from "./barrios.entity";
import { IsNull, Raw, Repository } from "typeorm";

@Injectable()
export class PostgreBarrioRepository implements BarrioRepository{
    constructor(
        @InjectRepository(BarrioEntity) private readonly repository:Repository<BarrioEntity>
    ){}

    async findAll(): Promise<BarrioEntity[]> {
        return await this.repository.find();
    }

    async findById(id: number): Promise<BarrioEntity | null> {
        return await this.repository.findOne({where: {id}});
    }

    async save(barrio: BarrioEntity): Promise<BarrioEntity> {
        const entity= this.repository.create(barrio)
        return await this.repository.save(entity)
    }

    async update(id:number, barrio:Partial<BarrioEntity>): Promise<BarrioEntity>{
        return await this.repository.save(barrio)
    }
    
    async delete(id: number): Promise<void>{
        await this.repository.delete(id);
    }  

    async obtenerOCrear(nombre: string, ciudad_ID: number | null): Promise<BarrioEntity> {

        const nombreLimpio = nombre.trim()

        let barrio = await this.repository.findOne({
            where: {
                nombre: Raw(
                (alias) => `LOWER(${alias}) = LOWER(:nombre)`,
                { nombre: nombreLimpio },
                ),
                ciudad: ciudad_ID ? { id: ciudad_ID } : IsNull(),
            },
            relations: {
                ciudad: {
                provincia: true,
                },
            },
        });

        if(!barrio){
            const nuevoBarrio = this.repository.create({
                nombre: nombreLimpio,ciudad:ciudad_ID ? ({id:ciudad_ID} as any):null,latitud: null,longitud: null,
            });
            barrio =await this.repository.save(nuevoBarrio);
        }

        return barrio;
    }
}