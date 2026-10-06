import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CiudadEntity } from "../../ciudad/infrastructure/ciudad.entity";

@Entity('provincia')

export class ProvinciaEntity{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    nombre: string;

    @OneToMany(() => CiudadEntity, (ciudad) => ciudad.provincia)
    ciudad: CiudadEntity[];
}