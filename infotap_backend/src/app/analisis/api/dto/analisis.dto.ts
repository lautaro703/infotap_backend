import { AnalisisEntity } from "../../infrastructure/analisis.entity";

export class AnalisisDto{
    id:number;
    fecha_analisis:Date;
    cantidad_participante:number;
    archivo_ID:number;

    static fromEntity(entity:AnalisisEntity):AnalisisDto{
        const dto=new AnalisisDto();
        dto.id=entity.id;
        dto.fecha_analisis=entity.fecha_analisis;
        dto.cantidad_participante=entity.cantidad_participante;
        dto.archivo_ID=entity.archivo?.id;
        return dto;
    }
}