import { EntityName } from '@lib/entity/EntityName';
import { Room } from '@lib/entity/room/Room.entity';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@InputType(`${EntityName.RoomDayStats}Input`, { isAbstract: true })
@Entity({ name: EntityName.RoomDayStats })
@ObjectType()
export class RoomDayStats {
  @PrimaryColumn()
  date_room_id: string;

  @ManyToOne(() => Room, { cascade: ['insert', 'update'], onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'fk_room_id' })
  Room: Room;

  @Column('int')
  fk_room_id: number;

  @Column('date')
  date: string;

  @Field(Int)
  @Column('smallint', { default: 0 })
  total: number;

  @Column('smallint', { default: 0 })
  commit: number;

  @Column('smallint', { default: 0 })
  pullRequest: number;

  @Column('smallint', { default: 0 })
  issue: number;

  @Column('boolean', { default: false })
  isAllCommit: boolean;

  // @OneToMany(() => RoomDayCommitter, (rds) => rds.RoomDayStats)
  // RoomDayCommitters: RoomDayCommitter[];
}
