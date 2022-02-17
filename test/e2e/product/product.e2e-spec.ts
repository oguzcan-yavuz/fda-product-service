import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { CreateProductDto } from '../../../src/product/dto/create-product.dto';

describe('ProductController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('products', () => {
    it('/products (POST)', async () => {
      const dto: CreateProductDto = {
        name: 'cool product',
      };

      const { body } = await request(app.getHttpServer())
        .post('/products')
        .send(dto)
        .expect(201);

      expect(typeof body.id).toBe('number');
      expect(body.name).toBe(dto.name);
    });
  });
});
