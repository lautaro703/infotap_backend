import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ArchivoEntity } from "../../archivos/infrastructure/archivos.entity";

@Entity('usuario')

export class UsuarioEntity{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    correo: string;

    @Column({ unique: true })
    firebase_uid: string;

    @Column()
    nombre: string;

    @Column({ nullable: true })
    foto_perfil: string;

    @CreateDateColumn()
    fecha_registro: Date;

    @OneToMany(()=> ArchivoEntity, (archivo)=> archivo.usuario)
    archivo:ArchivoEntity[];
}