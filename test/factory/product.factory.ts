import { Factory } from '@jorgebodega/typeorm-seeding';
import { ProductEntity } from '../../src/product/product.entity';
import { faker } from '@faker-js/faker'

export class ProductFactory extends Factory<ProductEntity> {
  protected definition(): Promise<ProductEntity> {
    const product = new ProductEntity();
    product.name = faker.commerce.productName();

    return Promise.resolve(product);
  }
}
