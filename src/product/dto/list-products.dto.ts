import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ListProductsDto {
  @ApiProperty({
    example: 10,
    description: 'The total number of products to be returned',
  })
  @IsNumber()
  readonly limit: number;

  @ApiProperty({
    example: 10,
    description: 'The index to start reading from',
  })
  @IsNumber()
  readonly offset: number;
}
