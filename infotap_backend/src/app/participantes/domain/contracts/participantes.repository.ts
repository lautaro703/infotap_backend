import { ParticipanteEntity } from "../../infrastructure/participantes.entity";
import { participantePropi } from "../entity/participantes";

export abstract class ParticipanteRepository{
    abstract findAll(): Promise<ParticipanteEntity[]>
    abstract findById(id:number):Promise<ParticipanteEntity | null>
    abstract findByDni(dni:number):Promise<ParticipanteEntity | null>
    abstract create(ciudad:ParticipanteEntity): Promise<ParticipanteEntity>;
    abstract update(participante:ParticipanteEntity):Promise<ParticipanteEntity>;
    abstract delete(id:number): Promise<void>
}