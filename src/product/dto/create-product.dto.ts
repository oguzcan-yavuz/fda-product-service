import { IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  readonly name: string;
}
