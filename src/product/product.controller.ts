import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductEntity } from './product.entity';
import { ProductService } from './product.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ListProductsDto } from './dto/list-products.dto';

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

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Lists the products',
    type: [ProductEntity],
  })
  async list(
    @Query() listProductsDto: ListProductsDto,
  ): Promise<ProductEntity[]> {
    return this.productService.list(listProductsDto);
  }
}
