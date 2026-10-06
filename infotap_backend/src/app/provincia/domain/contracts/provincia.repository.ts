import { ProvinciaEntity } from "../../infrastructure/provincia.entity";

export abstract class provinciaRepository{
    abstract findAll(): Promise<ProvinciaEntity[]>;

    abstract findById(id:number):Promise<ProvinciaEntity | null>;

    abstract save(provincia:ProvinciaEntity):Promise<ProvinciaEntity>;
}