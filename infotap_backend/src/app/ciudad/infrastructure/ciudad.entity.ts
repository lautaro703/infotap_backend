import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProvinciaEntity } from "../../provincia/infrastructure/provincia.entity";
import { BarrioEntity } from "../../barrios/infrastructure/barrios.entity";

@Entity('ciudad')

export class CiudadEntity{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    nombre:string;

    @ManyToOne(()=> ProvinciaEntity, (provincia)=> provincia.ciudad)
    @JoinColumn({ name: 'provincia_ID' })
    provincia:ProvinciaEntity;

    @OneToMany(()=> BarrioEntity, (barrio)=> barrio.ciudad)
    barrio:BarrioEntity[];

}