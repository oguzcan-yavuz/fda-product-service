import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ListProductsDto {
  @ApiProperty({
    example: 10,
    description: 'The total number of products to be returned',
  })
  @IsInt()
  @Type(() => Number)
  readonly limit: number;

  @ApiProperty({
    example: 10,
    description: 'The index to start reading from',
  })
  @IsInt()
  @Type(() => Number)
  readonly offset: number;
}
