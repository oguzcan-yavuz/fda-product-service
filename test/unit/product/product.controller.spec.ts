import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '../../../src/product/product.controller';
import { CreateProductDto } from '../../../src/product/dto/create-product.dto';
import { ProductService } from '../../../src/product/product.service';
import { mock } from 'ts-mockito';
import { ProductEntity } from '../../../src/product/product.entity';
import { ListProductsDto } from '../../../src/product/dto/list-products.dto';

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

  describe('create()', () => {
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

  describe('list()', () => {
    it('should return the products', async () => {
      // Arrange
      const listProductsDto: ListProductsDto = {
        limit: 10,
        offset: 0,
      };
      const mockProductEntities = [...Array(listProductsDto.limit)].map(
        () => mockProductEntity,
      );
      const spy = jest
        .spyOn(service, 'list')
        .mockResolvedValue(mockProductEntities);

      // Act
      const products = await controller.list(listProductsDto);

      // Assert
      expect(products).toHaveLength(listProductsDto.limit);
      expect(spy).toHaveBeenCalledWith(listProductsDto);
    });
  });
});
