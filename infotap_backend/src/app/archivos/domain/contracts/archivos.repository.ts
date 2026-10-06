import { ArchivoEntity } from "../../infrastructure/archivos.entity";

export abstract class ArchivoRepository{

    abstract findAll(): Promise<ArchivoEntity[]>

    abstract findById(id:number):Promise<ArchivoEntity | null>

    abstract create(archivo:ArchivoEntity): Promise<ArchivoEntity>;

    abstract delete(id:number): Promise<void>

}