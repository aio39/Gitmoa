import { Room, User, UserContribution, UserDayStats } from '@lib/entity';
import { RoomDayStats } from '@lib/entity/room/RoomDayStats.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestController } from './test.controller';
import { TestService } from './test.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserContribution,
      UserDayStats,
      Room,
      RoomDayStats,
    ]),
  ],
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {}
