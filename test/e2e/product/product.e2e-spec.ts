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
  let baseUrl = '';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication(null, { bufferLogs: true });
    const configService: ConfigService = app.get(ConfigService);
    const prefix = configService.get('URL_PREFIX');
    const logger = app.get(Logger);
    app.setGlobalPrefix(prefix);
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    app.useGlobalFilters(new AllExceptionsFilter(logger));
    app.useLogger(logger);
    baseUrl = `/${prefix}/products`;

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
        const dto = {};

        await request(app.getHttpServer()).post(baseUrl).send(dto).expect(400);
      });

      it('should create the product', async () => {
        const dto: CreateProductDto = {
          name: 'cool product',
        };

        const { body } = await request(app.getHttpServer())
          .post(baseUrl)
          .send(dto)
          .expect(201);

        expect(typeof body.id).toBe('number');
        expect(body.name).toBe(dto.name);
      });
    });

    describe(`/products (GET)`, () => {
      it('should return bad request if pagination is not specified', async () => {
        const dto = {};

        await request(app.getHttpServer()).get(baseUrl).query(dto).expect(400);
      });

      it('should return the last 5 products', async () => {
        const dto = {
          limit: 5,
          offset: 5,
        };
        const createdProducts = await productFactory.createMany(12);
        const lastFiveProducts = createdProducts.slice(5, 10);

        const { body: products } = await request(app.getHttpServer())
          .get(baseUrl)
          .query(dto)
          .expect(200);

        expect(products).toHaveLength(5);
        products.forEach((product, index) => {
          const createdProduct = lastFiveProducts[index];
          expect(product.id).toBe(createdProduct.id);
        });
      });
    });

    describe('/products/:id (GET)', () => {
      it('should return bad request if the id is invalid', async () => {
        const id = 'invalid-id';
        const url = `${baseUrl}/${id}`;

        await request(app.getHttpServer()).get(url).expect(400);
      });

      it('should return not found if the product not exists', async () => {
        const id = '1';
        const url = `${baseUrl}/${id}`;

        await request(app.getHttpServer()).get(url).expect(404);
      });

      it('should return the product', async () => {
        const createdProduct = await productFactory.create();
        const id = createdProduct.id;
        const url = `${baseUrl}/${id}`;

        const { body: product } = await request(app.getHttpServer())
          .get(url)
          .expect(200);

        expect(product.id).toBe(id);
      });
    });

    describe('/products/:id (PATCH)', () => {
      it('should return bad request if the id is invalid', async () => {
        const id = 'invalid-id';
        const url = `${baseUrl}/${id}`;
        const body = {
          name: 'updated name',
        };

        await request(app.getHttpServer()).patch(url).send(body).expect(400);
      });

      it('should return bad request if the payload is invalid', async () => {
        const createdProduct = await productFactory.create();
        const id = createdProduct.id;
        const url = `${baseUrl}/${id}`;
        const body = {
          invalidKey: 'updated name',
        };

        await request(app.getHttpServer()).patch(url).send(body).expect(400);
      });

      it('should return not found if the product not exists', async () => {
        const id = '1';
        const url = `${baseUrl}/${id}`;
        const body = {
          name: 'updated name',
        };

        await request(app.getHttpServer()).patch(url).send(body).expect(404);
      });

      it('should update the product', async () => {
        const createdProduct = await productFactory.create();
        const id = createdProduct.id;
        const url = `${baseUrl}/${id}`;
        const body = {
          name: 'updated name',
        };

        const { body: product } = await request(app.getHttpServer())
          .patch(url)
          .send(body)
          .expect(200);

        expect(product.id).toBe(id);
        expect(product.name).toBe(body.name);
      });
    });

    describe('/products/:id (DELETE)', () => {
      it('should return bad request if the id is invalid', async () => {
        const id = 'invalid-id';
        const url = `${baseUrl}/${id}`;

        await request(app.getHttpServer()).delete(url).expect(400);
      });

      it('should return not found if the product not exists', async () => {
        const id = '1';
        const url = `${baseUrl}/${id}`;

        await request(app.getHttpServer()).delete(url).expect(404);
      });

      it('should delete the product', async () => {
        const createdProduct = await productFactory.create();
        const id = createdProduct.id;
        const url = `${baseUrl}/${id}`;

        await request(app.getHttpServer()).delete(url).expect(204);

        await request(app.getHttpServer()).get(url).expect(404);
      });
    });
  });
});
