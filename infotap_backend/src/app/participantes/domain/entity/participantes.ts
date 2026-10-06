export class participantePropi{
    constructor(
        public id:number,
        public nombre:string,
        public apellido:string,
        public dni:number,
        public correo:string,
        public edad:number,
        public telefono: number,
        public fecha_creacion: Date,
        public analisis_ID: number,
        public barrio_ID:number,
        public genero_ID:number,
    ){}
}