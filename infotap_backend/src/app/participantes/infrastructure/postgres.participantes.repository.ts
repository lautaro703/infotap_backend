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

    async findAll(): Promise<ParticipanteEntity[]> {
        return await this.repository.find({
            relations:{
                barrio:{
                    ciudad:{
                        provincia:true
                    },
                },
                genero:true,
                analisis:true,
            }
        });
    }

    async findByDni(dni: number): Promise<ParticipanteEntity | null> {
        const participante = await this.repository.findOne({
            where: { dni },
            relations: {
            analisis: true,
            },
        });

        console.log('BUSQUEDA DIRECTA EN REPOSITORIO:', {
            dniBuscado: dni,
            participanteEncontrado: participante?.id ?? null,
        });

        return participante;
    }
    
    async findById(id: number): Promise<ParticipanteEntity | null> {
        return await this.repository.findOne({where: {id}});
    }

    async update(participante: ParticipanteEntity): Promise<ParticipanteEntity> {
        return await this.repository.save(participante)
    }

    async create(participante: ParticipanteEntity): Promise<ParticipanteEntity> {
        const entity= this.repository.create(participante)
        return await this.repository.save(entity)
    }

    async delete(id: number): Promise<void>{
        await this.repository.delete(id);
    }

}