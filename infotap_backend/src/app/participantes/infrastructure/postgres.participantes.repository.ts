import { Injectable } from "@nestjs/common";
import { ParticipanteRepository } from "../domain/contracts/participantes.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { ParticipanteEntity } from "./participantes.entity";
import { Repository } from "typeorm";

@Injectable()
export class PostgresParticiopanteRepository implements ParticipanteRepository{
    constructor(
        @InjectRepository(ParticipanteEntity) private readonly repository:Repository<ParticipanteEntity>
    ){}

    findAll(): Promise<ParticipanteEntity[]> {
        return this.repository.find();
    }

    findById(id: number): Promise<ParticipanteEntity | null> {
        return this.repository.findOne({where: {id}});
    }

    create(participante: ParticipanteEntity): Promise<ParticipanteEntity> {
        const entity= this.repository.create(participante)
        return this.repository.save(entity)
    }

    async delete(id: number): Promise<void>{
        await this.repository.delete(id);
    }

}