import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';
import { Product } from './product.model';
import { mock } from 'ts-mockito';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;
  const mockProduct: Product = {
    id: 1,
    name: 'some product',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: mock(ProductService),
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  describe('createProduct()', () => {
    it('should create product and return the product', async () => {
      // Arrange
      const createProductDto: CreateProductDto = {
        name: 'some product',
      };
      jest.spyOn(service, 'create').mockResolvedValue(mockProduct);

      // Act
      const product = await controller.create(createProductDto);

      // Assert
      expect(product).toBe(mockProduct);
    });
  });
});
