import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsResolver } from './rooms.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { Room } from './entities/room.entity';
// import { TagRepository } from './repositories/tag.repository';
import { User, TagRepository, Room, UserDayStats } from '@lib/entity';
import { UsersService } from 'apps/gitmoa/src/users/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room, TagRepository, User, UserDayStats]),
  ],
  providers: [RoomsResolver, RoomsService, UsersService],
  exports: [RoomsService],
})
export class RoomsModule {}
