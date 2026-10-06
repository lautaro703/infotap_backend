import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ArchivoEntity } from "../../archivos/infrastructure/archivos.entity";

@Entity('usuario')

export class UsuarioEntity{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    correo: string;

    @Column()
    contraseña: string;

    @OneToMany(()=> ArchivoEntity, (archivo)=> archivo.usuario)
    archivo:ArchivoEntity[];
}