import { AnalisisEntity } from "../../infrastructure/analisis.entity";

export abstract class analisisRepository{
    abstract findAll():Promise<AnalisisEntity[]>

    abstract findById(id:number):Promise<AnalisisEntity | null>

    abstract create(analisis:AnalisisEntity): Promise<AnalisisEntity>;

    abstract delete(id:number): Promise<void>
}