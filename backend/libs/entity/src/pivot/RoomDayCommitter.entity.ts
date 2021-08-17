import { EntityName } from '@lib/entity/EntityName';
import { RoomDayStats } from '@lib/entity/room/RoomDayStats.entity';
import { User } from '@lib/entity/user/User.entity';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@InputType(`${EntityName.RoomDayCommitter}Input`, { isAbstract: true })
@Entity({ name: EntityName.RoomDayCommitter })
@ObjectType()
export class RoomDayCommitter {
  @PrimaryColumn()
  date_room_id: string;

  @ManyToOne(() => RoomDayStats)
  @JoinColumn({ name: 'fk_rds' })
  RoomDayStats: RoomDayStats;

  @Field(Int)
  @Column('int')
  room_id: number;

  @Column('date')
  date: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'fk_user_id' })
  User: User;

  @Column('boolean')
  isCommit: boolean;
}
