import { Injectable,Logger, Param } from '@nestjs/common';
import axios from 'axios';
import { format } from 'path';
import { timeout } from 'rxjs';

@Injectable()
export class GeolocalizacionService {
    private readonly logger = new Logger(GeolocalizacionService.name);

async obtenerCoordenadas(
    barrio: string,
    ciudad: string,
    provincia: string,
): Promise<{ latitud: number; longitud: number } | null> {

    try {
        const consulta = [barrio, ciudad, provincia, 'Argentina']
            .filter(Boolean)
            .join(',');

        console.log('========== GEOCALIZACIÓN ==========');
        console.log('Barrio recibido:', barrio);
        console.log('Ciudad recibida:', ciudad);
        console.log('Provincia recibida:', provincia);
        console.log('Consulta enviada:', consulta);

        const respuesta = await axios.get(
            'https://nominatim.openstreetmap.org/search',
            {
                params: {
                    q: consulta,
                    format: 'jsonv2',
                    limit: 1,
                    countrycodes: 'ar',
                },
                headers: {
                    'User-Agent': 'InfoTap/1.0',
                },
                timeout: 10000,
            },
        );

        console.log('Respuesta de la API:', respuesta.data);

        if (!respuesta.data.length) {
            console.log('No se encontraron coordenadas');
            return null;
        }

        const coordenadas = {
            latitud: Number(respuesta.data[0].lat),
            longitud: Number(respuesta.data[0].lon),
        };

        console.log('Coordenadas obtenidas:', coordenadas);

        return coordenadas;

    } catch (error) {
        console.error('Error de geolocalización:', error);
        return null;
    }
}
}
