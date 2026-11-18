export class UsuarioPropi{
    constructor(
        public id:number,
        public correo:string,
        public nombre:string,
        public firebase_uid: string,
        public foto_perfil:string,
        public fecha_registro:Date,
        public archivo_ID:number,
    ){}
}