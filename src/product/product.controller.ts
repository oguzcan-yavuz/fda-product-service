import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductEntity } from './product.entity';
import { ProductService } from './product.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ListProductsDto } from './dto/list-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';

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

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Gets the product',
    type: ProductEntity,
  })
  async get(@Param('id', ParseIntPipe) id: number): Promise<ProductEntity> {
    return this.productService.get(id);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Updates the product',
    type: ProductEntity,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductEntity> {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: 204,
    description: 'Soft deletes the product',
  })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.productService.delete(id);
  }
}
