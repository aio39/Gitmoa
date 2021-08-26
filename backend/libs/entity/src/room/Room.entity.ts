import { RoomDayStats } from '@lib/entity/room/RoomDayStats.entity';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { nanoid } from 'nanoid';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  RelationId,
} from 'typeorm';
import { CoreEntity } from '../core.entity';
import { User } from '../user/User.entity';
import { Tag } from './tag.entity';

export type roomProperty = keyof Room;

@InputType('RoomInputType', { isAbstract: true })
@Entity({ name: 'room' })
@ObjectType()
export class Room extends CoreEntity {
  entityName: 'room';

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

  @Column({ default: 50 })
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  maxNum?: number;

  @Column({ select: false, nullable: true })
  @Field(() => String, { nullable: true })
  password?: number;

  @Column({ default: nanoid() })
  @Field(() => String)
  secretLink: string;

  @Column('datetime', { nullable: true })
  @Field(() => Date)
  lastSyncedAt?: Date;

  @ManyToOne(() => User, { onDelete: 'SET NULL', eager: true })
  @Field(() => User)
  creator: User;

  @RelationId((room: Room) => room.creator)
  creatorId: number;

  @ManyToMany(() => User)
  @JoinTable({ name: 'participant_of_room' })
  @Field(() => [User], { nullable: true })
  participants: User[];

  @ManyToMany(() => User)
  @JoinTable({ name: 'awaiter_of_room' })
  @Field(() => [User])
  awaiters: User[];

  @ManyToMany(() => Tag, (tag) => tag.rooms)
  @JoinTable({ name: 'tag_of_room' })
  @Field(() => [Tag], { nullable: true })
  tags: Tag[];

  @OneToMany(() => RoomDayStats, (stats) => stats.Room, {
    cascade: ['insert', 'update'],
    onUpdate: 'CASCADE',
  })
  @Field(() => [RoomDayStats])
  RoomDayStats?: RoomDayStats[];

  // @OneToMany(
  //   () => RoomDayCommitter,
  //   (roomDayCommitter) => roomDayCommitter.RoomDayStats,
  // )
  // RoomDayCommitter: RoomDayCommitter[];
}
