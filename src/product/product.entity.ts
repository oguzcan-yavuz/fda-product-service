import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';
import { Product } from './product.model';

@Entity()
export class ProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column({ length: 100 })
  name: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  toModel(): Product {
    return {
      id: this.id,
      name: this.name,
    };
  }
}
