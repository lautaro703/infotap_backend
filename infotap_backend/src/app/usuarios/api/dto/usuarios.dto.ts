import { UsuarioEntity } from "../../infrastructure/usuarios.entity";

export class UsuarioDto{
    id:number;
    correo:string;
    nombre:string;
    firebase_uid:string;
    foto_perfil:string;
    fecha_registro:Date;
    archivo_ID:number[];

    static fromEntity(entity:UsuarioEntity):UsuarioDto{
        const dto = new UsuarioDto()
        dto.id=entity.id;
        dto.correo=entity.correo;
        dto.nombre=entity.nombre;
        dto.firebase_uid=entity.firebase_uid;
        dto.foto_perfil=entity.foto_perfil;
        dto.fecha_registro=entity.fecha_registro
        dto.archivo_ID=entity.archivo? entity.archivo.map((a)=>a.id):[];
        return dto;
    }
}