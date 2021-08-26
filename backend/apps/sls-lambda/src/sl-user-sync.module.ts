import {
  Room,
  RoomDayCommitter,
  RoomDayStats,
  Tag,
  User,
  UserContribution,
  UserDayStats,
} from '@lib/entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlUserSyncController } from './sl-user-sync.controller';
import { SlUserSyncService } from './sl-user-sync.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: process.env.NODE_ENV === 'dev', // TypeOrm의 Entity에 맞춰 실제 DB에 Migration
      logging: process.env.NODE_ENV !== 'prod',
      entities: [
        User,
        UserContribution,
        UserDayStats,
        Tag,
        Room,
        RoomDayCommitter,
        RoomDayStats,
      ],
    }),
    TypeOrmModule.forFeature([
      User,
      UserContribution,
      UserDayStats,
      Room,
      RoomDayStats,
    ]),
  ],
  controllers: [SlUserSyncController],
  providers: [SlUserSyncService],
})
export class SlUserSyncModule {}
