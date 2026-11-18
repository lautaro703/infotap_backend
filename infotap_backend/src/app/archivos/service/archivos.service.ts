import { Injectable, NotFoundException, BadRequestException} from '@nestjs/common';
import { PostgresArchivoRepository } from '../infrastructure/postgres.archivos.repository';
import { ArchivoEntity } from '../infrastructure/archivos.entity';
import { GetArchivoQuery } from './dtos/get.archivos.query';
import { DeleteArchivoCommand } from './dtos/delete.archivos.command';
import { PostArchivoCommand } from './dtos/post.archivos.command';
import { archivoPropi } from '../domain/entity/archivos';
import * as Workbook from 'exceljs';
import * as XLSX from 'xlsx';
import { GeneroService } from '../../genero/service/genero.service';
import { BarriosService } from '../../barrios/service/barrios.service';
import { CiudadService } from '../../ciudad/service/ciudad.service';
import { ParticipantesService } from '../../participantes/service/participantes.service';
import { ProvinciaService } from '../../provincia/service/provincia.service';
import { AnalisisService } from '../../analisis/service/analisis.service';
import { GetAnalisisQuery } from '../../analisis/service/dtos/get.analisis.query';
import { PutAnalisisCommand } from '../../analisis/service/dtos/put.analisis.command';
import { DataSource } from 'typeorm';
import { GoogleGenAI } from '@google/genai';
import { TenantAwareAuth } from 'firebase-admin/auth';

@Injectable()
export class ArchivoService {
    private readonly gemini = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

    constructor(
        private readonly archivoRepository: PostgresArchivoRepository,
        private readonly generoService:GeneroService,
        private readonly barrioService:BarriosService,
        private readonly ciudadService:CiudadService,
        private readonly partcipanteService:ParticipantesService,
        private readonly provinciaService:ProvinciaService,
        private readonly analisisService:AnalisisService,
        private readonly dataSource: DataSource,
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
        await this.dataSource.transaction(async (manager)=> {
          const archivo = await manager.findOne(ArchivoEntity,{
            where:{id:command.id},
          });

          if(!archivo){
            throw new NotFoundException('Archivo no disponible');
          }

          const participantes: {id: number}[]=await manager.query(`SELECT DISTINCT pa."participante_ID" AS id FROM participante_analisis pa INNER JOIN analisis a ON a.id = pa."analisis_ID" WHERE a."archivo_ID" = $1 `,[command.id])

          const idsParticipantes = participantes.map((p)=>Number(p.id));

          await manager.query(`DELETE FROM participante_analisis WHERE "analisis_ID" IN (SELECT id FROM analisis WHERE "archivo_ID" = $1)`,[command.id]);

          await manager.query(`DELETE FROM analisis WHERE "archivo_ID" = $1`,[command.id],)

          await manager.delete(ArchivoEntity, {id:command.id});

          if(idsParticipantes.length>0){await manager.query(`DELETE FROM participante p WHERE p.id = ANY($1::int[]) AND NOT EXISTS ( SELECT 1 FROM participante_analisis pa WHERE pa."participante_ID" = p.id )`,[idsParticipantes],)}
        })
    } 

    async guardarMetaDatos(data: {
       nombre: string;
       ruta: string;
       mimetype: string;
       usuario_ID: number;
    }) {
    const nuevoArchivo = new archivoPropi(
        Date.now(),
        new Date(),
        data.nombre,
        data.ruta,
        data.mimetype,
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
    fileBuffer:Buffer,
    columnasMapeadas: Array<{ id: number; nombre: string; valor: string; icono?: string }>,
   ) {
    if (!fileBuffer) {
      throw new BadRequestException('El archivo no existe en el servidor.');
    }

    console.log('--- MAPEO RECIBIDO DESDE VUE ---', columnasMapeadas);

    const workbook = new Workbook.Workbook();
    await workbook.xlsx.load(fileBuffer as any);

    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      throw new BadRequestException('El archivo Excel no contiene ninguna hoja.');
    }
 
    const mapaIndicesColumnas: { [indice: number]: string } = {};
    const primeraFila = worksheet.getRow(1);

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

      const mapeo = columnasMapeadas?.find((c) => {
        if (!c) return false;
        
        const indiceLetra = c.valor ? letraAIndice(c.valor.trim()) : -1;
        const coincidePorIndice = indiceLetra === colNumber;
        
        const coincidePorNombre =
          c.nombre?.trim().toLowerCase() === nombreColumnaExcel.toLowerCase();

        return coincidePorIndice || coincidePorNombre;
      });

      if (mapeo) {
        const claveNormalizada = mapeo.nombre
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') 
          .toLowerCase()
          .replace(/\s+/g, '_');

        mapaIndicesColumnas[colNumber] = claveNormalizada;
      }
    });

    console.log('--- MAPA DE ÍNDICES CONFIGURADO ---', mapaIndicesColumnas);

    const registrosProcesados: Record<string, any>[] = [];

    worksheet.eachRow((row, rowNumber) => {
  if (rowNumber === 1) return; 

  const filaObjeto: Record<string, any> = {};
  let tieneDatos = false;

  columnasMapeadas.forEach((col) => {
    if (!col.valor) return;

    const claveNormalizada = col.nombre
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, '_');

    const colIndex = letraAIndice(col.valor.trim());
    const cell = row.getCell(colIndex);

    if (cell && cell.value !== undefined && cell.value !== null) {
      const valorRaw = cell.value;
      const valorLimpio =
        typeof valorRaw === 'object' && 'result' in valorRaw
          ? valorRaw.result
          : cell.text || valorRaw;

      filaObjeto[claveNormalizada] = valorLimpio;
      tieneDatos = true;
    } else {
      filaObjeto[claveNormalizada] = null;
    }
  });

  if (tieneDatos) {
    registrosProcesados.push(filaObjeto);
  }});

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
      } catch (error) {
          const mensaje = error instanceof Error ? error.message : String(error);
          throw new BadRequestException('Error al procesar el archivo excel: ' + mensaje);   
        } 
    }

    async reconocerCabeceras(
      columnas: { letra: string; encabezado: string }[],
    ) {
      console.log('GEMINI: ENTRO AL METODO');
      console.log('COLUMNAS RECIBIDAS:', columnas);


      for (let intento = 0; intento < 3; intento++) {
        try {
          const respuesta = await this.gemini.models.generateContent({
            model: 'gemini-3.5-flash-lite',
            contents: `
              Identificá a qué campo corresponde cada encabezado.

              Campos permitidos:
              nombre, apellido, correo, telefono, dni,
              barrio, ciudad, provincia, edad, sexo.

              Encabezados:
              ${JSON.stringify(columnas)}

              Devolvé únicamente un JSON con este formato:
              [
                {
                  "letra": "C",
                  "campo": "correo"
                }
              ]

              No incluyas encabezados que no puedas reconocer.
            `,
            config: {
              responseMimeType: 'application/json',
            },
          });

          console.log('RESPUESTA ORIGINAL DE GEMINI:', respuesta.text);

          return JSON.parse(respuesta.text || '[]');

        } catch (error) {
          console.error('ERROR DE GEMINI:', error);
          return [];
        }
      }

      return [];
    }

    async consultaActividad(
      resumenEstadisticas: {
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
      }
    ) {
      for (let intento = 0; intento < 3; intento++) {
        try {
          const datosJson = JSON.stringify(resumenEstadisticas, null, 2);

          const respuesta = await this.gemini.models.generateContent({
            model: 'gemini-3.5-flash-lite',

            contents: `
              Analiza los siguientes datos estadísticos del sistema InfoTap:

              ${datosJson}

              Actúa como un analista de datos especializado en actividades
              institucionales y participación de personas.

              Tu objetivo es evaluar el alcance de las actividades a partir
              de los datos disponibles.

              Analiza:
              - Cantidad total de inscriptos.
              - Distribución geográfica por barrios.
              - Promedio de edad y segmento etario predominante.
              - Distribución por sexo.
              - Participación registrada en cada actividad.

              IMPORTANTE:
              - No inventes datos ni porcentajes.
              - No afirmes que las personas asistieron si solamente se dispone
                de información de inscripción.
              - No confundas cantidad de inscriptos con asistencia real.
              - Si los datos no permiten obtener una conclusión, indícalo.
              - Redacta conclusiones claras y útiles para la institución.

              DEVUELVE ÚNICAMENTE UN OBJETO JSON VÁLIDO con esta estructura:

              {
                "resumen": "Diagnóstico general del alcance de las actividades.",
                "observaciones": [
                  "Hallazgo sobre la distribución geográfica.",
                  "Hallazgo sobre edades y distribución por sexo.",
                  "Hallazgo sobre las actividades."
                ],
                "recomendacion": "Estrategia práctica para futuras convocatorias."
              }
            `,

            config: {
              responseMimeType: 'application/json',
            },
          });

          console.log('RESPUESTA ORIGINAL DE GEMINI:', respuesta.text);

          const resultado = JSON.parse(respuesta.text || '{}');

          if (
            typeof resultado.resumen !== 'string' ||
            !Array.isArray(resultado.observaciones) ||
            typeof resultado.recomendacion !== 'string'
          ) {
            throw new Error('Gemini devolvió una estructura JSON incorrecta');
          }

          return resultado;

        } catch (error) {
          console.error(`Error de Gemini. Intento ${intento + 1}:`, error);

          if (intento === 2) {
            throw new Error('No se pudo generar el análisis de la actividad.');
          }
        }
      }
    }

    async procesarEInsertaAnalisis(
      usuario_ID: number,
      fileBuffer: Buffer,
      id: number,
      columnasMapeadas: Array<{ id: number; nombre: string; valor: string }>,
    ) {
      
      const registroAnalizado = await this.leerYParsearExcel(fileBuffer, columnasMapeadas);

      console.log('--- REGISTROS PARSEADOS DEL EXCEL ---', registroAnalizado);

      if (!registroAnalizado || registroAnalizado.length === 0) {
        throw new BadRequestException('El archivo excel no contiene datos válidos para procesar');
      }

      const nuevoAnalisis = await this.analisisService.create({
        archivo: {id} as any,
        usuario_ID: usuario_ID,
        fecha_analisis: new Date(),
        cantidad_participante: registroAnalizado.length,
      } as any);

      console.log('--- NUEVO ANÁLISIS CREADO CON ID ---', nuevoAnalisis.id);

      const mapaGeneros: Record<string, string> = {
        F: 'Femenino',
        M: 'Masculino',
        X: 'X',
      };

      const todosLosGeneros = await this.generoService.findAll();
      const generoMap = new Map<string, any>();
      for (const g of todosLosGeneros) {
        if (g.tipo) generoMap.set(g.tipo.toUpperCase(), g);
      }

      const barrioCache = new Map<string, any>();

      const parsearNumero = (val: any): number | null => {
        if (val === undefined || val === null || val === '') return null;
        const limpio = String(val).replace(/\D/g, '');
        const num = Number(limpio);
        return isNaN(num) || limpio === '' ? null : num;
      };

      const participantesParaGuardar: any[] = [];

      console.log('PASO 2: COMIENZO A PROCESAR PARTICIPANTES');
      for (const reg of registroAnalizado) {
        try {
          const valorSexo = reg.sexo || reg.genero || reg.sexo_genero || 'X';
          const tipoSexo = String(valorSexo).toUpperCase().trim();
          const generoNormalizado = mapaGeneros[tipoSexo] || mapaGeneros['X'] || tipoSexo;
          const genero = generoMap.get(generoNormalizado.toUpperCase()) || null;

          let barrioFinal = null;
          const nombreBarrio = (reg.barrio || reg.barrio_nombre || '').toString().trim();
          const nombreCiudad = (reg.ciudad || reg.localidad || 'Sin especificar').toString().trim();
          const nombreProvincia = (reg.provincia || 'Sin Especificar').toString().trim();

          if (nombreBarrio) {
            const cacheKey = `${nombreProvincia.toLowerCase()}-${nombreCiudad.toLowerCase()}-${nombreBarrio.toLowerCase()}`;

            if (barrioCache.has(cacheKey)) {
              barrioFinal = barrioCache.get(cacheKey);
            } else {
              console.log('BUSCANDO PROVINCIA:', nombreProvincia);

              const provincia =
                await this.provinciaService.obtenerPorNombre(nombreProvincia);

              console.log('PROVINCIA ENCONTRADA:', provincia);

              const ciudad = await this.ciudadService.obtenerOCrear(
                nombreCiudad,
                provincia ? provincia.id : null,
              );

              console.log('CIUDAD OBTENIDA:', ciudad);

              barrioFinal = await this.barrioService.obtenerOCrear(
                nombreBarrio,
                ciudad ? ciudad.id : null,
              );

              console.log('BARRIO OBTENIDO:', barrioFinal);
            }
          }

          participantesParaGuardar.push({
            analisis: {id:nuevoAnalisis.id} as any,
            genero: genero ? {id: genero.id} as any: null,
            barrio: barrioFinal ? { id: barrioFinal.id }as any: null,

            nombre: reg.nombre || reg.nombres || null,
            apellido: reg.apellido || reg.apellidos || null,
            dni: parsearNumero(reg.dni || reg.documento),
            correo: reg.correo || reg.email || reg.mail || null,
            edad: parsearNumero(reg.edad),
            telefono: parsearNumero(reg.telefono || reg.celular),
            fecha_creacion: new Date(),
          });
        } catch (err) {
          console.error('ERROR AL PROCESAR ESTA FILA:', reg);
          console.error(err);
          throw err;
        }
      }

      console.log('TOTAL LEÍDOS:', registroAnalizado.length);
      console.log('DATOS DEL PRIMER PARTICIPANTE:', participantesParaGuardar[0]);
      console.log(`--- GUARDANDO ${participantesParaGuardar.length} PARTICIPANTES EN BASE DE DATOS ---`);
      console.log('PASO 3: PARTICIPANTES PREPARADOS:',participantesParaGuardar.length,);

      const participantesCreados = [];
      for (const participanteData of participantesParaGuardar) {
        const dni=participanteData.dni;
        console.log('PASO 5: INTENTANDO GUARDAR:', participanteData);

        if(!dni){
          throw new BadRequestException('Se encontró un participante sin DNI valido');
        }
        console.log('BUSCANDO DNI:', dni);
        const existente = await this.partcipanteService.findByDni(dni);
        console.log('PARTICIPANTE EXISTENTE:', existente);

        if(existente){
          const analisisActuales = existente.analisis??[];
          const yaAsociado =analisisActuales.some((analisis)=>analisis.id===nuevoAnalisis.id);
          if(!yaAsociado){
            existente.analisis = [...analisisActuales,nuevoAnalisis];
            
          const actualizado = await this.partcipanteService.update({id: existente.id,analisis:existente.analisis});
          participantesCreados.push(actualizado);
          }else{
            participantesCreados.push(existente);
          }
        }else{
          const participanteNuevo=await this.partcipanteService.create({...participanteData,analisis:[nuevoAnalisis]});
          participantesCreados.push(participanteNuevo);
        }
        
      }

      await this.analisisService.update(
        { id: nuevoAnalisis.id } as GetAnalisisQuery,
        { cantidad_participante: participantesCreados.length } as PutAnalisisCommand,
      );
      return {
        mensaje: 'Análisis y participantes guardados exitosamente',
        analisisId: nuevoAnalisis.id,
        totalProcesados: participantesCreados.length,
        participantes: participantesCreados,
      };
    }
}
