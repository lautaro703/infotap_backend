import { CiudadEntity } from "../../infrastructure/ciudad.entity";

export class CiudadDto{
    id:number;
    nombre:string;
    provincia_ID:number;

    static fromEntity(entity:CiudadEntity):CiudadDto{
         const dto=new CiudadDto();
         dto.id=entity.id;
         dto.nombre=entity.nombre;
         dto.provincia_ID=entity.provincia?.id;
         return dto;
    }
}