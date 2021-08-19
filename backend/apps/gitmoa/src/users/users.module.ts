import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDayStatsResolver, UsersResolver } from './users.resolver';
import { User, UserDayStats } from '@lib/entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserDayStats])],
  providers: [UsersResolver, UsersService, UserDayStatsResolver],
  exports: [UsersService],
})
export class UsersModule {}
