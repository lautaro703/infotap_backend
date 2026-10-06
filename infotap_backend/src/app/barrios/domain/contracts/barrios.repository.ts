import { BarrioEntity } from "../../infrastructure/barrios.entity";

export abstract class BarrioRepository{
    abstract findAll():Promise<BarrioEntity[]>

    abstract findById(id: number): Promise<BarrioEntity | null>; 
    
    abstract save(barrio:BarrioEntity): Promise<BarrioEntity>;

    abstract delete(id:number): Promise<void>

    abstract update(id:number, barrio: Partial<BarrioEntity>):Promise<BarrioEntity>

}