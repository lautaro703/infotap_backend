export class PostArchivoCommand {
    nombre:string;
    fecha_carga:Date;
    usuario_ID:number;
    analisis_ID:number;
}

export class PostArchivosCommand {
  constructor(
    public readonly nombre: string,
    public readonly ruta: string,
    public readonly mineType: string,
    public readonly usuario_ID: number,
  ) {}
}
