import { Injectable } from "@nestjs/common";
import { provinciaRepository } from "../domain/contracts/provincia.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { ProvinciaEntity } from "./provincia.entity";
import { Raw, Repository } from "typeorm";

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
        return await this.repository.findOne({where: {id}});
    }

    async save(provincia: ProvinciaEntity): Promise<ProvinciaEntity> {
        const entity = this.repository.create(provincia)
        return await this.repository.save(entity)
    }

    async obtenerPorNombre(nombre: string): Promise<ProvinciaEntity | null> {
        const nombreLimpio = nombre.trim().toLowerCase();

        const provincias = await this.repository.find();

        const provincia = provincias.find(
            (p) => p.nombre.trim().toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '') ===
            nombreLimpio.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        );

        return provincia ?? null;
    }
}