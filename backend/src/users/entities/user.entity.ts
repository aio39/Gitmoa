import { ObjectType, Field, Int } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Room } from 'src/rooms/entities/room.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'user' })
@ObjectType()
export class User extends CoreEntity {
  @Column({ nullable: false })
  @Field(() => String, { description: 'GitHub Display Name' })
  displayName: string;

  @Column()
  @Field(() => String)
  username: string;

  @Column()
  @Field(() => String)
  profileUrl: string;

  @Column()
  @Field(() => String)
  email: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  photos?: string;

  @OneToMany(() => Room, (room) => room.creator)
  @Field(() => [Room])
  ownedRooms: Room[];
}
