import { Test, TestingModule } from '@nestjs/testing';
import { ProductRepository } from '../../../src/product/product.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnection } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { envVarsSchema } from '../../../src/config/env.schema';
import { TypeOrmConfigService } from '../../../src/config/database';
import { ProductFactory } from '../../factory/product.factory';

describe('ProductRepository', () => {
  const productFactory = new ProductFactory();
  let repository: ProductRepository;
  let module: TestingModule;

  beforeAll(async () => {
    const envFilePath = `./.env.${process.env.NODE_ENV}`;

    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath,
          validationSchema: envVarsSchema,
        }),
        TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
        TypeOrmModule.forFeature([ProductRepository]),
      ],
      providers: [ProductRepository],
    }).compile();

    repository = module.get<ProductRepository>(ProductRepository);
  });

  beforeEach(async () => {
    // clear the tables before every test
    await getConnection().synchronize(true);
  });

  afterAll(async () => {
    await module.close();
  });

  describe('update product', () => {
    it('should update the product', async () => {
      const createdProduct = await productFactory.create();
      const updateBody = {
        name: 'updated name',
      };

      const updatedProduct = await repository.updateById(
        createdProduct.id,
        updateBody,
      );

      expect(updatedProduct.name).toBe(updateBody.name);
    });
  });
});
