import { Injectable } from "@nestjs/common";
import { CiudadRepository } from "../domain/contracts/ciudad.repository";
import { CiudadEntity } from "./ciudad.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class PostgresCiudadRepository implements CiudadRepository{
    constructor(
        @InjectRepository(CiudadEntity) private readonly repository:Repository<CiudadEntity>
    ){}

    findAll(): Promise<CiudadEntity[]> {
        return this.repository.find();
    }

    findById(id: number): Promise<CiudadEntity | null> {
        return this.repository.findOne({where: {id}});
    }

    create(ciudad: CiudadEntity): Promise<CiudadEntity> {
        const entity= this.repository.create(ciudad)
        return this.repository.save(entity)
    }

    update(id:number, ciudad:Partial<CiudadEntity>): Promise<CiudadEntity>{
        return this.repository.save(ciudad)
    }
    
    async delete(id: number): Promise<void>{
        await this.repository.delete(id);
    }

}