import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UsuariosService } from '../../service/usuarios.service';
import { UsuarioDto } from '../dto/usuarios.dto';
import { GetUsuarioQuery } from '../../service/dtos/get.usuarios.query';
import { PostUsuarioCommand } from '../../service/dtos/post.usuarios.command';
import { PutUsuarioCommand } from '../../service/dtos/put.usuarios.command';
import { DeleteUsuarioCommand } from '../../service/dtos/delete.usuarios.command';

@Controller('usuarios')
export class UsuariosController {
    constructor(private readonly usuarioService: UsuariosService){}

    @Get()
    findAll(){
        return this.usuarioService.findAll();
    }

    @Get(':id')
    async getOne(@Param('id') id: number){
        const usuario = await this.usuarioService.findById(new GetUsuarioQuery(id));
        return UsuarioDto.fromEntity(usuario);
    }

    @Post()
    async create(@Body() command: PostUsuarioCommand){
        const usuario = await this.usuarioService.create(command);
        return UsuarioDto.fromEntity(usuario);
    }

    @Put(':id')
    update(@Param('id') id:number, @Body() command: PutUsuarioCommand){
        return this.usuarioService.update({ id } as GetUsuarioQuery,command);
    }

    @Delete('id')
    delete(@Param('id')id:number){
     return this.usuarioService.delete({id} as DeleteUsuarioCommand);
    }
}
