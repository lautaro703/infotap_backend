import { Injectable, NotFoundException, BadRequestException} from '@nestjs/common';
import { PostgresArchivoRepository } from '../infrastructure/postgres.archivos.repository';
import { ArchivoEntity } from '../infrastructure/archivos.entity';
import { GetArchivoQuery } from './dtos/get.archivos.query';
import { DeleteArchivoCommand } from './dtos/delete.archivos.command';
import { PostArchivoCommand } from './dtos/post.archivos.command';
import { archivoPropi } from '../domain/entity/archivos';
import * as Workbook from 'exceljs';
import * as fs from 'fs';
import * as XLSX from 'xlsx';

@Injectable()
export class ArchivoService {
    constructor(
        private readonly archivoRepository: PostgresArchivoRepository
    ){}

    findAll():Promise<ArchivoEntity[]>{
        return this.archivoRepository.findAll();
    }

    async findById(query: GetArchivoQuery){
        const archivo= await this.archivoRepository.findById(query.id)
        if (!archivo) throw new NotFoundException('archivo no disponible');
        return archivo;
    }

    async create(command: PostArchivoCommand){
        const archivo = new ArchivoEntity();
        Object.assign(archivo, command);
        return this.archivoRepository.create(archivo);
    }

    async delete(command: DeleteArchivoCommand):Promise<void>{
        const archivo= await this.archivoRepository.findById(command.id);
        if(!archivo) throw new NotFoundException('archivo no disponible');
        await this.archivoRepository.delete(archivo.id);
    } 

    async guardarMetaDatos(data: {
       nombre: string;
       ruta: string;
       mineType: string;
       usuario_ID: number;
    }) {
    const nuevoArchivo = new archivoPropi(
        Date.now(),
        new Date(),
        data.nombre,
        data.ruta,
        data.mineType,
        data.usuario_ID,
    );


    const entity = new ArchivoEntity();
    entity.nombre = nuevoArchivo.nombre;
    entity.ruta = nuevoArchivo.ruta;
    entity.mimetype = nuevoArchivo.mimetype;
    entity.fecha_carga = new Date();
    entity.usuario = { id: data.usuario_ID } as any;

  
    return await this.archivoRepository.create(entity);
   }
   
   async leerYParsearExcel(
    rutaArchivo: string,
    columnasMapeadas: Array<{ id: number; nombre: string; valor: string; icono?: string }>,
   ) {
    if (!fs.existsSync(rutaArchivo)) {
      throw new BadRequestException('El archivo físico no existe en el servidor.');
    }

    console.log('--- MAPEO RECIBIDO DESDE VUE ---', columnasMapeadas);

    const workbook = new Workbook.Workbook();
    await workbook.xlsx.readFile(rutaArchivo);

    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      throw new BadRequestException('El archivo Excel no contiene ninguna hoja.');
    }
 
    const mapaIndicesColumnas: { [indice: number]: string } = {};
    const primeraFila = worksheet.getRow(1);

    // Función auxiliar para convertir letra de columna Excel (A, B, C...) a índice numérico (1, 2, 3...)
    const letraAIndice = (letra: string): number => {
      let sum = 0;
      for (let i = 0; i < letra.length; i++) {
        sum = sum * 26 + (letra.toUpperCase().charCodeAt(i) - 64);
      }
      return sum;
    };

    primeraFila.eachCell((cell, colNumber) => {
      const valorCelda = cell.value;
      const nombreColumnaExcel = (
        typeof valorCelda === 'object' && valorCelda !== null && 'result' in valorCelda
          ? valorCelda.result
          : cell.text
      )?.toString().trim() || '';

      console.log(`Columna ${colNumber} en Excel: "${nombreColumnaExcel}"`);

      // Buscamos coincidencia en el array de Vue (por letra de columna 'valor' o por texto 'nombre')
      const mapeo = columnasMapeadas?.find((c) => {
        if (!c) return false;
        
        const indiceLetra = c.valor ? letraAIndice(c.valor.trim()) : -1;
        const coincidePorIndice = indiceLetra === colNumber;
        
        const coincidePorNombre =
          c.nombre?.trim().toLowerCase() === nombreColumnaExcel.toLowerCase();

        return coincidePorIndice || coincidePorNombre;
      });

      if (mapeo) {
        // Mapeamos el número de columna del Excel con la clave formateada (ej. "nombre", "apellido", "dni")
        const claveNormalizada = mapeo.nombre
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Elimina tildes
          .toLowerCase()
          .replace(/\s+/g, '_'); // Reemplaza espacios por guiones bajos

        mapaIndicesColumnas[colNumber] = claveNormalizada;
      }
    });

    console.log('--- MAPA DE ÍNDICES CONFIGURADO ---', mapaIndicesColumnas);

    const registrosProcesados: Record<string, any>[] = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;

      const filaObjeto: Record<string, any> = {};
      let tieneDatos = false;

      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        const campoEntidad = mapaIndicesColumnas[colNumber];
        if (campoEntidad) {
          const valorRaw = cell.value;
          const valorLimpio =
            typeof valorRaw === 'object' && valorRaw !== null && 'result' in valorRaw
              ? valorRaw.result
              : valorRaw;

          filaObjeto[campoEntidad] =
            valorLimpio !== undefined && valorLimpio !== null ? valorLimpio : null;
          tieneDatos = true;
        }
      });

      if (tieneDatos) {
        registrosProcesados.push(filaObjeto);
      }
    });

    console.log('--- REGISTROS PROCESADOS Y MAPEADOS ---', registrosProcesados);
    return registrosProcesados;
 }

 async previaCabecera(file:Express.Multer.File){
  if(!file|| !file.buffer){
    throw new BadRequestException('No se ha podido procesar el archivo')
  }

  try{
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      const data = XLSX.utils.sheet_to_json<string[]>(worksheet, { header: 1 });

      if (!data || data.length === 0) {
        throw new BadRequestException('El archivo está vacío.');
      }

      const primeraFila = data[0]; 
      const cabeceras: Record<string, string> = {};

      primeraFila.forEach((celda, index) => {
        if (celda) {
          const letraColumna = XLSX.utils.encode_col(index);
          cabeceras[letraColumna] = celda.toString().trim();
        }
      });

      return { cabeceras };
  }catch(error){
      throw new BadRequestException('Error al procesar el archivo exel:'+error.message);
  }
 }
}
