import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import { Room } from './room.entity';

@InputType('TagInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Tag extends CoreEntity {
  @Column({ unique: true })
  @Field((type) => String)
  @IsString()
  @Length(5)
  name: string;

  @Column({ nullable: true })
  @Field((type) => String, { nullable: true })
  @IsString()
  icon: string;

  @Field((type) => String)
  @Column({ unique: true })
  @IsString()
  slug: string;

  @ManyToMany(() => Room, (room) => room.tags)
  @Field(() => [Room])
  rooms: Room[];
}
