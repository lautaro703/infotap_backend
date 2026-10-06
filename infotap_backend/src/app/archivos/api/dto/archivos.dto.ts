import { ArchivoEntity } from "../../infrastructure/archivos.entity";

export class ArchivoDto{
    id:number;
    nombre:string;
    fecha_carga:Date;
    usuario_ID:number;

    static fromEntity(entity:ArchivoEntity):ArchivoDto{
        const dto=new ArchivoDto();
        dto.id=entity.id;
        dto.nombre=entity.nombre;
        dto.fecha_carga=entity.fecha_carga;
        dto.usuario_ID=entity.usuario?.id;
        return dto;
    }
}