import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);
  app.setGlobalPrefix(configService.get('URL_PREFIX'));
  app.useGlobalPipes(new ValidationPipe());
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Products Service')
    .setDescription('The products API')
    .setVersion('1.0')
    .addTag('products')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);
  await app.listen(3000);
}
bootstrap();
