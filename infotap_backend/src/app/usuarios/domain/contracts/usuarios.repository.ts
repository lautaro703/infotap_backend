import { UsuarioEntity } from "../../infrastructure/usuarios.entity";

export abstract class UsuarioRepository{
    
    abstract findAll(): Promise<UsuarioEntity[]>

    abstract findById(id:number):Promise<UsuarioEntity | null>

    abstract create(usuario:UsuarioEntity): Promise<UsuarioEntity>;

    abstract delete(id:number): Promise<void>

    abstract update(id:number, usuario: Partial<UsuarioEntity>):Promise<UsuarioEntity>
}