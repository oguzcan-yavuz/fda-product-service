import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { CreateProductDto } from '../../../src/product/dto/create-product.dto';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from '../../../src/all-exceptions.filter';
import { Logger } from 'nestjs-pino';
import { ProductFactory } from '../../factory/product.factory';
import { getConnection } from 'typeorm';

describe('ProductController (e2e)', () => {
  const productFactory = new ProductFactory();
  let app: INestApplication;
  let prefix = '';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication(null, { bufferLogs: true });
    const configService: ConfigService = app.get(ConfigService);
    prefix = configService.get('URL_PREFIX');
    const logger = app.get(Logger);
    app.setGlobalPrefix(prefix);
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new AllExceptionsFilter(logger));
    app.useLogger(logger);

    await app.init();
  });

  beforeEach(async () => {
    // clear the tables before every test
    await getConnection().synchronize(true);
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

    describe(`/products (GET)`, () => {
      it('should return bad request if pagination is not specified', async () => {
        const url = `/${prefix}/products`;
        const dto = {};

        await request(app.getHttpServer()).get(`${url}`).query(dto).expect(400);
      });

      it('should return the last 5 products', async () => {
        const url = `/${prefix}/products`;
        const dto = {
          limit: 5,
          offset: 5,
        };
        const createdProducts = await productFactory.createMany(12);
        const lastFiveProducts = createdProducts.slice(5, 10);

        const { body: products } = await request(app.getHttpServer())
          .get(`${url}`)
          .query(dto)
          .expect(200);

        expect(products).toHaveLength(5);
        products.forEach((product, index) => {
          const createdProduct = lastFiveProducts[index];
          expect(product.id).toBe(createdProduct.id);
        });
      });
    });
  });
});
