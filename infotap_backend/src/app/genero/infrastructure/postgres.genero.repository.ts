import { GeneroRepository } from "../domain/contracts/genero.repository";
import { Injectable, NotFoundException, Options } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm"
import { GeneroEntity } from "./genero.entity";
import { Raw, Repository } from "typeorm";
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
        return await this.repository.findOne({where: {id}});
    }

    async save(genero: GeneroEntity): Promise<GeneroEntity> {
        const entity= this.repository.create(genero)
        return await this.repository.save(entity);
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete(id)
    }

    async update(id:number, genero:Partial<GeneroEntity>): Promise<GeneroEntity>{
        return await this.repository.save(genero)
    }
    
    async obtenerPorTipo(tipo: string): Promise<GeneroEntity> {
        const tipoLimpio = tipo.trim();
        let genero = await this.repository.findOne({
          where: [
           { tipo: Raw((alias) => `LOWER(${alias}) = LOWER(:tipo)`, { tipo: tipoLimpio }) }
         ],
        });
        if (!genero) {
          genero = await this.repository.findOne({
          where: [
            { tipo: Raw((alias) => `LOWER(${alias}) = 'otro'`) },
            { tipo: Raw((alias) => `LOWER(${alias}) = 'x'`) },
          ],
         });
        }

        if (!genero) {
          throw new NotFoundException(`No se encontró un género compatible para: ${tipo}`);
        }
        return genero;
  }
}