import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import { nanoid } from 'nanoid';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  RelationId,
} from 'typeorm';
import { Tag } from './tag.entity';

@InputType('RoomInputType', { isAbstract: true })
@Entity({ name: 'room' })
@ObjectType()
export class Room extends CoreEntity {
  @Column()
  @Field(() => String)
  @IsString()
  @Length(3, 30)
  name: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Column({ default: false })
  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isSecret?: boolean;

  @Column({ default: true })
  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isCanSearched?: boolean;

  @Column({ select: false, nullable: true })
  @Field(() => String, { nullable: true })
  password?: number;

  @Column({ default: nanoid() })
  @Field(() => String)
  secretLink: string;

  @ManyToOne((type) => User, { onDelete: 'SET NULL' })
  @Field(() => User)
  creator: User;

  @RelationId((room: Room) => room.creator)
  creatorId: number;

  @ManyToMany(() => User)
  @JoinTable({ name: 'participant_of_room' })
  @Field(() => [User])
  participants: User[];

  @ManyToMany(() => User)
  @JoinTable({ name: 'awaiter_of_room' })
  @Field(() => [User])
  awaiters: User[];

  @ManyToMany(() => Tag, (tag) => tag.rooms)
  @JoinTable({ name: 'tag_of_room' })
  @Field(() => [Tag], { nullable: true })
  tags: Tag[];
}
