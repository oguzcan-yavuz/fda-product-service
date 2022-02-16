import { Injectable } from '@nestjs/common';
import { Product } from './product.model';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async create(productDetails: Omit<Product, 'id'>): Promise<Product> {
    const productEntity = await this.productRepository.save(productDetails);
    const product = productEntity.toModel();

    return product;
  }
}
