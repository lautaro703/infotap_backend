import { Injectable } from "@nestjs/common";
import { provinciaRepository } from "../domain/contracts/provincia.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { ProvinciaEntity } from "./provincia.entity";
import { Repository } from "typeorm";

@Injectable()
export class PostgresProvinciaRepository implements provinciaRepository{

    constructor(
        @InjectRepository(ProvinciaEntity)
        private readonly repository: Repository<ProvinciaEntity>
    ){}

    async findAll(){
        return await this.repository.find()
    }

    async findById(id: number): Promise<ProvinciaEntity | null> {
        return this.repository.findOne({where: {id}});
    }

    async save(provincia: ProvinciaEntity): Promise<ProvinciaEntity> {
        const entity = this.repository.create(provincia)
        return this.repository.save(entity)
    }
}