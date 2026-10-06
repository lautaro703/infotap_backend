import { Injectable, NotFoundException } from '@nestjs/common';
import { PostgresUsuarioRepository } from '../infrastructure/postgres.usuarios.repository';
import { UsuarioEntity } from '../infrastructure/usuarios.entity';
import { PutUsuarioCommand } from './dtos/put.usuarios.command';
import { GetUsuarioQuery } from './dtos/get.usuarios.query';
import { DeleteUsuarioCommand } from './dtos/delete.usuarios.command';
import { PostUsuarioCommand } from './dtos/post.usuarios.command';

@Injectable()
export class UsuariosService {
    constructor(
        private readonly usuarioRepository: PostgresUsuarioRepository
    ){}

    findAll():Promise<UsuarioEntity[]>{
        return this.usuarioRepository.findAll();
    }

    async findById(query: GetUsuarioQuery){
        const usuario= await this.usuarioRepository.findById(query.id)
        if (!usuario) throw new NotFoundException('usuario no disponible');
        return usuario;
    }

    async create(command: PostUsuarioCommand){
        const usuario = new UsuarioEntity();
        Object.assign(usuario, command);
        return this.usuarioRepository.create(usuario);
    }

    async update(query: GetUsuarioQuery, command: PutUsuarioCommand){
        const usuario= await this.usuarioRepository.findById(query.id);
        if(!usuario) throw new NotFoundException('ciudad no disponible');
        Object.assign(usuario,command);
        return this.usuarioRepository.update(usuario.id,usuario);
    }

    async delete(command: DeleteUsuarioCommand):Promise<void>{
        const usuario= await this.usuarioRepository.findById(command.id);
        if(!usuario) throw new NotFoundException('usuario no disponible');
        await this.usuarioRepository.delete(usuario.id);
    }
}
