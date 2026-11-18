import { AnalisisEntity } from "../../../analisis/infrastructure/analisis.entity";
import { BarrioEntity } from "../../../barrios/infrastructure/barrios.entity";
import { GeneroEntity } from "../../../genero/infrastructure/genero.entity";

export class PostParticipanteCommand{
    nombre:string;
    apellido:string;
    dni:number;
    correo:string;
    edad:number;
    telefono:string;
    fecha_creacion:Date;

    analisis:AnalisisEntity;
    barrio:BarrioEntity;
    genero:GeneroEntity;
}
