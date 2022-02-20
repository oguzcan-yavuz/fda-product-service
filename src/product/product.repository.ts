import { EntityRepository, getConnection, Repository } from 'typeorm';
import { ProductEntity } from './product.entity';
import { UpdateProductDto } from './dto/update-product.dto';

@EntityRepository(ProductEntity)
export class ProductRepository extends Repository<ProductEntity> {
  async updateById(
    productId: ProductEntity['id'],
    updateBody: UpdateProductDto,
  ): Promise<ProductEntity | undefined> {
    const {
      raw: [product],
    } = await getConnection()
      .createQueryBuilder()
      .update(ProductEntity)
      .set(updateBody)
      .where('id = :id', { id: productId })
      .returning('*')
      .execute();

    return product;
  }
}
