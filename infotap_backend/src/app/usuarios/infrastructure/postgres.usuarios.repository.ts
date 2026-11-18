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

    async findAll(): Promise<UsuarioEntity[]> {
        return await this.repository.find();
    }

    async findById(id: number): Promise<UsuarioEntity | null> {
        return await this.repository.findOne({where: {id}});
    }

    async findByFirebaseUid(uid: string): Promise<UsuarioEntity | null>{
        return await this.repository.findOne({where:{firebase_uid:uid}});
    }

    async create(usuario: UsuarioEntity): Promise<UsuarioEntity> {
        const entity= this.repository.create(usuario)
        return await this.repository.save(entity)
    }

    async update(id:number, usuario:Partial<UsuarioEntity>): Promise<UsuarioEntity>{
        return await this.repository.save(usuario)
    }
    
    async delete(id: number): Promise<void>{
        await this.repository.delete(id);
    }

}