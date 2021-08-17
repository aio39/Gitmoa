import { EntityName } from '@lib/entity/EntityName';
import { RoomDayStats } from '@lib/entity/room/RoomDayStats.entity';
import { User } from '@lib/entity/user/User.entity';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@InputType(`${EntityName.RoomDayCommitter}Input`, { isAbstract: true })
@Entity({ name: EntityName.RoomDayCommitter })
@ObjectType()
export class RoomDayCommitter {
  @ManyToOne(() => RoomDayStats)
  @JoinColumn([
    { name: 'fk_room_id', referencedColumnName: 'fk_room_id' },
    { name: 'date', referencedColumnName: 'date' },
  ])
  RoomDayStats: RoomDayStats;

  @Field(Int)
  @PrimaryColumn('Int')
  fk_room_id: number;

  @PrimaryColumn('date')
  date!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'fk_user_id' })
  User: User;

  @Column('boolean')
  isCommit: boolean;
}
