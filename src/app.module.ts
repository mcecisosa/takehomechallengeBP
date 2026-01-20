/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/users/user.module';

interface EnvVars {
  DB_HOST: string;
  DB_NAME: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_PORT: number;
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
    }),
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<EnvVars>) => ({
        dialect: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        autoLoadModels: true,
        synchronize: true, // solo en modo DEV, nunca en PRODUCCION
        logging: true,
      }),
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

//ConfigModule es el modulo que lee el .env, lee variables de entorno process.env y las expone via ConfigService
//ConfigModule.forRoot(): “Cargá las variables de entorno al iniciar la aplicación”
//isGlobal: true: “Este módulo está disponible en toda la aplicación sin necesidad de importarlo en cada módulo”

//SequelizeModule? Es el módulo que: Crea la conexión a la base de datos, Registra Sequelize y Administra el lifecycle de la conexión
//¿Por qué forRootAsync y no forRoot? Porque necesitás esto host: config.get('DB_HOST') Y eso: Depende de otro módulo (ConfigModule),
//Depende de runtime, Puede ser async, forRootAsync permite usar DI.

//Ve que el factory necesita ConfigService, Busca un provider de ConfigService y Lo inyecta como parámetro, Es Dependency Injection pura.
//inject: [ConfigService],
//useFactory: (config) => ({ ... }),
//Es equivalente a decir: “Antes de crear Sequelize, dame una instancia de ConfigService”.
//no se inyecta con constructor porque: Esto no es una clase, Es una función factory, Nest no puede usar constructor injection acá,
//Por eso existe inject.
//¿Qué es useFactory exactamente? Es una función que devuelve la configuración del módulo.
//Nest: Ejecuta esta función y Usa lo que retorna para inicializar Sequelize

// Flujo completo (paso a paso)
// Cuando la app arranca:
// 1 Nest carga ConfigModule
// Lee .env
// Prepara ConfigService
// 2 Nest va a crear SequelizeModule
// 3 Ve que es forRootAsync
// 4 Dice: “Necesito ConfigService”
// 5 Inyecta ConfigService en useFactory
// 6 Ejecuta useFactory(config)
// 7 Sequelize se conecta con esos datos

// Si Nest corre fuera de Docker → DB_HOST=localhost
// Si Nest corre dentro de Docker → DB_HOST=nombre_del_servicio
