import DataLoader = require('dataloader');
import { Injectable } from '@nestjs/common';
import {
  NestDataLoader,
  OrderedNestDataLoader,
} from 'apps/gitmoa/src/common/dataloader';
import { RoomsService } from 'apps/gitmoa/src/rooms/rooms.service';
import { Room, User } from '@lib/entity';

// @Injectable()
// export class RoomLoader implements NestDataLoader<number, Room> {
//   constructor(private readonly roomService: RoomsService) {}

//   generateDataLoader(): DataLoader<number, Room> {
//     return new DataLoader<number, Room>((keys) =>
//       this.roomService.findRoomsByIds(keys),
//     );
//   }
// }

// @Injectable()
// export class ParticipantsLoader extends OrderedNestDataLoader<
//   User['id'],
//   User
// > {
//   constructor(private readonly roomService: RoomsService) {
//     super();
//   }

//   protected getOptions = () => ({
//     query: (keys: Array<User['id']>) => this.roomService.findRoomsByIds(keys),
//   });
// }
