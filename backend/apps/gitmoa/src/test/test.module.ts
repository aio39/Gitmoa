import { Room, User, UserContribution, UserDayStats } from '@lib/entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestController } from './test.controller';
import { TestService } from './test.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserContribution, UserDayStats, Room]),
  ],
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {}
