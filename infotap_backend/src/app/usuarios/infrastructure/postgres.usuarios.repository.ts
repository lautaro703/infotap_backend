import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UsuarioEntity } from "./usuarios.entity";
import { UsuarioRepository } from "../domain/contracts/usuarios.repository";
import { Repository } from "typeorm";

@Injectable()
export class PostgresUsuarioRepository implements UsuarioRepository{
    constructor(
        @InjectRepository(UsuarioEntity) private readonly repository:Repository<UsuarioEntity>
    ){}

    findAll(): Promise<UsuarioEntity[]> {
        return this.repository.find();
    }

    findById(id: number): Promise<UsuarioEntity | null> {
        return this.repository.findOne({where: {id}});
    }

    create(usuario: UsuarioEntity): Promise<UsuarioEntity> {
        const entity= this.repository.create(usuario)
        return this.repository.save(entity)
    }

    update(id:number, usuario:Partial<UsuarioEntity>): Promise<UsuarioEntity>{
        return this.repository.save(usuario)
    }
    
    async delete(id: number): Promise<void>{
        await this.repository.delete(id);
    }

}