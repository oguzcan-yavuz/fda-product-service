import { Test, TestingModule } from '@nestjs/testing';
import { ProductRepository } from '../../../src/product/product.repository';
import { ProductEntity } from '../../../src/product/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getRepository } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { envVarsSchema } from '../../../src/config/env.schema';
import { TypeOrmConfigService } from '../../../src/config/database';

describe('ProductRepository', () => {
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
        TypeOrmModule.forFeature([ProductEntity]),
      ],
      providers: [ProductRepository],
    }).compile();

    repository = getRepository<ProductEntity>(ProductEntity);
  });

  afterAll(async () => {
    await module.close();
  });

  describe('create product', () => {
    it('should create a product', async () => {
      const product: Pick<ProductEntity, 'name'> = {
        name: 'test product',
      };

      const savedProduct = await repository.save(product);

      expect(typeof savedProduct.id).toBe('number');
      expect(savedProduct.name).toBe(product.name);
      expect(savedProduct.createdAt).toBeInstanceOf(Date);
      expect(savedProduct.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('list products', () => {
    it('should list the products', async () => {
      const pagination = {
        take: 10,
        skip: 0,
      };
      const products = await repository.find(pagination);

      expect(products).toHaveLength(pagination.take);
      for (const product of products) {
        for (const property in ProductEntity) {
          expect(product).toHaveProperty(property);
        }
      }
    });
  });
});
