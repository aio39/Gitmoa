import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { Column, Entity, ManyToMany } from 'typeorm';
import { CoreEntity } from './core.entity';
import { Room } from './room.entity';

@InputType('TagInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Tag extends CoreEntity {
  @Column({ unique: true })
  @Field(() => String)
  @IsString()
  @Length(5)
  name: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @IsString()
  icon: string;

  @Field(() => String)
  @Column({ unique: true })
  @IsString()
  slug: string;

  @ManyToMany(() => Room, (room) => room.tags)
  @Field(() => [Room])
  rooms: Room[];
}
