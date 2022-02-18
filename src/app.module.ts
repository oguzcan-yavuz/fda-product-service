import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { envVarsSchema } from './config/env.schema';
import { TypeOrmConfigService } from './config/database';

const envFilePath = `./.env.${process.env.NODE_ENV}`;

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
