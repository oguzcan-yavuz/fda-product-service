import { Injectable } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductEntity } from './product.entity';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import ExampleException from './exceptions/example-exception';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    @InjectPinoLogger(ProductService.name)
    private readonly logger: PinoLogger,
  ) {}

  async create(productDetails: CreateProductDto): Promise<ProductEntity> {
    const productEntity = await this.productRepository.save(productDetails);

    // for demo purposes, will replace this with a more meaningful business logic exception
    if (productEntity.name === 'error test') {
      throw new ExampleException();
    }

    return productEntity;
  }
}
