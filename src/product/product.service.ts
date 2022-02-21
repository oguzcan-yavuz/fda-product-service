import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductEntity } from './product.entity';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import ExampleException from './exceptions/example-exception';
import { ListProductsDto } from './dto/list-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    @InjectPinoLogger(ProductService.name)
    private readonly logger: PinoLogger,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<ProductEntity> {
    const product = await this.productRepository.save(createProductDto);

    // for demo purposes, will replace this with a more meaningful business logic exception
    if (product.name === 'error test') {
      throw new ExampleException();
    }

    return product;
  }

  async list({ limit, offset }: ListProductsDto): Promise<ProductEntity[]> {
    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
    });

    return products;
  }

  async get(productId: ProductEntity['id']): Promise<ProductEntity> {
    const product = await this.productRepository.findOne(productId);

    if (!product) {
      throw new NotFoundException();
    }

    return product;
  }

  async update(
    productId: ProductEntity['id'],
    updateBody: UpdateProductDto,
  ): Promise<ProductEntity> {
    const product = await this.productRepository.updateById(
      productId,
      updateBody,
    );

    if (!product) {
      throw new NotFoundException();
    }

    return product;
  }

  async delete(productId: ProductEntity['id']): Promise<void> {
    const { affected } = await this.productRepository.softDelete(productId);

    if (affected === 0) {
      throw new NotFoundException();
    }
  }
}
