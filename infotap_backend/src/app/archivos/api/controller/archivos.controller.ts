import { BadRequestException, Body, Controller, Delete, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ArchivoService } from '../../service/archivos.service';
import { PostArchivoCommand } from '../../service/dtos/post.archivos.command';
import { ArchivoDto } from '../dto/archivos.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetArchivoQuery } from '../../service/dtos/get.archivos.query';
import { DeleteArchivoCommand } from '../../service/dtos/delete.archivos.command';
import { diskStorage, memoryStorage } from 'multer';
import { CreateChatParameters } from '@google/genai';


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
    FileInterceptor('file', {
        storage: memoryStorage(),
    }),
    )
    async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('usuario_ID') usuario_ID: string | number,
    @Body('nombreActividad') nombreActividad: string,
    @Body('columnasMapeadas') columnasMapeadasRaw: string,
    ) {
    console.log('PASO 1: ENTRÓ AL CONTROLADOR DE UPLOAD');

    if (!file) {
        throw new BadRequestException('No se ha subido ningún archivo');
    }

    const idUsuarioParsed = Number(usuario_ID);

    const idUsuarioFinal =
        !isNaN(idUsuarioParsed) && idUsuarioParsed > 0
        ? idUsuarioParsed
        : 1;

    let columnasMapeadas;

    try {
        columnasMapeadas = columnasMapeadasRaw
        ? JSON.parse(columnasMapeadasRaw)
        : [];
    } catch {
        throw new BadRequestException(
        'El formato de las columnas mapeadas no es válido',
        );
    }

    console.log('PASO 2: GUARDANDO METADATOS DEL ARCHIVO');

    const archivoGuardado = await this.archivoService.guardarMetaDatos({
        nombre: nombreActividad || file.originalname,
        ruta: file.originalname,
        mimetype: file.mimetype,
        usuario_ID: idUsuarioFinal,
    });

    console.log('PASO 3: ARCHIVO GUARDADO', archivoGuardado.id);

    console.log('PASO 4: INICIANDO ANÁLISIS Y GUARDADO DE PARTICIPANTES');

    const resultado =
        await this.archivoService.procesarEInsertaAnalisis(
        idUsuarioFinal,
        file.buffer,
        archivoGuardado.id,
        columnasMapeadas,
        );

    console.log('PASO 5: ANÁLISIS Y PARTICIPANTES PROCESADOS');

    return {
        mensaje: 'Archivo, análisis y participantes guardados exitosamente',
        archivo: archivoGuardado,
        ...resultado,
    };
    }

    @Post('previaCabecera')
    @UseInterceptors(FileInterceptor('file'))
    async previaCabecera(@UploadedFile() file: Express.Multer.File) {
      if (!file) {
        throw new BadRequestException('El archivo es requerido');
      }
      return this.archivoService.previaCabecera(file);
    }

    @Post('reconocerCabeceras')
    async reconocerCabeceras(
        @Body() body: {
            columnas: { letra: string; encabezado: string }[]
        },
        ) {
        console.log('BODY RECIBIDO:', body);

        return this.archivoService.reconocerCabeceras(
            body?.columnas || [],
        );
    }
    
    @Post('consulta-actividad')
    async consultaActividad(@Body() resumenEstadisticas: {
        totalInscriptos: number;
        totalBarrios: number;
        promedioEdad: number;
        barrioFrecuente: string;
        segmentoEtario: string;
        distribucionSexo: string;
        pregunta: string;
        detalleActividades: {
        nombre_actividad: string;
        sexo: string;
        cantidad_personas: number;
        }[];
    }) {
        return await this.archivoService.consultaActividad(
        resumenEstadisticas,
        );
    }
  
}
