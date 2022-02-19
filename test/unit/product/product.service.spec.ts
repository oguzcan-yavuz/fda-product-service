import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../../../src/product/product.service';
import { ProductRepository } from '../../../src/product/product.repository';
import { mock } from 'ts-mockito';
import { ProductEntity } from '../../../src/product/product.entity';
import { getLoggerToken, PinoLogger } from "nestjs-pino";

describe('ProductService', () => {
  let service: ProductService;
  let repository: ProductRepository;
  const mockProductEntity: Partial<ProductEntity> = {
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

  describe('createProduct()', () => {
    it('should create product and return the product', async () => {
      // Arrange
      const productToCreate: Pick<ProductEntity, 'name'> = {
        name: 'some product',
      };
      const spy = jest
        .spyOn(repository, 'save')
        .mockResolvedValue(mockProductEntity as unknown as ProductEntity);

      // Act
      const product = await service.create(productToCreate);

      // Assert
      expect(product).toBe(mockProductEntity);
      expect(spy).toHaveBeenCalledWith(productToCreate);
    });
  });
});
