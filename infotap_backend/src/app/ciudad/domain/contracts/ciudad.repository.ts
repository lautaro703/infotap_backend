import { promises } from "dns";
import { CiudadEntity } from "../../infrastructure/ciudad.entity";
export abstract class CiudadRepository{

    abstract findAll(): Promise<CiudadEntity[]>

    abstract findById(id:number):Promise<CiudadEntity | null>

    abstract create(ciudad:CiudadEntity): Promise<CiudadEntity>;

    abstract delete(id:number): Promise<void>

    abstract update(id:number, ciudad: Partial<CiudadEntity>):Promise<CiudadEntity>
}