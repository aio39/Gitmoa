import { RoomDayCommitter } from '@lib/entity/pivot/RoomDayCommitter.entity';
import { UserContribution } from '@lib/entity/user/UserContribution.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import * as cryptoJS from 'crypto-js';
import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Room } from '../room/Room.entity';
import { UserDayStats } from './UserDayStats.entity';

@InputType('UserInputType', { isAbstract: true })
@Entity({ name: 'user' })
@ObjectType()
export class User {
  @PrimaryColumn('int')
  @Field(() => Number, { description: 'GitHub Unique ID' })
  id: number;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  @Column('datetime', { nullable: true })
  @Field(() => Date)
  lastSyncedAt?: Date;

  @Column({ nullable: false })
  @Field(() => String, { description: 'GitHub Display Name' })
  displayName?: string;

  @Column({ nullable: true })
  @Field(() => String, { description: 'Overwritten Profile name' })
  customDisplayName?: string;

  @Column()
  @Field(() => String)
  username: string;

  @Column({ nullable: true })
  @Field(() => String)
  profileUrl?: string;

  @Column({ nullable: true })
  @Field(() => String, { description: 'Overwritten Profile Image' })
  customProfileUrl?: string;

  @Column({ nullable: true })
  @Field(() => String)
  email?: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  photos?: string;

  @Column({ nullable: true })
  @Field(() => String)
  accessToken?: string;

  @OneToMany(() => UserDayStats, (stats) => stats.User)
  @Field(() => [UserDayStats])
  userDayStats?: UserDayStats[];

  @OneToMany(() => Room, (room) => room.creator)
  @Field(() => [Room])
  ownedRooms?: Room[];

  @OneToMany(
    () => UserContribution,
    (userContribution) => userContribution.User,
  )
  userContribution?: UserContribution[];

  @OneToMany(
    () => RoomDayCommitter,
    (roomDayCommitter) => roomDayCommitter.User,
  )
  RoomDayCommitter: RoomDayCommitter[];

  @BeforeInsert()
  @BeforeUpdate()
  async encryptAccessToken(): Promise<void> {
    if (this.accessToken) {
      try {
        console.log('암호화 전 ', this.accessToken);
        this.accessToken = cryptoJS.AES.encrypt(
          this.accessToken,
          process.env.CRYPTO_JS_SECRET_KEY,
        ).toString();
      } catch (e) {
        console.log(e);
        throw new InternalServerErrorException();
      }
    }
  }

  @AfterLoad()
  async decryptAccessToken(): Promise<void> {
    try {
      this.accessToken = cryptoJS.AES.decrypt(
        this.accessToken,
        process.env.CRYPTO_JS_SECRET_KEY,
      ).toString(cryptoJS.enc.Utf8);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
