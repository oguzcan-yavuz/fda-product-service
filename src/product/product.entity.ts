import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'product' })
export class ProductEntity {
  @ApiProperty({
    example: '1',
    description: 'The unique identifier of the product',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Cool Product',
    description: 'The name of the product which will be displayed to the users',
  })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({
    example: '2022-02-18T08:28:33.573Z',
    description: 'The date when the product is created at',
  })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({
    example: '2022-02-18T08:28:33.573Z',
    description: 'The date when the product is last updated at',
  })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ApiProperty({
    example: '2022-02-18T08:28:33.573Z',
    description: 'The date when the product is deleted at',
    nullable: true,
  })
  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;
}
