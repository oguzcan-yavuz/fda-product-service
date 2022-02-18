import { Test, TestingModule } from '@nestjs/testing';
import { ProductRepository } from '../../../src/product/product.repository';
import { ProductEntity } from '../../../src/product/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../../../src/product/product.model';
import { ConnectionOptions, getRepository } from 'typeorm';

describe('ProductRepository', () => {
  let repository: ProductRepository;
  let module: TestingModule;
  const POSTGRES_USER = 'integration-test-user';
  const POSTGRES_PASSWORD = 'integration-test-pass';
  const POSTGRES_DB = 'test';

  beforeAll(async () => {
    const dbConfig: ConnectionOptions = {
      type: 'postgres',
      host: global.__TESTCONTAINERS_POSTGRES_IP__,
      port: global.__TESTCONTAINERS_POSTGRES_PORT_5432__,
      username: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
      database: POSTGRES_DB,
      entities: [ProductEntity],
      migrations: [__dirname + '../../../src/migrations/*.ts'],
      migrationsRun: true,
      synchronize: true,
    };

    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({ ...dbConfig, keepConnectionAlive: true }),
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
      const product: Omit<Product, 'id'> = {
        name: 'test product',
      };

      const savedProduct = await repository.save(product);

      expect(typeof savedProduct.id).toBe('number');
      expect(savedProduct.name).toBe(product.name);
      expect(savedProduct.createdAt).toBeInstanceOf(Date);
      expect(savedProduct.updatedAt).toBeInstanceOf(Date);
    });
  });
});
