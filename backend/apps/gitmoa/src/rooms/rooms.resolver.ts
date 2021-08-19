import {
  Resolver,
  Mutation,
  Args,
  Query,
  Parent,
  ResolveField,
  ID,
} from '@nestjs/graphql';
import { RoomsService } from './rooms.service';
// import { Room } from './entities/room.entity';
import { CreateRoomInput, CreateRoomOutput } from './dto/create-room.input';
import {
  ParticipateRoomInput,
  ParticipateRoomOutput,
} from './dto/participate-room.dto';
import { DeleteRoomInput, DeleteRoomOutput } from './dto/delete-room.dto';
import { AuthUser } from '../auth/auth-decorator/auth-user.decorator';
// import { User } from '../users/entities/user.entity';
import { AllowedRoles, Roles } from '../auth/auth-decorator/roles.decorator';
import { User, Room, Tag } from '@lib/entity';
import {
  FindRoomByIdInput,
  FindRoomByIdOutput,
} from 'apps/gitmoa/src/rooms/dto/find-room-by-id.dto';
import { UsersService } from 'apps/gitmoa/src/users/users.service';
import { Loader } from 'apps/gitmoa/src/common/dataloader';
import * as DataLoader from 'dataloader';
import {
  FindRoomsOutput,
  FindRoomsInput,
} from 'apps/gitmoa/src/rooms/dto/find-rooms.dto';

@Resolver(() => Room)
export class RoomsResolver {
  constructor(
    private readonly roomsService: RoomsService,
    private readonly usersService: UsersService,
  ) {}

  @Mutation(() => CreateRoomOutput)
  @Roles([AllowedRoles.Login])
  async createRoom(
    @AuthUser() authUser: User,
    @Args('input') createRoomInput: CreateRoomInput,
  ): Promise<CreateRoomOutput> {
    return this.roomsService.createRoom(authUser, createRoomInput);
  }

  // @Mutation(( ))
  // async updateRoomProfile(): Promise<>

  @Mutation(() => DeleteRoomOutput)
  @Roles([AllowedRoles.Creator])
  async deleteRoom(
    @Args('input') { id: roomId }: DeleteRoomInput,
  ): Promise<DeleteRoomOutput> {
    return this.roomsService.deleteRoom(roomId);
  }

  @Mutation(() => ParticipateRoomOutput)
  async participateRoom(
    @Args('input') { id: roomId }: ParticipateRoomInput,
    @AuthUser() { id: userId }: User,
  ): Promise<ParticipateRoomOutput> {
    return this.roomsService.participateRoom(userId, roomId);
  }

  @Query(() => FindRoomByIdOutput)
  async findRoomById(
    @Args('input') { id: roomId }: FindRoomByIdInput,
  ): Promise<FindRoomByIdOutput> {
    return this.roomsService.findOneRoom(roomId);
  }

  @Query(() => FindRoomsOutput)
  async findRooms(): // @Args('input') { id: roomId }: FindRoomsInput,
  Promise<FindRoomsOutput> {
    return this.roomsService.findRooms();
  }

  @ResolveField()
  async participants(@Parent() room: Room) {
    const { id } = room;
    console.log(id);
    return this.roomsService.findParticipants(id);
  }

  @ResolveField()
  async tags(@Parent() room: Room): Promise<Tag[]> {
    const { id } = room;
    return this.roomsService.findTags(id);
  }

  // @ResolveField()
  // async creator(@Parent() room: Room): Promise<Tag[]> {
  //   const { id } = room;
  //   return this.roomsService.findTags(id);
  // }
}
