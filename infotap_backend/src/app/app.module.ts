import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnalisisModule } from './analisis/analisis.module';
import { ArchivoModule } from './archivos/archivos.module';
import { BarriosModule } from './barrios/barrios.module';
import { ParticipantesModule } from './participantes/participantes.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { CiudadModule } from './ciudad/ciudad.module';
import { GeneroModule } from './genero/genero.module';
import { ProvinciaModule } from './provincia/provincia.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GeolocalizacionService } from './geolocalizacion/service/geolocalizacion.service';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [
    AnalisisModule,
    ArchivoModule,
    BarriosModule,
    ParticipantesModule,
    UsuariosModule,
    CiudadModule,
    GeneroModule,
    ProvinciaModule,
    
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: String(configService.get<string>('DB_PASSWORD', '')),
        database: configService.get<string>('DB_DATABASE', 'infotap_db'),
        autoLoadEntities: true,
        synchronize: true,
        extra: {
          max: 15,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 2000,
        },
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    FirebaseModule,
  ],
  controllers: [AppController],
  providers: [AppService, GeolocalizacionService],
})
export class AppModule {}
