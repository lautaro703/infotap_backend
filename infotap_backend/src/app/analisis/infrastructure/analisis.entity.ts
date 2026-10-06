import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ArchivoEntity } from "../../archivos/infrastructure/archivos.entity";
import { ParticipanteEntity } from "../../participantes/infrastructure/participantes.entity";

@Entity('analisis')

export class AnalisisEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    fecha_analisis:Date;

    cantidad_participante:number;

    @ManyToOne(()=> ArchivoEntity, (archivo)=> archivo.analisis)
    @JoinColumn({name: 'archivo_ID'})
    archivo:ArchivoEntity;

    @OneToMany(()=>ParticipanteEntity,(participante)=> participante.analisis)
    participante:ParticipanteEntity[];
}