import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ParticipanteEntity } from "../../participantes/infrastructure/participantes.entity";

@Entity('genero')

export class GeneroEntity{
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    tipo: string;

    @OneToMany(()=>ParticipanteEntity,(participante)=>participante.genero)
    participante:ParticipanteEntity;
} 