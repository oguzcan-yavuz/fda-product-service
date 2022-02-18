import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { CreateProductDto } from '../../../src/product/dto/create-product.dto';
import { ConfigService } from '@nestjs/config';

describe('ProductController (e2e)', () => {
  let app: INestApplication;
  let prefix = '';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    const configService: ConfigService = app.get(ConfigService);
    prefix = configService.get('URL_PREFIX');
    app.setGlobalPrefix(prefix);
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('products', () => {
    describe(`/products (POST)`, () => {
      it('should return bad request for empty object', async () => {
        const url = `/${prefix}/products`;
        const dto = {};

        await request(app.getHttpServer()).post(`${url}`).send(dto).expect(400);
      });

      it('should create the product', async () => {
        const url = `/${prefix}/products`;
        const dto: CreateProductDto = {
          name: 'cool product',
        };

        const { body } = await request(app.getHttpServer())
          .post(`${url}`)
          .send(dto)
          .expect(201);

        expect(typeof body.id).toBe('number');
        expect(body.name).toBe(dto.name);
      });
    });
  });
});
