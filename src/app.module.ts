import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { envVarsSchema } from './config/env.schema';
import { TypeOrmConfigService } from './config/database';
import { ProductModule } from './product/product.module';

const envFilePath = `./.env.${process.env.NODE_ENV}`;

@Module({
  imports: [
    LoggerModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath,
      validationSchema: envVarsSchema,
    }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    ProductModule,
  ],
})
export class AppModule {}
