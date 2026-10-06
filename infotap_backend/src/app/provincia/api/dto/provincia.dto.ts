import { ProvinciaEntity } from "../../infrastructure/provincia.entity";

export class ProvinciaDto{
    id:number;
    nombre:string;

    static fromEntity(entity:ProvinciaEntity):ProvinciaDto{
        const dto = new ProvinciaDto();
        dto.id=entity.id;
        dto.nombre=entity.nombre;
        return dto;
    }
}