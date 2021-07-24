import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { User, UserContribution, UserDayStats } from '@lib/entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserContribution, UserDayStats])],
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {}
