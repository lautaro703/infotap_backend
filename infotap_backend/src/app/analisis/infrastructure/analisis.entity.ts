import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ArchivoEntity } from "../../archivos/infrastructure/archivos.entity";
import { ParticipanteEntity } from "../../participantes/infrastructure/participantes.entity";

@Entity('analisis')

export class AnalisisEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    fecha_analisis:Date;

    @Column({type: 'int', default: 0})
    cantidad_participante:number;

    @ManyToOne(()=> ArchivoEntity, (archivo)=> archivo.analisis,{onDelete:'CASCADE'})
    @JoinColumn({name: 'archivo_ID'})
    archivo:ArchivoEntity;

    @ManyToMany(()=>ParticipanteEntity,(participante)=> participante.analisis)
    participante:ParticipanteEntity[];
}