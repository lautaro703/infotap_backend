import { ParticipanteEntity } from "../../infrastructure/participantes.entity";

export class ParticipanteDto{
    id:number;
    nombre:string;
    apellido:string;
    dni:number;
    correo:string;
    edad:number;
    telefono: string;
    fecha_creacion: Date;

    analisis_ID: number[];
    barrio_ID:number;
    genero_ID:number;

    barrio: string; 
    ciudad: string; 
    provincia: string; 
    sexo: string;


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
        
        dto.analisis_ID=entity.analisis?.map(a=>a.id)??[];
        dto.barrio_ID=entity.barrio?.id;
        dto.genero_ID=entity.genero?.id;

        dto.barrio = entity.barrio?.nombre ?? '';
        dto.ciudad = entity.barrio?.ciudad?.nombre ?? ''; 
        dto.provincia = entity.barrio?.ciudad?.provincia?.nombre ?? ''; 
        dto.sexo = entity.genero?.tipo ?? '';
        return dto;
    }
}