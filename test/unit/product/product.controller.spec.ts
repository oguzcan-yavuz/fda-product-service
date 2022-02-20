import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '../../../src/product/product.controller';
import { CreateProductDto } from '../../../src/product/dto/create-product.dto';
import { ProductService } from '../../../src/product/product.service';
import { mock } from 'ts-mockito';
import { ListProductsDto } from '../../../src/product/dto/list-products.dto';
import { ProductFactory } from '../../factory/product.factory';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;
  const productFactory = new ProductFactory();

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
      const mockProduct = await productFactory.make(createProductDto);
      const spy = jest.spyOn(service, 'create').mockResolvedValue(mockProduct);

      // Act
      const product = await controller.create(createProductDto);

      // Assert
      expect(product).toBe(mockProduct);
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
      const length = listProductsDto.limit - listProductsDto.offset;
      const mockProducts = await productFactory.makeMany(length);
      const spy = jest.spyOn(service, 'list').mockResolvedValue(mockProducts);

      // Act
      const products = await controller.list(listProductsDto);

      // Assert
      expect(products).toHaveLength(length);
      expect(spy).toHaveBeenCalledWith(listProductsDto);
    });
  });
});
