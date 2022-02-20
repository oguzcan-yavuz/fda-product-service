import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../../../src/product/product.service';
import { ProductRepository } from '../../../src/product/product.repository';
import { mock } from 'ts-mockito';
import { ProductEntity } from '../../../src/product/product.entity';
import { getLoggerToken, PinoLogger } from 'nestjs-pino';
import ExampleException from '../../../src/product/exceptions/example-exception';
import { ListProductsDto } from '../../../src/product/dto/list-products.dto';
import { ProductFactory } from '../../factory/product.factory';
import { NotFoundException } from '@nestjs/common';

describe('ProductService', () => {
  let service: ProductService;
  let repository: ProductRepository;
  const productFactory = new ProductFactory();

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

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create()', () => {
    it('should throw when the test exception is triggered', async () => {
      // Arrange
      const productToCreate: Pick<ProductEntity, 'name'> = {
        name: 'error test',
      };
      const mockProduct = await productFactory.make(productToCreate);
      jest.spyOn(repository, 'save').mockResolvedValue(mockProduct);

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
      const mockProduct = await productFactory.make(productToCreate);
      const spy = jest.spyOn(repository, 'save').mockResolvedValue(mockProduct);

      // Act
      const product = await service.create(productToCreate);

      // Assert
      expect(product).toBe(mockProduct);
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
      const mockProducts = await productFactory.makeMany(10);

      const spy = jest
        .spyOn(repository, 'find')
        .mockResolvedValue(mockProducts);

      // Act
      const products = await service.list(pagination);

      // Assert
      expect(products).toHaveLength(10);
      expect(spy).toHaveBeenCalledWith({
        take: pagination.limit,
        skip: pagination.offset,
      });
    });

    describe('get()', () => {
      it('should throw not found if the product not exists', async () => {
        // Arrange
        const id = 1;
        jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

        // Act
        const fn = () => service.get(id);

        // Assert
        await expect(fn).rejects.toThrow(NotFoundException);
      });

      it('should return the product', async () => {
        // Arrange
        const mockProduct = await productFactory.make();
        const createdProductId = mockProduct.id;
        const spy = jest
          .spyOn(repository, 'findOne')
          .mockResolvedValue(mockProduct);

        // Act
        const product = await service.get(createdProductId);

        // Assert
        expect(product.id).toBe(mockProduct.id);
        expect(spy).toHaveBeenCalledWith(createdProductId);
      });
    });
  });
});
