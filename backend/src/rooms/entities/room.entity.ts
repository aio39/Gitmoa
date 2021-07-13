import { ObjectType, Field, Int } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

@Entity({ name: 'room' })
@ObjectType()
export class Room extends CoreEntity {
  @Column()
  @Field(() => String)
  name: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  description?: string;

  @ManyToOne((type) => User, { onDelete: 'SET NULL' })
  @Field(() => User)
  creator: User;

  @ManyToMany(() => User)
  @JoinTable()
  @Field(() => [User])
  users: User;
}
