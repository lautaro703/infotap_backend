import { Collection, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CiudadEntity } from "../../ciudad/infrastructure/ciudad.entity";
import { participantePropi } from "../../participantes/domain/entity/participantes";
import { ParticipanteEntity } from "../../participantes/infrastructure/participantes.entity";

@Entity('barrio')

export class BarrioEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    nombre:string;

    @Column({type: 'decimal', precision:10,scale:7,nullable:true})
    latitud:number | null;

    @Column({type: 'decimal', precision:10,scale:7,nullable:true})
    longitud:number | null;

    @ManyToOne(()=>CiudadEntity, (ciudad)=>ciudad.barrio)
    ciudad:CiudadEntity;

    @OneToMany(()=>ParticipanteEntity,(participante)=>participante.barrio)
    participante:ParticipanteEntity[];
}