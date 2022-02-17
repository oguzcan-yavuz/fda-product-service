import { Test, TestingModule } from '@nestjs/testing';
import { ProductRepository } from '../../../src/product/product.repository';
import { ProductEntity } from '../../../src/product/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('ProductRepository', () => {
  let repository: ProductRepository;
  let module: TestingModule;
  const POSTGRES_USER = 'integration-test-user';
  const POSTGRES_PASSWORD = 'integration-test-pass';
  const POSTGRES_DB = 'test';
  const POSTGRES_URL = `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${global.__TESTCONTAINERS_POSTGRES_IP__}:${global.__TESTCONTAINERS_POSTGRES_PORT_5432__}/${POSTGRES_DB}`;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          url: POSTGRES_URL,
          entities: [ProductEntity],
          synchronize: true,
          keepConnectionAlive: true,
        }),
        TypeOrmModule.forFeature([ProductEntity]),
      ],
      providers: [ProductRepository],
    }).compile();

    repository = module.get<ProductRepository>(ProductRepository);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
