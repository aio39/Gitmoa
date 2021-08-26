import { EntityName } from '@lib/entity/EntityName';
import { User } from '@lib/entity/user/User.entity';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@InputType(`${EntityName.UserDayStats}Input`, { isAbstract: true })
@Entity({ name: EntityName.UserDayStats })
@ObjectType()
export class UserDayStats {
  @Field(() => User)
  @ManyToOne(() => User, { primary: true })
  @JoinColumn({ name: 'fk_user_id' })
  User: User;

  @Column('int')
  @Field(() => Number, { description: 'fk user id' })
  fk_user_id: number;

  @Field(() => String)
  @Column('date', { primary: true })
  date: string;

  @Field(() => Int)
  @Column('smallint')
  total: number;

  @Field(() => Int)
  @Column('smallint')
  commit?: number;

  @Field(() => Int)
  @Column('smallint')
  pullRequest?: number;

  @Field(() => Int)
  @Column('smallint')
  issue?: number;
}
