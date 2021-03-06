import { Test, TestingModule } from '@nestjs/testing';
import { mock } from 'ts-mockito';
import { ProductController } from '../../../src/product/product.controller';
import { CreateProductDto } from '../../../src/product/dto/create-product.dto';
import { ProductService } from '../../../src/product/product.service';
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

  afterEach(() => {
    jest.clearAllMocks();
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
      const createdProduct = await controller.create(createProductDto);

      // Assert
      expect(createdProduct).toBe(mockProduct);
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
      const mockProducts = await productFactory.makeMany(10);
      const spy = jest.spyOn(service, 'list').mockResolvedValue(mockProducts);

      // Act
      const products = await controller.list(listProductsDto);

      // Assert
      expect(products).toHaveLength(10);
      expect(spy).toHaveBeenCalledWith(listProductsDto);
    });
  });

  describe('get()', () => {
    it('should return the product', async () => {
      // Arrange
      const mockProduct = await productFactory.make();
      const createdProductId = mockProduct.id;
      const spy = jest.spyOn(service, 'get').mockResolvedValue(mockProduct);

      // Act
      const product = await controller.get(createdProductId);

      // Assert
      expect(product.id).toBe(createdProductId);
      expect(spy).toHaveBeenCalledWith(createdProductId);
    });
  });

  describe('update()', () => {
    it('should return the product', async () => {
      // Arrange
      const mockProduct = await productFactory.make();
      const createdProductId = mockProduct.id;
      const updateBody = {
        name: 'updated name',
      };
      const spy = jest
        .spyOn(service, 'update')
        .mockResolvedValue({ ...mockProduct, ...updateBody });

      // Act
      const updatedProduct = await controller.update(
        createdProductId,
        updateBody,
      );

      // Assert
      expect(updatedProduct.name).toBe(updateBody.name);
      expect(spy).toHaveBeenCalledWith(createdProductId, updateBody);
    });
  });

  describe('delete()', () => {
    it('should return empty', async () => {
      // Arrange
      const mockProduct = await productFactory.make();
      const createdProductId = mockProduct.id;
      const spy = jest.spyOn(service, 'delete').mockResolvedValue(undefined);

      // Act
      const fn = () => controller.delete(createdProductId);

      // Assert
      await expect(fn()).resolves.not.toThrow();
      expect(spy).toHaveBeenCalledWith(createdProductId);
    });
  });
});
