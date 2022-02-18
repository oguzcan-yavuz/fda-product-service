import { Injectable } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductEntity } from './product.entity';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async create(productDetails: CreateProductDto): Promise<ProductEntity> {
    const productEntity = await this.productRepository.save(productDetails);

    return productEntity;
  }
}
