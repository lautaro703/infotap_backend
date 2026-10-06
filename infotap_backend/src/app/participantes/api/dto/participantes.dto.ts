import { format } from "path";
import { ParticipanteEntity } from "../../infrastructure/participantes.entity";

export class ParticipanteDto{
    id:number;
    nombre:string;
    apellido:string;
    dni:number;
    correo:string;
    edad:number;
    telefono: number;
    fecha_creacion: Date;
    analisis_ID: number;
    barrio_ID:number;
    genero_ID:number;

    static fromEntity(entity:ParticipanteEntity):ParticipanteDto{
        const dto=new ParticipanteDto();
        dto.id=entity.id;
        dto.nombre=entity.nombre;
        dto.apellido=entity.apellido;
        dto.dni=entity.dni;
        dto.correo=entity.correo;
        dto.edad=entity.edad;
        dto.telefono=entity.telefono;
        dto.fecha_creacion=entity.fecha_creacion;
        dto.analisis_ID=entity.analisis?.id;
        dto.barrio_ID=entity.barrio?.id;
        dto.genero_ID=entity.genero?.id;
        return dto;
    }
}