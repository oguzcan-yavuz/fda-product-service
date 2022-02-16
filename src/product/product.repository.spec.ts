import { Test, TestingModule } from '@nestjs/testing';
import { ProductRepository } from './product.repository';
import { ProductEntity } from './product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

xdescribe('ProductRepository', () => {
  let repository: ProductRepository;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'root',
          password: 'root',
          database: 'test',
          entities: [ProductEntity],
          synchronize: true,
          keepConnectionAlive: true,
        }),
        TypeOrmModule.forFeature([ProductEntity]),
      ],
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
