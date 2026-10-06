export class archivoPropi{
    constructor(
        public id:number,
        public fecha_carga:Date,
        public nombre:string,
        public ruta:string,
        public mimetype:string,
        public usuario_ID:number,
        public analisis_ID?:number,
    ){}
}