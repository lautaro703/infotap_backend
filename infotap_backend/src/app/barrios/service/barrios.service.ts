import { Injectable, NotFoundException } from '@nestjs/common';
import { GetBarrioQuery } from './dtos/get.barrios.query';
import { DeleteBarrioCommand } from './dtos/delete.barrios.command';
import { PostBarrioCommand } from './dtos/post.barrios.command';
import { BarrioEntity } from '../infrastructure/barrios.entity';
import { PutBarrioCommand } from './dtos/put.barrio.command';
import { PostgreBarrioRepository } from '../infrastructure/postgres.barrios.repository';
import { GeolocalizacionService } from '../../geolocalizacion/service/geolocalizacion.service';
import { CiudadEntity } from '../../ciudad/infrastructure/ciudad.entity';
@Injectable()
export class BarriosService {

    constructor(
        private readonly barrioRepository:PostgreBarrioRepository,
        private readonly geolocalizacion:GeolocalizacionService,
    ){}

    async findAll(){
        return this.barrioRepository.findAll()
    }

    async findById(query: GetBarrioQuery){
        const barrio = await this.barrioRepository.findById(query.id);
        if(!barrio) throw new NotFoundException('el barrio no existe');
        return barrio;
    }

    async update(query: GetBarrioQuery, command: PutBarrioCommand){
        const barrio= await this.barrioRepository.findById(query.id);
        if(!barrio) throw new NotFoundException('barrio no disponible');
        Object.assign(barrio,command);
        return this.barrioRepository.update(barrio.id,barrio);
    }

    async create(command: PostBarrioCommand){
        const barrio= new BarrioEntity();
        Object.assign(barrio,command);
        return this.barrioRepository.save(barrio)
    }

    async delete(command: DeleteBarrioCommand){
        const barrio= await this.barrioRepository.findById(command.id);
        if(!barrio) throw new NotFoundException('barrio no disponible');
        await this.barrioRepository.delete(barrio.id);
    } 

    async obtenerOCrear(nombre: string, ciudadId: number | null): Promise<BarrioEntity> {
        console.log('🟢 ENTRÓ A BARRIOS SERVICE');
        const barrio = await this.barrioRepository.obtenerOCrear(nombre,ciudadId);
        console.log('🟢 BARRIO OBTENIDO:', barrio);

        if(barrio.latitud != null && barrio.longitud != null){
            return barrio;
        }

        if(!barrio.ciudad?.nombre || !barrio.ciudad?.provincia?.nombre){
            return barrio;
        }

        console.log('Barrio:', barrio.nombre);
        console.log('Ciudad:', barrio.ciudad?.nombre);
        console.log('Provincia:', barrio.ciudad?.provincia?.nombre);

        const coordenadas = await this.geolocalizacion.obtenerCoordenadas(
            barrio.nombre,
            barrio.ciudad.nombre,
            barrio.ciudad.provincia.nombre,
        );

        console.log('Coordenadas encontradas:', coordenadas);

        if(!coordenadas){
            return barrio;
        }

        barrio.latitud=coordenadas.latitud;
        barrio.longitud=coordenadas.longitud;

        return await this.barrioRepository.save(barrio);
    }
    
}
