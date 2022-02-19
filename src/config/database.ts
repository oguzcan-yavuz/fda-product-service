import { ConnectionOptions } from 'typeorm';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
    const {
      env: {
        NODE_ENV,
        TYPEORM_CONNECTION,
        TYPEORM_USERNAME,
        TYPEORM_PASSWORD,
        TYPEORM_DATABASE,
        TYPEORM_HOST,
        TYPEORM_PORT,
      },
    } = process;
    const isTestEnvironment = NODE_ENV === 'test';

    const configuration: ConnectionOptions = {
      type: TYPEORM_CONNECTION as 'postgres',
      username: TYPEORM_USERNAME,
      password: TYPEORM_PASSWORD,
      database: TYPEORM_DATABASE,
      host: isTestEnvironment
        ? global.__TESTCONTAINERS_POSTGRES_IP__
        : TYPEORM_HOST,
      port: isTestEnvironment
        ? global.__TESTCONTAINERS_POSTGRES_PORT_5432__
        : TYPEORM_PORT,
      synchronize: isTestEnvironment,
      migrationsRun: isTestEnvironment,
      entities: isTestEnvironment
        ? [path.resolve(__dirname, '..', '**', '*.entity{.ts,.js}')]
        : ['dist/**/*.entity{.ts,.js}'],
      migrations: isTestEnvironment
        ? [path.resolve(__dirname, '..', 'migration', '*{.ts,.js}')]
        : ['dist/migration/*{.ts,.js}'],
    };

    return configuration;
  }
}
