import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Roles } from './Roles';

@Entity({ name: 'user' })
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  @IsNotEmpty()
  public firstName: string;

  @Column()
  @IsOptional()
  public secondName: string;

  @Column()
  @IsOptional()
  public middleName: string;

  @Column()
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @Column()
  @IsNotEmpty()
  @MinLength(6, {
    message: 'Password cannot be less than 6',
  })
  public password: string;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt: string;

  @ManyToMany(() => Roles, (role: Roles) => role.users, {
    cascade: true,
  })
  @JoinTable({ name: 'user_role' })
  public roles: Roles[];
}
