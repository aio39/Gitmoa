import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { Column, Entity, ManyToMany } from 'typeorm';
import { CoreEntity } from '../core.entity';
import { Room } from './Room.entity';

@InputType('TagInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Tag extends CoreEntity {
  @Field(() => String)
  @Column({ unique: true })
  @IsString()
  @Length(5)
  name: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  @IsString()
  icon?: string;

  @Field(() => String, { nullable: true })
  @Column({ unique: true })
  @IsString()
  slug?: string;

  @Field(() => [Room])
  @ManyToMany(() => Room, (room) => room.tags)
  rooms?: Room[];
}
