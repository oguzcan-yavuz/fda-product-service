import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { envVarsSchema } from './config/env.schema';
import { TypeOrmConfigService } from './config/database';
import * as path from 'path';
import * as appRoot from 'app-root-path';

const envFilePath = path.resolve(appRoot.path, `.env.${process.env.NODE_ENV}`);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      validationSchema: envVarsSchema,
    }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    ProductModule,
  ],
})
export class AppModule {}
