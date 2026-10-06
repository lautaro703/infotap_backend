import { ParticipanteEntity } from "../../infrastructure/participantes.entity";

export abstract class ParticipanteRepository{

    abstract findAll(): Promise<ParticipanteEntity[]>

    abstract findById(id:number):Promise<ParticipanteEntity | null>

    abstract create(ciudad:ParticipanteEntity): Promise<ParticipanteEntity>;

    abstract delete(id:number): Promise<void>
}