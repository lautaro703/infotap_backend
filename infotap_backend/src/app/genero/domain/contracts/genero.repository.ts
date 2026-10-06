import { GeneroEntity } from "../../infrastructure/genero.entity";

export abstract class GeneroRepository{
    abstract findAll(): Promise<GeneroEntity[]>;

    abstract findById(id:number):Promise<GeneroEntity | null >;

    abstract save(genero:GeneroEntity):Promise<GeneroEntity>;

    abstract delete(id:number):Promise<void>;
}