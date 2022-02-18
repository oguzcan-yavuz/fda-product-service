import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '../../../src/product/product.controller';
import { CreateProductDto } from '../../../src/product/dto/create-product.dto';
import { ProductService } from '../../../src/product/product.service';
import { mock } from 'ts-mockito';
import { ProductEntity } from '../../../src/product/product.entity';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;
  const mockProductEntity: ProductEntity = {
    id: 1,
    name: 'some product',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeAll(async () => {
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
      const spy = jest
        .spyOn(service, 'create')
        .mockResolvedValue(mockProductEntity);

      // Act
      const product = await controller.create(createProductDto);

      // Assert
      expect(product).toBe(mockProductEntity);
      expect(spy).toHaveBeenCalledWith(createProductDto);
    });
  });
});
