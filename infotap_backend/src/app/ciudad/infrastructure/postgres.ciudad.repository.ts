import { Injectable } from "@nestjs/common";
import { CiudadRepository } from "../domain/contracts/ciudad.repository";
import { CiudadEntity } from "./ciudad.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Raw, Repository } from "typeorm";

@Injectable()
export class PostgresCiudadRepository implements CiudadRepository{
    constructor(
        @InjectRepository(CiudadEntity) private readonly repository:Repository<CiudadEntity>
    ){}

    async findAll(): Promise<CiudadEntity[]> {
        return await this.repository.find();
    }

    async findById(id: number): Promise<CiudadEntity | null> {
        return await this.repository.findOne({where: {id}});
    }

    async create(ciudad: CiudadEntity): Promise<CiudadEntity> {
        const entity= this.repository.create(ciudad)
        return await this.repository.save(entity)
    }

    async update(id:number, ciudad:Partial<CiudadEntity>): Promise<CiudadEntity>{
        return await this.repository.save(ciudad)
    }
    
    async delete(id: number): Promise<void>{
        await this.repository.delete(id);
    }

    async obtenerOCrear(nombre: string, provincia_ID: number | null): Promise<CiudadEntity> {
    const nombreLimpio = nombre.trim();

    let ciudad = await this.repository.findOne({
      where: {
        nombre: Raw((alias) => `LOWER(${alias}) = LOWER(:nombre)`, { nombre: nombreLimpio }),
        provincia: provincia_ID ? { id: provincia_ID } : IsNull(),
      },
    });

    if (!ciudad) {
      const nuevaCiudad = this.repository.create({
        nombre: nombreLimpio,
        provincia: provincia_ID ? ({ id: provincia_ID } as any) : null,
      });
      ciudad = await this.repository.save(nuevaCiudad);
    }

    return ciudad;
  }
}