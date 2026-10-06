import { BadRequestException, Body, Controller, Delete, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ArchivoService } from '../../service/archivos.service';
import { PostArchivoCommand } from '../../service/dtos/post.archivos.command';
import { ArchivoDto } from '../dto/archivos.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetArchivoQuery } from '../../service/dtos/get.archivos.query';
import { DeleteArchivoCommand } from '../../service/dtos/delete.archivos.command';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { console } from 'inspector';

@Controller('archivos')
export class ArchivosController {
    constructor(private readonly archivoService: ArchivoService){}

    @Get()
    findAll(){
        return this.archivoService.findAll();
    }

    @Get(':id')
    async getOne(@Param('id') id: number){
        const archivo = await this.archivoService.findById(new GetArchivoQuery(id));
        return ArchivoDto.fromEntity(archivo);
    }

    @Post()
    async create(@Body() command: PostArchivoCommand){
        const archivo = await this.archivoService.create(command);
        return ArchivoDto.fromEntity(archivo);
    }

    @Delete(':id')
    delete(@Param('id')id:number){
     return this.archivoService.delete({id} as DeleteArchivoCommand);
    }

    @Post('upload')
    @UseInterceptors(
        FileInterceptor('file',{
            storage:diskStorage({
                destination:'./uploads',
                filename: (req, file, callback)=>{
                    const uniqueSuffix=Date.now()+ '-'+Math.round(Math.random() *1e9);
                    const ext=extname(file.originalname);
                    callback(null, `file-${uniqueSuffix}${ext}`);
                },
            }),
        }),
    )
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Body('usuario_ID') usuario_ID: string | number,
        @Body('nombreActividad') nombreActividad:string,
        @Body('columnasMapeadas') columnasMapeadasRaw:string,
    ){
        if(!file){
            throw new BadRequestException('No se ha subido ningun archivo');
        }

        const idUsuarioParsed = Number(usuario_ID);
        const idUsuarioFinal = !isNaN(idUsuarioParsed) && idUsuarioParsed > 0 ? idUsuarioParsed : 1;
        const columnaMapeadas=columnasMapeadasRaw ? JSON.parse(columnasMapeadasRaw) : [];
        const archivoGuardado =  await this.archivoService.guardarMetaDatos({
            nombre:nombreActividad || file.originalname,
            ruta: file.path,
            mineType:file.mimetype,
            usuario_ID:idUsuarioFinal,
        })

        const datosMapeados= await this.archivoService.leerYParsearExcel(
            file.path,columnaMapeadas,
        )

        console.table(datosMapeados);

        return{
            mensaje:'Archivo guardado y datos procesados con éxito',
            archivo:archivoGuardado,
            totalFilas:datosMapeados.length,
            datos:datosMapeados,
        }
    }

    @Post('previaCabecera')
    @UseInterceptors(FileInterceptor('file'))
    async previaCabecera(@UploadedFile() file: Express.Multer.File) {
      if (!file) {
        throw new BadRequestException('El archivo es requerido');
      }
      return this.archivoService.previaCabecera(file);
    }
}
