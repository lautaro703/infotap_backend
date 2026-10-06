import { GeneroEntity } from "../../infrastructure/genero.entity";

export class GeneroDto{
    id:number;
    tipo:string;
    participante_ID:number;

    static fromEntity(entity:GeneroEntity): GeneroDto{
        const dto= new GeneroDto();
        dto.id = entity.id;
        dto.tipo = entity.tipo;
        dto.participante_ID=entity.participante?.id;
        return dto;
    }
}