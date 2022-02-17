import { ApiProperty } from '@nestjs/swagger';

export class Product {
  @ApiProperty({
    example: '1',
    description: 'The unique identifier of the product',
  })
  id: number;

  @ApiProperty({
    example: 'Cool Product',
    description: 'The name of the product which will be displayed to the users',
  })
  name: string;
}
