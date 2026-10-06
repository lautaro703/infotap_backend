import { Module } from '@nestjs/common';
import { UsuariosController } from './api/controller/usuarios.controller';
import { UsuariosService } from './service/usuarios.service';
import { PostgresUsuarioRepository } from './infrastructure/postgres.usuarios.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from './infrastructure/usuarios.entity';

@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService,PostgresUsuarioRepository],
  imports:[TypeOrmModule.forFeature([UsuarioEntity])],
  exports:[],
})
export class UsuariosModule {}
