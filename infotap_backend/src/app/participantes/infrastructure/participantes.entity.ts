import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
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

    @Column({unique:true})
    dni:number;

    @Column()
    correo:string;

    @Column()
    edad:number;

    @Column({ type: 'varchar', length: 20 })
    telefono:string;

    @Column()
    fecha_creacion:Date;

    @ManyToMany(() => AnalisisEntity,(analisis) => analisis.participante)
    @JoinTable({name: 'participante_analisis',
    joinColumn: {
        name: 'participante_ID',
        referencedColumnName: 'id',
    },
    inverseJoinColumn: {
        name: 'analisis_ID',
        referencedColumnName: 'id',
       
    },
    })
    analisis: AnalisisEntity[];

    @ManyToOne(()=> BarrioEntity,(barrio)=>barrio.participante)
    @JoinColumn({name: 'barrio_ID'})
    barrio:BarrioEntity;

    @ManyToOne(()=> GeneroEntity, (genero)=> genero.participante)
    @JoinColumn({name: 'genero_ID'})
    genero:GeneroEntity;

}