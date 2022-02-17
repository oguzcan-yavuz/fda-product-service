import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    example: 'Cool Product',
    description: 'The name of the product which will be displayed to the users',
  })
  @IsString()
  readonly name: string;
}
