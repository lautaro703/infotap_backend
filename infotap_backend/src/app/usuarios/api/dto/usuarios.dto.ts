import { UsuarioEntity } from "../../infrastructure/usuarios.entity";

export class UsuarioDto{
    id:number;
    correo:string;
    contraseña:string;
    archivo_ID:number[];

    static fromEntity(entity:UsuarioEntity):UsuarioDto{
        const dto = new UsuarioDto()
        dto.id=entity.id;
        dto.correo=entity.correo;
        dto.contraseña=entity.contraseña;

        dto.archivo_ID=entity.archivo? entity.archivo.map((a)=>a.id):[];
        return dto;
    }
}