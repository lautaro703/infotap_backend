import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UsuarioEntity } from "../../usuarios/infrastructure/usuarios.entity";
import { AnalisisEntity } from "../../analisis/infrastructure/analisis.entity";

@Entity('archivo')

export class ArchivoEntity{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    nombre:string;

    @Column()
    fecha_carga:Date;

    @Column()
    ruta: string;

    @Column({ nullable: true })
    mimetype: string;

    @ManyToOne(()=> UsuarioEntity,(usuario)=> usuario.archivo)
    @JoinColumn({name: 'usuario_ID'})
    usuario:UsuarioEntity;

    @OneToMany(()=> AnalisisEntity,(analisis)=> analisis.archivo)
    analisis:ArchivoEntity[];
}
