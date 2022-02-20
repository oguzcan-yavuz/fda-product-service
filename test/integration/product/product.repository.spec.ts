import { Test, TestingModule } from '@nestjs/testing';
import { ProductRepository } from '../../../src/product/product.repository';
import { ProductEntity } from '../../../src/product/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnection, getRepository } from 'typeorm';
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
        TypeOrmModule.forFeature([ProductEntity]),
      ],
      providers: [ProductRepository],
    }).compile();

    repository = getRepository<ProductEntity>(ProductEntity);
  });

  beforeEach(async () => {
    // clear the tables before every test
    await getConnection().synchronize(true);
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
        take: 5,
        skip: 10,
      };
      const createdProducts = await productFactory.createMany(17);
      const paginatedProducts = createdProducts.slice(10, 15);

      const products = await repository.find(pagination);

      expect(products).toHaveLength(5);
      products.forEach((product, index) => {
        expect(product.id).toBe(paginatedProducts[index].id);
      });
    });
  });

  describe('get product', () => {
    it('should get the product', async () => {
      const createdProduct = await productFactory.create();

      const product = await repository.findOne(createdProduct.id);

      expect(product.id).toBe(createdProduct.id);
    });
  });
});
