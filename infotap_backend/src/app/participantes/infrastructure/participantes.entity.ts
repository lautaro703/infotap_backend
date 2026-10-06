import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BarrioEntity } from "../../barrios/infrastructure/barrios.entity";
import { AnalisisEntity } from "../../analisis/infrastructure/analisis.entity";
import { GeneroEntity } from "../../genero/infrastructure/genero.entity";
import { join } from "path";

@Entity('participante')
export class ParticipanteEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    nombre:string;

    @Column()
    apellido:string;

    @Column()
    dni:number;

    @Column()
    correo:string;

    @Column()
    edad:number;

    @Column()
    telefono:number;

    @Column()
    fecha_creacion:Date;

    @ManyToOne(()=> AnalisisEntity,(analisis)=> analisis.participante)
    @JoinColumn({name: 'analisis_ID'})
    analisis:AnalisisEntity;

    @ManyToOne(()=> BarrioEntity,(barrio)=>barrio.participante)
    @JoinColumn({name: 'barrio_ID'})
    barrio:BarrioEntity;

    @ManyToOne(()=> GeneroEntity, (genero)=> genero.participante)
    @JoinColumn({name: 'genero_ID'})
    genero:GeneroEntity;

}