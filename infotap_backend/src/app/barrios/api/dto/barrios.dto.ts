import { BarrioEntity } from "../../infrastructure/barrios.entity";

export class BarrioDto{
    id:number;
    nombre:string;
    latitud:number;
    longitud:number;
    ciudad_ID:number;

    static fromEntity(entity:BarrioEntity):BarrioDto{
        const dto=new BarrioDto();
        dto.id=entity.id;
        dto.nombre=entity.nombre;
        dto.latitud=entity.latitud;
        dto.longitud=entity.longitud;
        dto.ciudad_ID=entity.ciudad?.id;
        return dto;
    }
}