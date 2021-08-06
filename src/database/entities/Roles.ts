import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../../enums';
import { Users } from './Users';

@Entity({ name: 'role' })
export class Roles extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'value', type: 'enum', enum: Role })
  public value: Role;

  @Column({ name: 'description', type: 'varchar', length: 10, nullable: false })
  public description: string;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt: string;

  @ManyToMany(() => Users, (user: Users) => user.roles)
  public users: Users[];
}
