import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RoomsService } from './rooms.service';
import { Room } from './entities/room.entity';
import { CreateRoomInput, CreateRoomOutput } from './dto/create-room.input';
import { UpdateRoomInput } from './dto/update-room.input';
import { AuthUser } from 'src/auth/auth-decorator/auth-user.decorator';
import { User } from 'src/users/entities/user.entity';
import {
  ParticipateRoomInput,
  ParticipateRoomOutput,
} from './dto/participate-room.dto';
import { DeleteRoomInput, DeleteRoomOutput } from './dto/delete-room.dto';
import { AllowedRoles, Roles } from 'src/auth/auth-decorator/roles.decorator';

@Resolver(() => Room)
export class RoomsResolver {
  constructor(private readonly roomsService: RoomsService) {}

  @Mutation(() => CreateRoomOutput)
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
}
