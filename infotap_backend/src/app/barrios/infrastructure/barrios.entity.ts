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

    @Column()
    latitud:number;

    @Column()
    longitud:number;

    @ManyToOne(()=>CiudadEntity, (ciudad)=>ciudad.barrio)
    ciudad:CiudadEntity;

    @OneToMany(()=>ParticipanteEntity,(participante)=>participante.barrio)
    participante:ParticipanteEntity[];
}