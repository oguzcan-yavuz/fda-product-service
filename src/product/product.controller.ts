import { Body, Controller, Post } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductEntity } from './product.entity';
import { ProductService } from './product.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Creates a product',
    type: ProductEntity,
  })
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    return this.productService.create(createProductDto);
  }
}
