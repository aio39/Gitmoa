import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Room } from '../../rooms/entities/room.entity';

// @InputType('UserInputType', { isAbstract: true })
@Entity({ name: 'user' })
@ObjectType()
export class User {
  @PrimaryColumn()
  @Field((type) => Number)
  id: number;

  @CreateDateColumn()
  @Field((type) => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field((type) => Date)
  updatedAt: Date;

  @Column({ nullable: false })
  @Field(() => String, { description: 'GitHub Display Name' })
  displayName: string;

  @Column({ nullable: true })
  @Field(() => String, { description: 'Overwrite Profile name' })
  customDisplayName: string;

  @Column()
  @Field(() => String)
  username: string;

  @Column({ nullable: true })
  @Field(() => String)
  profileUrl: string;

  @Column({ nullable: true })
  @Field(() => String)
  customProfileUrl: string;

  @Column({ nullable: true })
  @Field(() => String)
  email: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  photos?: string;

  @Column({ nullable: true })
  @Field(() => String)
  accessToken: string;

  @OneToMany(() => Room, (room) => room.creator)
  @Field(() => [Room])
  ownedRooms?: Room[];
}
