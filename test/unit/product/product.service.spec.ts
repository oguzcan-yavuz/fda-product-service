import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../../../src/product/product.service';
import { ProductRepository } from '../../../src/product/product.repository';
import { mock } from 'ts-mockito';
import { ProductEntity } from '../../../src/product/product.entity';
import { getLoggerToken, PinoLogger } from 'nestjs-pino';
import ExampleException from '../../../src/product/exceptions/example-exception';
import { ListProductsDto } from '../../../src/product/dto/list-products.dto';

describe('ProductService', () => {
  let service: ProductService;
  let repository: ProductRepository;
  const mockProductEntity: ProductEntity = {
    id: 1,
    name: 'some product',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: ProductRepository,
          useValue: mock(ProductRepository),
        },
        {
          provide: getLoggerToken(ProductService.name),
          useValue: mock(PinoLogger),
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<ProductRepository>(ProductRepository);
  });

  describe('create()', () => {
    it('should throw when the test exception is triggered', async () => {
      // Arrange
      const productToCreate: Pick<ProductEntity, 'name'> = {
        name: 'error test',
      };
      jest.spyOn(repository, 'save').mockResolvedValue({
        ...mockProductEntity,
        name: productToCreate.name,
      });

      // Act
      const fn = () => service.create(productToCreate);

      // Assert
      await expect(fn).rejects.toThrow(ExampleException);
    });

    it('should create product and return the product', async () => {
      // Arrange
      const productToCreate: Pick<ProductEntity, 'name'> = {
        name: 'some product',
      };
      const spy = jest
        .spyOn(repository, 'save')
        .mockResolvedValue(mockProductEntity);

      // Act
      const product = await service.create(productToCreate);

      // Assert
      expect(product).toBe(mockProductEntity);
      expect(spy).toHaveBeenCalledWith(productToCreate);
    });
  });

  describe('list()', () => {
    it('should list the products', async () => {
      // Arrange
      const pagination: ListProductsDto = {
        limit: 10,
        offset: 0,
      };
      const mockProductEntities = [...Array(pagination.limit)].map(
        () => mockProductEntity,
      );

      const spy = jest
        .spyOn(repository, 'find')
        .mockResolvedValue(mockProductEntities);

      // Act
      const products = await service.list(pagination);

      // Assert
      expect(products).toHaveLength(pagination.limit);
      expect(spy).toHaveBeenCalledWith({
        take: pagination.limit,
        skip: pagination.offset,
      });
    });
  });
});
