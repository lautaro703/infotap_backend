import { Body, Headers ,Controller, Delete, Get, Param, Post, Put, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from '../../service/usuarios.service';
import { UsuarioDto } from '../dto/usuarios.dto';
import { GetUsuarioQuery } from '../../service/dtos/get.usuarios.query';
import { PostUsuarioCommand } from '../../service/dtos/post.usuarios.command';
import { PutUsuarioCommand } from '../../service/dtos/put.usuarios.command';
import { DeleteUsuarioCommand } from '../../service/dtos/delete.usuarios.command';
import { FirebaseService } from '../../../firebase/firebase.service';

@Controller('usuarios')
export class UsuariosController {
    constructor(private readonly usuarioService: UsuariosService,private readonly firebaseService: FirebaseService){}

    @Get()
    findAll(){
        return this.usuarioService.findAll();
    }

    @Get(':id')
    async getOne(@Param('id') id: number){
        const usuario = await this.usuarioService.findById(new GetUsuarioQuery(id));
        return UsuarioDto.fromEntity(usuario);
    }

    @Post('login-google')
    async loginGoogle(@Headers('authorization') authorization: string) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new UnauthorizedException('Token no proporcionado');
        }
        const token = authorization.split(' ')[1];
        const datosGoogle = await this.firebaseService.verificarToken(token);
        const usuario = await this.usuarioService.buscarOCrearDesdeGoogle({
            uid: datosGoogle.uid,
            email: datosGoogle.email,
            nombre: datosGoogle.name || '',
            fotoPerfil: datosGoogle.picture,
        });
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
