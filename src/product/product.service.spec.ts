import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { Product } from './product.model';
import { ProductRepository } from './product.repository';
import { mock } from 'ts-mockito';
import { ProductEntity } from './product.entity';

describe('ProductService', () => {
  let service: ProductService;
  let repository: ProductRepository;
  const mockProduct: Product = {
    id: 1,
    name: 'some product',
  };
  const mockProductEntity: Partial<ProductEntity> = {
    ...mockProduct,
    createdAt: new Date(),
    updatedAt: new Date(),
    toModel: () => mockProduct,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: ProductRepository,
          useValue: mock(ProductRepository),
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<ProductRepository>(ProductRepository);
  });

  describe('createProduct()', () => {
    it('should create product and return the product', async () => {
      // Arrange
      const productToCreate: Omit<Product, 'id'> = {
        name: 'some product',
      };
      jest
        .spyOn(repository, 'save')
        .mockResolvedValue(mockProductEntity as unknown as ProductEntity);

      // Act
      const product = await service.create(productToCreate);

      // Assert
      expect(product).toBe(mockProduct);
    });
  });
});
